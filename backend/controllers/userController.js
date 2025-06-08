
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Review = require('../models/Review');
const path = require('path');

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// Get all freelancers
exports.getAllFreelancers = async (req, res) => {
  try {
    const { 
      search, 
      skills, 
      minRate, 
      maxRate, 
      location, 
      sort = 'rating',
      page = 1, 
      limit = 12 
    } = req.query;

    const filter = { 
      role: 'freelancer', 
      isActive: true,
      username: { $exists: true, $ne: null }
    };
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { 'skills.name': { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (skills) {
      filter['skills.name'] = { $in: skills.split(',') };
    }
    
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }
    
    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    let sortQuery = {};
    switch (sort) {
      case 'rating':
        sortQuery = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'rate_low':
        sortQuery = { hourlyRate: 1 };
        break;
      case 'rate_high':
        sortQuery = { hourlyRate: -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      default:
        sortQuery = { 'rating.average': -1 };
    }

    const freelancers = await User.find(filter)
      .select('-password -email -phoneNumber -whatsappNumber')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: freelancers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching freelancers'
    });
  }
};

// Check username availability
exports.checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.params;
    
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    
    res.status(200).json({
      success: true,
      data: {
        available: !existingUser,
        username: username.toLowerCase()
      }
    });
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking username availability'
    });
  }
};

// Get freelancer public profile by username
exports.getFreelancerProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ 
      username: username.toLowerCase(), 
      role: 'freelancer',
      isActive: true 
    }).select('-password -email -phoneNumber -whatsappNumber');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer not found'
      });
    }

    // Get freelancer's services
    const services = await Service.find({ 
      freelancer: user._id, 
      status: 'active' 
    }).populate('category', 'name');

    // Get freelancer's reviews
    const reviews = await Review.find({ freelancer: user._id })
      .populate('client', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate rating
    const ratingStats = await Review.aggregate([
      { $match: { freelancer: user._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const rating = ratingStats.length > 0 ? {
      average: Math.round(ratingStats[0].averageRating * 10) / 10,
      count: ratingStats[0].totalReviews
    } : { average: 0, count: 0 };

    res.status(200).json({
      success: true,
      data: {
        user: { ...user.toObject(), rating },
        services,
        reviews
      }
    });
  } catch (error) {
    console.error('Get freelancer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching freelancer profile'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'username', 'email', 'whatsappNumber',
      'bio', 'location', 'skills', 'experience', 'education', 'portfolio', 
      'hourlyRate', 'title', 'languages', 'certifications', 'availability'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Convert username to lowercase
    if (updates.username) {
      updates.username = updates.username.toLowerCase();
      
      // Check if username is already taken
      const existingUser = await User.findOne({ 
        username: updates.username,
        _id: { $ne: req.user.id }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: profilePictureUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile picture updated successfully'
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture'
    });
  }
};

// Update freelancer specific profile
exports.updateFreelancerProfile = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Only freelancers can update freelancer profile'
      });
    }

    const freelancerFields = [
      'title', 'hourlyRate', 'skills', 'portfolio', 'certifications',
      'languages', 'availability', 'bio'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (freelancerFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
      message: 'Freelancer profile updated successfully'
    });
  } catch (error) {
    console.error('Update freelancer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating freelancer profile'
    });
  }
};
