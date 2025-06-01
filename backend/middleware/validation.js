
const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Registration validation
exports.validateRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['client', 'freelancer'])
    .withMessage('Role must be either client or freelancer')
];

// Login validation
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required')
];

// Service validation
exports.validateService = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Service title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Service description must be between 50 and 2000 characters'),
  body('category')
    .isIn(['Design', 'Development', 'Marketing', 'Writing', 'Video Editing', 'Data Entry', 'Translation', 'Other'])
    .withMessage('Please select a valid category'),
  body('pricingPlans.basic.title')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Basic plan title is required'),
  body('pricingPlans.basic.price')
    .isFloat({ min: 5 })
    .withMessage('Basic plan price must be at least $5'),
  body('pricingPlans.basic.deliveryDays')
    .isInt({ min: 1, max: 30 })
    .withMessage('Delivery days must be between 1 and 30')
];

// Project validation
exports.validateProject = [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Project title must be between 10 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 100, max: 5000 })
    .withMessage('Project description must be between 100 and 5000 characters'),
  body('category')
    .isIn(['web-development', 'mobile-development', 'design', 'writing', 'marketing', 'data-science', 'consulting', 'other'])
    .withMessage('Please select a valid category'),
  body('budget.type')
    .isIn(['fixed', 'hourly'])
    .withMessage('Budget type must be either fixed or hourly'),
  body('budget.amount.min')
    .isFloat({ min: 10 })
    .withMessage('Minimum budget must be at least $10'),
  body('experienceLevel')
    .isIn(['entry', 'intermediate', 'expert'])
    .withMessage('Please select a valid experience level'),
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required')
];

// Order validation
exports.validateOrder = [
  body('serviceId')
    .isMongoId()
    .withMessage('Valid service ID is required'),
  body('packageType')
    .isIn(['basic', 'standard', 'premium'])
    .withMessage('Package type must be basic, standard, or premium')
];

// Message validation
exports.validateMessage = [
  body('recipientId')
    .isMongoId()
    .withMessage('Valid recipient ID is required'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message content must be between 1 and 2000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'file', 'image', 'order', 'system'])
    .withMessage('Invalid message type')
];
