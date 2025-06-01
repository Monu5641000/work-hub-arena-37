
const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Project = require('../models/Project');

const router = express.Router();

// All admin routes require admin role
router.use(protect);
router.use(restrictTo('admin'));

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalServices = await Service.countDocuments({ status: 'active' });
    const totalOrders = await Order.countDocuments();
    const pendingServices = await Service.countDocuments({ status: 'pending' });
    
    // Calculate total revenue (platform fee from completed orders)
    const completedOrders = await Order.find({ status: 'completed' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.platformFee, 0);
    
    const activeDisputes = await Order.countDocuments({ 'dispute.isDisputed': true, 'dispute.status': 'open' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalFreelancers,
        totalClients,
        totalServices,
        totalOrders,
        totalRevenue,
        pendingServices,
        activeDisputes
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats'
    });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Get services pending approval
router.get('/services/pending', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const services = await Service.find({ status: 'pending' })
      .populate('freelancer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin get pending services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending services'
    });
  }
});

// Approve service
router.put('/services/:id/approve', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'active',
        isActive: true 
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service approved successfully'
    });
  } catch (error) {
    console.error('Admin approve service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving service'
    });
  }
});

// Reject service
router.put('/services/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        isActive: false,
        rejectionReason: reason 
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service rejected successfully'
    });
  } catch (error) {
    console.error('Admin reject service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting service'
    });
  }
});

// Get recent orders
router.get('/orders/recent', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate('client', 'firstName lastName email')
      .populate('freelancer', 'firstName lastName email')
      .populate('service', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments();

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin get recent orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent orders'
    });
  }
});

// Get disputes
router.get('/disputes', async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'open' } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ 
      'dispute.isDisputed': true,
      'dispute.status': status 
    })
      .populate('client', 'firstName lastName email')
      .populate('freelancer', 'firstName lastName email')
      .populate('service', 'title')
      .sort({ 'dispute.initiatedAt': -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments({ 
      'dispute.isDisputed': true,
      'dispute.status': status 
    });

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin get disputes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching disputes'
    });
  }
});

// Suspend user
router.put('/users/:id/suspend', async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: false,
        suspensionReason: reason,
        suspendedAt: new Date()
      },
      { new: true }
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
      message: 'User suspended successfully'
    });
  } catch (error) {
    console.error('Admin suspend user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error suspending user'
    });
  }
});

// Reactivate user
router.put('/users/:id/reactivate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: true,
        $unset: { suspensionReason: 1, suspendedAt: 1 }
      },
      { new: true }
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
      message: 'User reactivated successfully'
    });
  } catch (error) {
    console.error('Admin reactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reactivating user'
    });
  }
});

module.exports = router;
