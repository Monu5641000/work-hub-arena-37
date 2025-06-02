
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
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
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  selectedPlan: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  addOns: [{
    title: String,
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    required: true
  },
  freelancerEarnings: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'delivered', 'revision_requested', 'completed', 'cancelled'],
    default: 'pending'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  actualDeliveryDate: Date,
  deliverables: [{
    fileName: String,
    fileUrl: String,
    message: String,
    submittedAt: { type: Date, default: Date.now }
  }],
  revisions: [{
    reason: String,
    requestedAt: { type: Date, default: Date.now },
    resolvedAt: Date
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  rating: {
    clientRating: {
      score: { type: Number, min: 1, max: 5 },
      comment: String,
      ratedAt: Date
    },
    freelancerRating: {
      score: { type: Number, min: 1, max: 5 },
      comment: String,
      ratedAt: Date
    }
  },
  dispute: {
    isDisputed: { type: Boolean, default: false },
    reason: String,
    status: {
      type: String,
      enum: ['open', 'resolved', 'closed']
    },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    initiatedAt: Date,
    resolvedAt: Date
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${count.toString().padStart(4, '0')}`;
  }
  next();
});

// Indexes
orderSchema.index({ client: 1 });
orderSchema.index({ freelancer: 1 });
orderSchema.index({ service: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
