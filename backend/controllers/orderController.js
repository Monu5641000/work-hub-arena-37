
const Order = require('../models/Order');
const Service = require('../models/Service');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { 
      serviceId, 
      selectedPlan, 
      requirements, 
      addOns = [] 
    } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Calculate pricing
    const planPrice = service.pricingPlans[selectedPlan].price;
    const addOnsTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    const totalAmount = planPrice + addOnsTotal;
    const platformFee = totalAmount * 0.1; // 10% platform fee
    const freelancerEarnings = totalAmount - platformFee;

    // Calculate delivery date
    const deliveryDays = service.pricingPlans[selectedPlan].deliveryTime + 
      addOns.reduce((sum, addOn) => sum + (addOn.deliveryTime || 0), 0);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    const order = await Order.create({
      client: req.user.id,
      freelancer: service.freelancer,
      service: serviceId,
      selectedPlan,
      requirements,
      addOns,
      totalAmount,
      platformFee,
      freelancerEarnings,
      deliveryDate,
      status: 'in_progress'
    });

    // Update service orders count
    service.orders += 1;
    await service.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('client', 'firstName lastName email')
      .populate('freelancer', 'firstName lastName email')
      .populate('service', 'title');

    res.status(201).json({
      success: true,
      data: populatedOrder
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

// Get user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { client: req.user.id },
        { freelancer: req.user.id }
      ]
    };

    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('client', 'firstName lastName email')
      .populate('freelancer', 'firstName lastName email')
      .populate('service', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    // Add calculated fields
    const ordersWithCalculations = orders.map(order => {
      const orderObj = order.toObject();
      const now = new Date();
      const daysRemaining = Math.ceil((order.deliveryDate - now) / (1000 * 60 * 60 * 24));
      
      orderObj.daysRemaining = daysRemaining;
      orderObj.isOverdue = daysRemaining < 0;
      
      // Calculate progress based on status
      switch (order.status) {
        case 'in_progress':
          orderObj.progress = 25;
          break;
        case 'delivered':
          orderObj.progress = 90;
          break;
        case 'completed':
          orderObj.progress = 100;
          break;
        default:
          orderObj.progress = 0;
      }
      
      return orderObj;
    });

    res.status(200).json({
      success: true,
      data: ordersWithCalculations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
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
      .populate('client', 'firstName lastName email profilePicture')
      .populate('freelancer', 'firstName lastName email profilePicture')
      .populate('service', 'title description images pricingPlans');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check access
    if (
      order.client._id.toString() !== req.user.id &&
      order.freelancer._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
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

    // Check permissions
    if (
      order.client.toString() !== req.user.id &&
      order.freelancer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    order.status = status;
    if (status === 'completed') {
      order.actualDeliveryDate = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};

// Submit deliverables
exports.submitDeliverables = async (req, res) => {
  try {
    const { files, message } = req.body;
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
        message: 'Access denied'
      });
    }

    order.deliverables.push({
      fileName: files.map(f => f.name).join(', '),
      fileUrl: files[0]?.url || '',
      message,
      submittedAt: new Date()
    });

    order.status = 'delivered';
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting deliverables'
    });
  }
};
