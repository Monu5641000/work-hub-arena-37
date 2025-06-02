
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

const handleConnection = (io, socket) => {
  console.log(`User ${socket.user.firstName} connected`);

  // Join user to their personal room
  socket.join(`user_${socket.userId}`);

  // Join room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
  });

  // Leave room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.userId} left room ${roomId}`);
  });

  // Handle new message
  socket.on('send_message', async (messageData) => {
    try {
      const { recipientId, content, messageType = 'text', conversationId } = messageData;

      const message = await Message.create({
        conversationId,
        participants: [socket.userId, recipientId],
        sender: socket.userId,
        recipient: recipientId,
        messageType,
        content
      });

      await message.populate('sender', 'firstName lastName profilePicture');
      await message.populate('recipient', 'firstName lastName profilePicture');

      // Send to both users
      io.to(`user_${socket.userId}`).emit('new_message', message);
      io.to(`user_${recipientId}`).emit('new_message', message);
      
      // Also send to chat room if they're in it
      io.to(`chat_${recipientId}`).emit('new_message', message);
      io.to(`chat_${socket.userId}`).emit('new_message', message);

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle proposal updates
  socket.on('proposal_update', (proposalData) => {
    // Broadcast to relevant users
    if (proposalData.clientId) {
      io.to(`user_${proposalData.clientId}`).emit('proposal_updated', proposalData);
    }
    if (proposalData.freelancerId) {
      io.to(`user_${proposalData.freelancerId}`).emit('proposal_updated', proposalData);
    }
  });

  // Handle typing indicators
  socket.on('typing_start', ({ recipientId }) => {
    io.to(`user_${recipientId}`).emit('user_typing', {
      userId: socket.userId,
      userName: socket.user.firstName
    });
  });

  socket.on('typing_stop', ({ recipientId }) => {
    io.to(`user_${recipientId}`).emit('user_stopped_typing', {
      userId: socket.userId
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.firstName} disconnected`);
  });
};

module.exports = {
  socketAuth,
  handleConnection
};
