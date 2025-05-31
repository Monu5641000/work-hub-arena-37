
const Message = require('../models/Message');
const User = require('../models/User');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, messageType = 'text', files } = req.body;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    const conversationId = Message.createConversationId(req.user.id, recipientId);

    const message = await Message.create({
      conversationId,
      participants: [req.user.id, recipientId],
      sender: req.user.id,
      recipient: recipientId,
      messageType,
      content,
      files
    });

    await message.populate('sender', 'firstName lastName profilePicture');
    await message.populate('recipient', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// Get conversation
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.getConversation(
      req.user.id,
      userId,
      parseInt(limit),
      parseInt(page)
    );

    res.status(200).json({
      success: true,
      data: messages.reverse() // Reverse to show oldest first
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
    const conversations = await Message.getConversationsList(req.user.id);

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations'
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;

    await Message.updateMany(
      {
        _id: { $in: messageIds },
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
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read'
    });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user.id);

    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count'
    });
  }
};
