
const Message = require('../models/Message');
const User = require('../models/User');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, attachments = [], orderId } = req.body;

    // Generate conversation ID
    const conversationId = [req.user.id, recipientId].sort().join('_');

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      content,
      attachments,
      conversationId,
      order: orderId || null
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture');

    // Emit real-time message via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${recipientId}`).emit('newMessage', populatedMessage);
    }

    res.status(201).json({
      success: true,
      data: populatedMessage
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

    const conversationId = [req.user.id, userId].sort().join('_');

    const messages = await Message.find({ conversationId })
      .populate('sender', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Message.countDocuments({ conversationId });

    res.status(200).json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
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

    // Get all unique conversation partners
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
          }
        }
      },
      {
        $skip: skip
      },
      {
        $limit: Number(limit)
      }
    ]);

    // Populate user details
    const populatedConversations = await Message.populate(conversations, [
      {
        path: 'lastMessage.sender',
        select: 'firstName lastName profilePicture'
      },
      {
        path: 'lastMessage.recipient',
        select: 'firstName lastName profilePicture'
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
