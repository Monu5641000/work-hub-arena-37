
const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { serviceId, packageType, customRequirements, addOns } = req.body;
    
    const service = await Service.findById(serviceId).populate('freelancer');
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (service.freelancer._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot order your own service'
      });
    }

    const packageDetails = service.pricingPlans[packageType];
    if (!packageDetails) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package type'
      });
    }

    let totalAmount = packageDetails.price;
    
    // Add add-ons cost
    if (addOns && addOns.length > 0) {
      addOns.forEach(addOn => {
        totalAmount += addOn.price;
      });
    }

    const platformFee = Math.round(totalAmount * 0.1);
    const freelancerEarnings = totalAmount - platformFee;

    const order = await Order.create({
      service: serviceId,
      client: req.user.id,
      freelancer: service.freelancer._id,
      packageType,
      packageDetails,
      customRequirements,
      addOns,
      totalAmount,
      platformFee,
      freelancerEarnings
    });

    await order.populate(['service', 'client', 'freelancer']);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get user orders
exports.getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.user.role === 'client') {
      filter.client = req.user.id;
    } else if (req.user.role === 'freelancer') {
      filter.freelancer = req.user.id;
    }

    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('service', 'title images')
      .populate('client', 'firstName lastName profilePicture')
      .populate('freelancer', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('service')
      .populate('client', 'firstName lastName profilePicture')
      .populate('freelancer', 'firstName lastName profilePicture');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.client._id.toString() !== req.user.id && 
        order.freelancer._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Authorization check
    const isFreelancer = order.freelancer.toString() === req.user.id;
    const isClient = order.client.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isFreelancer && !isClient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Status transition rules
    const allowedTransitions = {
      'payment_confirmed': ['in_progress'],
      'in_progress': ['delivered'],
      'delivered': ['revision_requested', 'completed'],
      'revision_requested': ['in_progress']
    };

    if (allowedTransitions[order.status] && allowedTransitions[order.status].includes(status)) {
      order.status = status;
      
      if (status === 'delivered') {
        order.actualDeliveryDate = new Date();
      }
      
      await order.save();

      res.status(200).json({
        success: true,
        data: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid status transition'
      });
    }
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};

// Submit deliverables
exports.submitDeliverables = async (req, res) => {
  try {
    const { deliverables, message } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit deliverables for this order'
      });
    }

    order.deliverables = deliverables;
    order.status = 'delivered';
    order.actualDeliveryDate = new Date();

    if (message) {
      order.messages.push({
        sender: req.user.id,
        message,
        isSystemMessage: false
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: 'Deliverables submitted successfully'
    });
  } catch (error) {
    console.error('Submit deliverables error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting deliverables'
    });
  }
};
