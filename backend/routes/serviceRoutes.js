
const express = require('express');
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  getMyServices,
  uploadServiceImages,
  getServiceAnalytics
} = require('../controllers/serviceController');
const { protect, restrictTo } = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Simple validation middleware for service creation
const validateService = (req, res, next) => {
  const { title, description, category } = req.body;
  
  if (!title || !description || !category) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, and category are required'
    });
  }
  
  next();
};

// Handle validation errors middleware
const handleValidationErrors = (req, res, next) => {
  next();
};

// Public routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Protected routes - apply protect middleware
router.use(protect);

// Freelancer routes
router.get('/my/services', restrictTo('freelancer'), getMyServices);
router.post('/', restrictTo('freelancer'), validateService, handleValidationErrors, createService);
router.put('/:id', restrictTo('freelancer'), updateService);
router.delete('/:id', restrictTo('freelancer'), deleteService);
router.post('/:id/images', restrictTo('freelancer'), upload.array('images', 5), uploadServiceImages);
router.get('/:id/analytics', restrictTo('freelancer'), getServiceAnalytics);

module.exports = router;
