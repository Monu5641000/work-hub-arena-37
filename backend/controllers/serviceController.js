const Service = require('../models/Service');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Get all services
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
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { status: 'active', isActive: true };
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (rating) filter.averageRating = { $gte: parseFloat(rating) };
    
    if (minPrice || maxPrice) {
      filter['pricingPlans.basic.price'] = {};
      if (minPrice) filter['pricingPlans.basic.price'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['pricingPlans.basic.price'].$lte = parseFloat(maxPrice);
    }
    
    if (deliveryTime) {
      filter['pricingPlans.basic.deliveryTime'] = { $lte: parseInt(deliveryTime) };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const services = await Service.find(filter)
      .populate('freelancer', 'firstName lastName profilePicture rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(filter);

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
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services'
    });
  }
};

// Get single service
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('freelancer', 'firstName lastName profilePicture rating bio experience skills');

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
    res.status(500).json({
      success: false,
      message: 'Error fetching service'
    });
  }
};

// Create service - Updated to handle image uploads during creation
exports.createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      freelancer: req.user.id,
      status: 'active', // Set as active by default
      isActive: true    // Set as active by default
    };

    // Parse pricing plans if they come as strings
    if (typeof serviceData.pricingPlans === 'string') {
      try {
        serviceData.pricingPlans = JSON.parse(serviceData.pricingPlans);
      } catch (e) {
        console.error('Error parsing pricing plans:', e);
      }
    }

    // Parse tags if they come as strings
    if (typeof serviceData.tags === 'string') {
      try {
        serviceData.tags = JSON.parse(serviceData.tags);
      } catch (e) {
        // If it's a comma-separated string, split it
        serviceData.tags = serviceData.tags.split(',').map(tag => tag.trim());
      }
    }

    // Create the service first
    const service = await Service.create(serviceData);

    // Handle image uploads if files are present
    if (req.files && req.files.length > 0) {
      const images = [];
      
      // Configure cloudinary if not already configured
      if (!cloudinary.config().cloud_name) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
          api_key: process.env.CLOUDINARY_API_KEY || 'demo',
          api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
        });
      }

      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'servpe/services',
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto' }
            ]
          });

          images.push({
            url: result.secure_url,
            alt: `${service.title} image`,
            isPrimary: images.length === 0
          });

          // Delete temp file
          fs.unlinkSync(file.path);
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          // If cloudinary fails, store locally
          const localUrl = `/uploads/services/${file.filename}`;
          images.push({
            url: localUrl,
            alt: `${service.title} image`,
            isPrimary: images.length === 0
          });
        }
      }

      // Update service with images
      service.images = images;
      await service.save();
    }

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// Update service
exports.updateService = async (req, res) => {
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
        message: 'Access denied'
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
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
        message: 'Access denied'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service'
    });
  }
};

// Get freelancer's services
exports.getMyServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { freelancer: req.user.id };
    if (status) filter.status = status;

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(filter);

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
    res.status(500).json({
      success: false,
      message: 'Error fetching services'
    });
  }
};

// Upload service images - Fixed to handle file uploads properly
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
        message: 'Access denied'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const images = [];
    
    // Configure cloudinary if not already configured
    if (!cloudinary.config().cloud_name) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
        api_key: process.env.CLOUDINARY_API_KEY || 'demo',
        api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
      });
    }

    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'servpe/services',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        });

        images.push({
          url: result.secure_url,
          alt: `${service.title} image`,
          isPrimary: images.length === 0
        });

        // Delete temp file
        fs.unlinkSync(file.path);
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        // If cloudinary fails, store locally
        const localUrl = `/uploads/services/${file.filename}`;
        images.push({
          url: localUrl,
          alt: `${service.title} image`,
          isPrimary: images.length === 0
        });
      }
    }

    service.images = [...service.images, ...images];
    await service.save();

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images'
    });
  }
};

// Get service analytics
exports.getServiceAnalytics = async (req, res) => {
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
        message: 'Access denied'
      });
    }

    const analytics = {
      impressions: service.impressions,
      clicks: service.clicks,
      orders: service.orders,
      conversionRate: service.clicks > 0 ? (service.orders / service.clicks * 100).toFixed(2) : 0,
      averageRating: service.averageRating,
      totalReviews: service.totalReviews
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
};
