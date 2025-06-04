
const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  updateRequirements
} = require('../controllers/authController');
const {
  sendOTP,
  verifyOTP,
  googleLogin,
  selectRole,
  getMe: getOtplessMe
} = require('../controllers/otplessAuthController');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// OTPless routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google-login', googleLogin);

// Traditional auth routes
router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getOtplessMe);
router.post('/select-role', protect, selectRole);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/requirements', protect, updateRequirements);

module.exports = router;
