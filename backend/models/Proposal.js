
const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required']
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Freelancer is required']
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  proposedBudget: {
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Proposed amount is required'],
      min: [1, 'Amount must be at least $1']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Estimated duration is required']
  },
  milestones: [{
    title: String,
    description: String,
    amount: Number,
    dueDate: Date
  }],
  attachments: [{
    name: String,
    url: String,
    size: Number,
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date,
  clientMessage: String
}, {
  timestamps: true
});

// Indexes
proposalSchema.index({ project: 1 });
proposalSchema.index({ freelancer: 1 });
proposalSchema.index({ status: 1 });
proposalSchema.index({ submittedAt: -1 });

// Ensure unique proposal per freelancer per project
proposalSchema.index({ project: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', proposalSchema);
