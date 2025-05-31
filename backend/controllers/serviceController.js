
const Service = require('../models/Service');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// @desc    Get all services with filtering and pagination
// @route   GET /api/services
// @access  Public
exports.getAllServices = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      rating,
      deliveryTime,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter = { status: 'active', isActive: true };

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (rating) filter.averageRating = { $gte: parseFloat(rating) };

    // Price filtering (looking at basic plan price)
    if (minPrice || maxPrice) {
      filter['pricingPlans.basic.price'] = {};
      if (minPrice) filter['pricingPlans.basic.price'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['pricingPlans.basic.price'].$lte = parseFloat(maxPrice);
    }

    // Delivery time filtering
    if (deliveryTime) {
      filter['pricingPlans.basic.deliveryDays'] = { $lte: parseInt(deliveryTime) };
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const services = await Service.find(filter)
      .populate('freelancer', 'name profilePicture location averageRating totalReviews isVerified')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        current: parseInt(page),
        pages: totalPages,
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('freelancer', 'name profilePicture location averageRating totalReviews isVerified memberSince bio skills')
      .populate({
        path: 'freelancer',
        populate: {
          path: 'services',
          select: 'title averageRating totalReviews pricingPlans.basic.price images',
          match: { status: 'active', isActive: true }
        }
      });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Increment impressions
    service.impressions += 1;
    await service.save();

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Freelancers only)
exports.createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      freelancer: req.user.id
    };

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully and submitted for review'
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Service owner only)
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user owns the service
    if (service.freelancer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    // Update fields
    service = await Service.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        lastModified: Date.now(),
        status: req.user.role === 'admin' ? req.body.status : 'pending' // Non-admins need approval for updates
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Service owner or admin)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user owns the service or is admin
    if (service.freelancer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    // Soft delete - update status instead of removing
    service.status = 'deleted';
    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get freelancer's services
// @route   GET /api/services/my/services
// @access  Private (Freelancers only)
exports.getMyServices = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { freelancer: req.user.id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get my services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload service images
// @route   POST /api/services/:id/images
// @access  Private (Service owner only)
exports.uploadServiceImages = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (service.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload images for this service'
      });
    }

    // Handle multiple file uploads with Cloudinary
    const uploadedImages = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `servpe/services/${service._id}`,
          transformation: [
            { width: 800, height: 600, crop: 'fill', quality: 'auto' }
          ]
        });

        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          alt: `${service.title} - Image ${uploadedImages.length + 1}`
        });
      }
    }

    service.images = [...service.images, ...uploadedImages];
    await service.save();

    res.status(200).json({
      success: true,
      data: service,
      message: 'Images uploaded successfully'
    });
  } catch (error) {
    console.error('Upload service images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get service analytics
// @route   GET /api/services/:id/analytics
// @access  Private (Service owner only)
exports.getServiceAnalytics = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (service.freelancer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics for this service'
      });
    }

    const analytics = {
      impressions: service.impressions,
      clicks: service.clicks,
      ctr: service.ctr,
      totalOrders: service.totalOrders,
      completedOrders: service.completedOrders,
      conversionRate: service.conversionRate,
      averageRating: service.averageRating,
      totalReviews: service.totalReviews,
      totalEarnings: service.completedOrders * service.pricingPlans.basic.price // Simplified calculation
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get service analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
