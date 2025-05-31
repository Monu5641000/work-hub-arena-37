
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
const { validateService, handleValidationErrors } = require('../middleware/validation');
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

// Public routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Protected routes
router.use(protect);

// Freelancer routes
router.get('/my/services', restrictTo('freelancer'), getMyServices);
router.post('/', restrictTo('freelancer'), validateService, handleValidationErrors, createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.post('/:id/images', restrictTo('freelancer'), upload.array('images', 5), uploadServiceImages);
router.get('/:id/analytics', getServiceAnalytics);

module.exports = router;
