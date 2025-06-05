
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
    
    // Find or create user with temporary role
    let user = await User.findOne({ phoneNumber: cleanPhone });
    
    if (!user) {
      // Create new user with temporary role
      user = await User.create({
        firstName: 'User',
        lastName: 'Name',
        phoneNumber: cleanPhone,
        authProvider: 'otpless',
        otplessUserId: otpResult.userId || cleanPhone,
        isVerified: true,
        role: 'client', // Temporary default role
        roleSelected: false // User hasn't selected actual role yet
      });
    } else {
      // Ensure existing user has a role
      if (!user.role) {
        user.role = 'client'; // Set temporary role if missing
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

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
    
    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { googleId: googleUser.id },
        { email: googleUser.email }
      ]
    });

    if (!user) {
      // Create new user with temporary role
      user = await User.create({
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
        profilePicture: googleUser.picture,
        authProvider: 'google',
        googleId: googleUser.id,
        isVerified: googleUser.email_verified || true,
        role: 'client', // Temporary default role
        roleSelected: false // User hasn't selected actual role yet
      });
    } else {
      // Ensure existing user has a role
      if (!user.role) {
        user.role = 'client'; // Set temporary role if missing
      }
      
      // Update user info if needed
      if (!user.googleId) {
        user.googleId = googleUser.id;
      }
      if (!user.profilePicture && googleUser.picture) {
        user.profilePicture = googleUser.picture;
      }
      if (!user.email && googleUser.email) {
        user.email = googleUser.email;
      }
      user.lastLogin = new Date();
      await user.save();
    }

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
