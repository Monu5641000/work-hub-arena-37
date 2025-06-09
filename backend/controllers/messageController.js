const Message = require('../models/Message');
const User = require('../models/User');
const Order = require('../models/Order');

// Content filtering patterns
const RESTRICTED_PATTERNS = [
  // Phone numbers
  /\b(\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g,
  // Email addresses
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Social media handles
  /@[A-Za-z0-9_]+/g,
  // URLs
  /https?:\/\/[^\s]+/g,
  // Common address keywords
  /\b(address|location|meet\s+at|come\s+to|visit\s+me)\b/gi,
  // WhatsApp, Telegram, etc.
  /\b(whatsapp|telegram|instagram|facebook|twitter|linkedin|snapchat|tiktok)\b/gi
];

const filterContent = (content) => {
  let filteredContent = content;
  let hasViolation = false;

  RESTRICTED_PATTERNS.forEach(pattern => {
    if (pattern.test(filteredContent)) {
      hasViolation = true;
      filteredContent = filteredContent.replace(pattern, '[CONTENT FILTERED]');
    }
  });

  return { filteredContent, hasViolation };
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, attachments = [], orderId } = req.body;

    // Filter content for restricted information
    const { filteredContent, hasViolation } = filterContent(content);

    // Generate conversation ID - check if there's an existing order between users
    let conversationId = [req.user.id, recipientId].sort().join('_');
    let relatedOrder = null;

    // If orderId is provided, use that order's conversation
    if (orderId) {
      relatedOrder = await Order.findById(orderId);
      if (relatedOrder && 
          ((relatedOrder.client.toString() === req.user.id && relatedOrder.freelancer.toString() === recipientId) ||
           (relatedOrder.freelancer.toString() === req.user.id && relatedOrder.client.toString() === recipientId))) {
        conversationId = relatedOrder.conversationId;
      }
    } else {
      // Check if there's an active order between these users
      relatedOrder = await Order.findOne({
        $or: [
          { client: req.user.id, freelancer: recipientId },
          { client: recipientId, freelancer: req.user.id }
        ],
        status: { $in: ['pending', 'accepted', 'in_progress', 'delivered', 'revision_requested'] }
      }).sort({ createdAt: -1 });

      if (relatedOrder) {
        conversationId = relatedOrder.conversationId;
      }
    }

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      content: filteredContent,
      attachments,
      conversationId,
      order: relatedOrder?._id || null,
      isFiltered: hasViolation
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profilePicture role')
      .populate('recipient', 'firstName lastName profilePicture role')
      .populate('order', 'orderNumber status');

    // Update last message time for the order if applicable
    if (relatedOrder) {
      relatedOrder.lastMessageAt = new Date();
      await relatedOrder.save();
    }

    // Emit real-time message via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${recipientId}`).emit('newMessage', populatedMessage);
      io.to(`user_${req.user.id}`).emit('newMessage', populatedMessage);
    }

    res.status(201).json({
      success: true,
      data: populatedMessage,
      warning: hasViolation ? 'Some content was filtered due to policy violations' : null
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Check if there's an order-based conversation
    const order = await Order.findOne({
      $or: [
        { client: req.user.id, freelancer: userId },
        { client: userId, freelancer: req.user.id }
      ]
    }).sort({ createdAt: -1 });

    const conversationId = order?.conversationId || [req.user.id, userId].sort().join('_');

    const messages = await Message.find({ conversationId })
      .populate('sender', 'firstName lastName profilePicture role')
      .populate('recipient', 'firstName lastName profilePicture role')
      .populate('order', 'orderNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Message.countDocuments({ conversationId });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        recipient: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      data: messages.reverse(),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      order: order ? {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status
      } : null
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation'
    });
  }
};

// Get conversations list
exports.getConversationsList = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Get all unique conversation partners with order context
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', req.user._id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          },
          orderId: { $first: '$order' }
        }
      },
      {
        $skip: skip
      },
      {
        $limit: Number(limit)
      }
    ]);

    // Populate user details and order information
    const populatedConversations = await Message.populate(conversations, [
      {
        path: 'lastMessage.sender',
        select: 'firstName lastName profilePicture role'
      },
      {
        path: 'lastMessage.recipient',
        select: 'firstName lastName profilePicture role'
      },
      {
        path: 'orderId',
        select: 'orderNumber status service',
        populate: {
          path: 'service',
          select: 'title'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: populatedConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations'
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.body;

    await Message.updateMany(
      {
        conversationId,
        recipient: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read'
    });
  }
};

// Get unread messages count
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count'
    });
  }
};

// Admin: Get all users for messaging
exports.getAdminUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { page = 1, limit = 20, search = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = { role: { $in: ['client', 'freelancer'] } };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('firstName lastName email profilePicture role createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Admin: Send message to any user
exports.adminSendMessage = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { recipientId, content } = req.body;

    // Generate conversation ID (admin messages use special format)
    const conversationId = `admin_${req.user.id}_${recipientId}`;

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      content,
      conversationId,
      type: 'system'
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profilePicture role')
      .populate('recipient', 'firstName lastName profilePicture role');

    // Emit real-time message via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${recipientId}`).emit('newMessage', populatedMessage);
      io.to(`user_${req.user.id}`).emit('newMessage', populatedMessage);
    }

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    console.error('Admin send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending admin message',
      error: error.message
    });
  }
};
