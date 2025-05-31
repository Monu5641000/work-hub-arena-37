
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'order', 'system'],
    default: 'text'
  },
  content: {
    type: String,
    required: function() {
      return this.messageType === 'text' || this.messageType === 'system';
    }
  },
  files: [{
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deletedAt: { type: Date, default: Date.now }
  }],
  editedAt: Date,
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    addedAt: { type: Date, default: Date.now }
  }],
  isSystemMessage: {
    type: Boolean,
    default: false
  },
  metadata: {
    orderUpdate: {
      oldStatus: String,
      newStatus: String,
      orderNumber: String
    },
    serviceLink: {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      },
      title: String,
      price: Number
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ recipient: 1, isRead: 1 });
MessageSchema.index({ participants: 1 });

// Static method to create conversation ID
MessageSchema.statics.createConversationId = function(userId1, userId2) {
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `conv_${sortedIds[0]}_${sortedIds[1]}`;
};

// Static method to get conversation
MessageSchema.statics.getConversation = function(userId1, userId2, limit = 50, page = 1) {
  const conversationId = this.createConversationId(userId1, userId2);
  const skip = (page - 1) * limit;
  
  return this.find({ 
    conversationId,
    isDeleted: false
  })
  .populate('sender', 'name profilePicture')
  .populate('recipient', 'name profilePicture')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);
};

// Method to mark as read
MessageSchema.methods.markAsRead = function(userId) {
  if (this.recipient.toString() === userId.toString() && !this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get unread count
MessageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false,
    isDeleted: false
  });
};

// Static method to get conversations list
MessageSchema.statics.getConversationsList = function(userId) {
  return this.aggregate([
    {
      $match: {
        participants: mongoose.Types.ObjectId(userId),
        isDeleted: false
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
                  { $eq: ['$recipient', mongoose.Types.ObjectId(userId)] },
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
      $lookup: {
        from: 'users',
        localField: 'lastMessage.participants',
        foreignField: '_id',
        as: 'participants'
      }
    },
    {
      $project: {
        conversationId: '$_id',
        lastMessage: 1,
        unreadCount: 1,
        otherParticipant: {
          $filter: {
            input: '$participants',
            cond: { $ne: ['$$this._id', mongoose.Types.ObjectId(userId)] }
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);
};

module.exports = mongoose.model('Message', MessageSchema);
