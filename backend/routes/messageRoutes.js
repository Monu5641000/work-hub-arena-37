
const express = require('express');
const {
  sendMessage,
  getConversation,
  getConversationsList,
  markAsRead,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

router.post('/send', sendMessage);
router.get('/conversations', getConversationsList);
router.get('/conversation/:userId', getConversation);
router.put('/mark-read', markAsRead);
router.get('/unread-count', getUnreadCount);

module.exports = router;
