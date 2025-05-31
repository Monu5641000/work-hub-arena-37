
const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const User = require('../models/User');
const Service = require('../models/Service');

const router = express.Router();

// Public routes
router.get('/freelancers', async (req, res) => {
  try {
    const { skills, category, rating, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { role: 'freelancer', isActive: true };
    
    if (skills) {
      filter['skills.name'] = { $in: skills.split(',') };
    }
    
    if (rating) {
      filter['rating.average'] = { $gte: parseFloat(rating) };
    }

    const freelancers = await User.find(filter)
      .select('firstName lastName profilePicture skills rating bio hourlyRate location')
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: freelancers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching freelancers'
    });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If it's a freelancer, also get their services
    let services = [];
    if (user.role === 'freelancer') {
      services = await Service.find({ 
        freelancer: user._id, 
        status: 'active',
        isActive: true 
      }).select('title images pricingPlans.basic.price averageRating totalReviews');
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        services
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

// Protected routes
router.use(protect);

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'location', 'bio', 
      'skills', 'hourlyRate', 'experience', 'education', 'portfolio'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

module.exports = router;
