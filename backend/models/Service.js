
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Design', 'Development', 'Marketing', 'Writing', 'Video Editing', 'Data Entry', 'Translation', 'Other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pricingPlans: {
    basic: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      deliveryDays: { type: Number, required: true, min: 1 },
      revisions: { type: Number, default: 1 },
      features: [String]
    },
    standard: {
      title: String,
      description: String,
      price: { type: Number, min: 0 },
      deliveryDays: { type: Number, min: 1 },
      revisions: { type: Number, default: 2 },
      features: [String]
    },
    premium: {
      title: String,
      description: String,
      price: { type: Number, min: 0 },
      deliveryDays: { type: Number, min: 1 },
      revisions: { type: Number, default: 3 },
      features: [String]
    }
  },
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  video: {
    url: String,
    publicId: String,
    thumbnail: String
  },
  requirements: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['text', 'file', 'multiple_choice'], default: 'text' },
    required: { type: Boolean, default: false },
    options: [String] // For multiple choice questions
  }],
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'paused', 'rejected', 'deleted'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  completedOrders: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  rejectionReason: String,
  adminNotes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
ServiceSchema.index({ freelancer: 1, status: 1 });
ServiceSchema.index({ category: 1, status: 1 });
ServiceSchema.index({ 'pricingPlans.basic.price': 1 });
ServiceSchema.index({ averageRating: -1 });
ServiceSchema.index({ totalOrders: -1 });
ServiceSchema.index({ createdAt: -1 });

// Virtual for click-through rate
ServiceSchema.virtual('ctr').get(function() {
  return this.impressions > 0 ? (this.clicks / this.impressions) * 100 : 0;
});

// Virtual for conversion rate
ServiceSchema.virtual('conversionRate').get(function() {
  return this.clicks > 0 ? (this.totalOrders / this.clicks) * 100 : 0;
});

// Method to update rating
ServiceSchema.methods.updateRating = async function(newRating) {
  const totalRatingPoints = this.averageRating * this.totalReviews + newRating;
  this.totalReviews += 1;
  this.averageRating = totalRatingPoints / this.totalReviews;
  return this.save();
};

module.exports = mongoose.model('Service', ServiceSchema);
