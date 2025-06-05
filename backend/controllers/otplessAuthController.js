
const User = require('../models/User');
const OTPService = require('../utils/otpService');
const GoogleAuthService = require('../utils/googleAuthService');
const UserService = require('../utils/userService');

const googleAuthService = new GoogleAuthService();

// Send OTP using OTPless
exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const cleanPhone = OTPService.validatePhoneNumber(phoneNumber);
    const result = await OTPService.sendOTP(cleanPhone);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        orderId: result.orderId
      }
    });
  } catch (error) {
    console.error('OTP sending error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP',
      error: error.message
    });
  }
};

// Verify OTP and login/register user
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp, orderId } = req.body;
    const cleanPhone = OTPService.validatePhoneNumber(phoneNumber);
    
    const otpResult = await OTPService.verifyOTP(cleanPhone, otp, orderId);
    const user = await UserService.findOrCreateOTPUser(cleanPhone, otpResult.userId);
    const token = UserService.generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: UserService.formatUserResponse(user)
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'OTP verification failed',
      error: error.message
    });
  }
};

// Google OAuth login
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    const googleUser = await googleAuthService.verifyIdToken(idToken);
    const user = await UserService.findOrCreateGoogleUser(googleUser);
    const token = UserService.generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: UserService.formatUserResponse(user)
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Google login failed',
      error: error.message
    });
  }
};

// Select user role
exports.selectRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id;

    const user = await UserService.updateUserRole(userId, role);

    res.status(200).json({
      success: true,
      user: UserService.formatUserResponse(user)
    });
  } catch (error) {
    console.error('Role selection error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to select role',
      error: error.message
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: UserService.formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};
