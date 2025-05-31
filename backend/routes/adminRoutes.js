
const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All admin routes are protected and restricted to admin role
router.use(protect, restrictTo('admin'));

// Admin dashboard stats
router.get('/stats', (req, res) => {
  res.json({ message: 'Admin stats - To be implemented' });
});

// User management
router.get('/users', (req, res) => {
  res.json({ message: 'Get all users - To be implemented' });
});

router.put('/users/:id/status', (req, res) => {
  res.json({ message: 'Update user status - To be implemented' });
});

// Project management
router.get('/projects', (req, res) => {
  res.json({ message: 'Get all projects - To be implemented' });
});

module.exports = router;
