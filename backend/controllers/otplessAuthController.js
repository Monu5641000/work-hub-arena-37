
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Send OTP using OTPless
exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number format
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!/^\+91[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Indian phone number'
      });
    }

    // Send OTP using OTPless API
    const otplessResponse = await axios.post('https://auth.otpless.app/auth/otp/v1/send', {
      phoneNumber: cleanPhone,
      otpLength: 6,
      channel: 'SMS',
      expiry: 600 // 10 minutes
    }, {
      headers: {
        'clientId': process.env.OTPLESS_CLIENT_ID,
        'clientSecret': process.env.OTPLESS_CLIENT_SECRET,
        'Content-Type': 'application/json'
      }
    });

    console.log('OTPless API Response:', otplessResponse.data);

    if (otplessResponse.data.success) {
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          orderId: otplessResponse.data.orderId
        }
      });
    } else {
      throw new Error(otplessResponse.data.errorMessage || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('OTP sending error:', error);
    
    // If it's an axios error, log the full response
    if (error.response) {
      console.error('OTPless API Error Response:', error.response.data);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
};

// Verify OTP and login/register user
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp, orderId } = req.body;

    const cleanPhone = phoneNumber.replace(/\s/g, '');

    // Verify OTP using OTPless API
    const verifyResponse = await axios.post('https://auth.otpless.app/auth/otp/v1/verify', {
      orderId,
      otp,
      phoneNumber: cleanPhone
    }, {
      headers: {
        'clientId': process.env.OTPLESS_CLIENT_ID,
        'clientSecret': process.env.OTPLESS_CLIENT_SECRET,
        'Content-Type': 'application/json'
      }
    });

    if (!verifyResponse.data.isOTPVerified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber: cleanPhone });
    
    if (!user) {
      // Create new user
      user = await User.create({
        firstName: 'User',
        lastName: 'Name',
        phoneNumber: cleanPhone,
        authProvider: 'otpless',
        otplessUserId: verifyResponse.data.userId || cleanPhone,
        isVerified: true
      });
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        ...user.toJSON(),
        needsRoleSelection: !user.roleSelected
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
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

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (!payload || !payload.sub) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    // Extract user info from Google payload
    const googleUser = {
      id: payload.sub,
      email: payload.email,
      given_name: payload.given_name || 'User',
      family_name: payload.family_name || 'Name',
      picture: payload.picture,
      email_verified: payload.email_verified
    };

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { googleId: googleUser.id },
        { email: googleUser.email }
      ]
    });

    if (!user) {
      // Create new user
      user = await User.create({
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
        profilePicture: googleUser.picture,
        authProvider: 'google',
        googleId: googleUser.id,
        isVerified: googleUser.email_verified || true
      });
    } else {
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

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        ...user.toJSON(),
        needsRoleSelection: !user.roleSelected
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Google login failed',
      error: error.message
    });
  }
};

// Select user role
exports.selectRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id;

    if (!['client', 'freelancer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be client or freelancer'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        role,
        roleSelected: true
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      user: {
        ...user.toJSON(),
        needsRoleSelection: false
      }
    });
  } catch (error) {
    console.error('Role selection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to select role',
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
      user: {
        ...user.toJSON(),
        needsRoleSelection: !user.roleSelected
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};
