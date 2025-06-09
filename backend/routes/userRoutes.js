
const express = require('express');
const {
  updateProfile,
  getProfile,
  uploadProfilePicture,
  getFreelancerProfile,
  updateFreelancerProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/profile/:username', getFreelancerProfile);

// Protected routes
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/picture', upload.single('profilePicture'), uploadProfilePicture);
router.put('/freelancer-profile', updateFreelancerProfile);

module.exports = router;
