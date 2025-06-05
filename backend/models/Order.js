
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
    price: Number,
    deliveryTime: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
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
    enum: ['pending', 'accepted', 'in_progress', 'delivered', 'revision_requested', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  actualDeliveryDate: Date,
  deliverables: [{
    files: [{
      fileName: String,
      fileUrl: String,
      fileSize: Number,
      fileType: String
    }],
    message: String,
    submittedAt: { type: Date, default: Date.now }
  }],
  revisions: [{
    reason: String,
    requestedAt: { type: Date, default: Date.now },
    resolvedAt: Date
  }],
  statusHistory: [{
    status: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: { type: Date, default: Date.now },
    note: String
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
    resolvedAt: Date,
    resolution: String
  },
  chatEnabled: {
    type: Boolean,
    default: true
  },
  lastMessageAt: Date,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  tags: [String],
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: { type: Date, default: Date.now }
  }]
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

// Virtual for days remaining
orderSchema.virtual('daysRemaining').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') return 0;
  const now = new Date();
  const diff = this.deliveryDate - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Virtual for progress percentage
orderSchema.virtual('progress').get(function() {
  switch (this.status) {
    case 'pending': return 5;
    case 'accepted': return 15;
    case 'in_progress': return this.deliverables.length > 0 ? 75 : 25;
    case 'delivered': return 90;
    case 'revision_requested': return 60;
    case 'completed': return 100;
    case 'cancelled': return 0;
    default: return 0;
  }
});

// Virtual for overdue status
orderSchema.virtual('isOverdue').get(function() {
  if (['completed', 'cancelled'].includes(this.status)) return false;
  const now = new Date();
  return this.deliveryDate < now;
});

// Indexes for better performance
orderSchema.index({ client: 1 });
orderSchema.index({ freelancer: 1 });
orderSchema.index({ service: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ deliveryDate: 1 });
orderSchema.index({ 'dispute.isDisputed': 1 });

module.exports = mongoose.model('Order', orderSchema);
