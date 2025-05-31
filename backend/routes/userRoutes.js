
const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

// User management routes
router.get('/freelancers', (req, res) => {
  res.json({ message: 'Get freelancers - To be implemented' });
});

router.get('/profile/:id', (req, res) => {
  res.json({ message: 'Get user profile - To be implemented' });
});

module.exports = router;
