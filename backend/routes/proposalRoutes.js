
const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Proposal routes will be implemented here
router.get('/project/:projectId', (req, res) => {
  res.json({ message: 'Get proposals for project - To be implemented' });
});

router.post('/project/:projectId', restrictTo('freelancer'), (req, res) => {
  res.json({ message: 'Submit proposal - To be implemented' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update proposal - To be implemented' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete proposal - To be implemented' });
});

module.exports = router;
