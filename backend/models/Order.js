
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageType: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true
  },
  packageDetails: {
    title: String,
    description: String,
    price: Number,
    deliveryDays: Number,
    revisions: Number,
    features: [String]
  },
  customRequirements: [{
    question: String,
    answer: String,
    files: [{
      filename: String,
      url: String,
      size: Number
    }]
  }],
  addOns: [{
    name: String,
    price: Number,
    deliveryDays: Number
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  platformFee: {
    type: Number,
    required: true,
    default: function() {
      return Math.round(this.totalAmount * 0.1); // 10% platform fee
    }
  },
  freelancerEarnings: {
    type: Number,
    required: true,
    default: function() {
      return this.totalAmount - this.platformFee;
    }
  },
  status: {
    type: String,
    enum: [
      'pending_payment',
      'payment_confirmed',
      'in_progress',
      'delivered',
      'revision_requested',
      'completed',
      'cancelled',
      'disputed',
      'refunded'
    ],
    default: 'pending_payment'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentMethod: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  deliveryDate: Date,
  actualDeliveryDate: Date,
  isUrgent: {
    type: Boolean,
    default: false
  },
  urgentFee: {
    type: Number,
    default: 0
  },
  deliverables: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
    size: Number,
    type: String
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: String,
    files: [{
      filename: String,
      url: String,
      size: Number
    }],
    timestamp: { type: Date, default: Date.now },
    isSystemMessage: { type: Boolean, default: false }
  }],
  revisions: [{
    requestedAt: { type: Date, default: Date.now },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    deliveredAt: Date,
    files: [{
      filename: String,
      url: String,
      size: Number
    }]
  }],
  remainingRevisions: {
    type: Number,
    default: function() {
      return this.packageDetails?.revisions || 1;
    }
  },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    reviewedAt: Date,
    isPublic: { type: Boolean, default: true }
  },
  freelancerReview: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    reviewedAt: Date
  },
  dispute: {
    isDisputed: { type: Boolean, default: false },
    reason: String,
    description: String,
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    initiatedAt: Date,
    status: {
      type: String,
      enum: ['open', 'in_review', 'resolved', 'closed']
    },
    resolution: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  cancellation: {
    isCancelled: { type: Boolean, default: false },
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundAmount: Number
  },
  adminNotes: String,
  internalNotes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
OrderSchema.index({ client: 1, createdAt: -1 });
OrderSchema.index({ freelancer: 1, createdAt: -1 });
OrderSchema.index({ service: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ deliveryDate: 1 });

// Pre-save middleware to generate order number
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;
    
    // Calculate delivery date
    if (this.packageDetails?.deliveryDays) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + this.packageDetails.deliveryDays);
      this.deliveryDate = deliveryDate;
    }
  }
  next();
});

// Virtual for order progress
OrderSchema.virtual('progress').get(function() {
  const statusProgress = {
    'pending_payment': 10,
    'payment_confirmed': 20,
    'in_progress': 50,
    'delivered': 80,
    'revision_requested': 60,
    'completed': 100,
    'cancelled': 0,
    'disputed': 40,
    'refunded': 0
  };
  return statusProgress[this.status] || 0;
});

// Virtual for days remaining
OrderSchema.virtual('daysRemaining').get(function() {
  if (!this.deliveryDate) return null;
  const today = new Date();
  const diffTime = this.deliveryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is overdue
OrderSchema.virtual('isOverdue').get(function() {
  if (!this.deliveryDate || this.status === 'completed' || this.status === 'cancelled') return false;
  return new Date() > this.deliveryDate;
});

module.exports = mongoose.model('Order', OrderSchema);
