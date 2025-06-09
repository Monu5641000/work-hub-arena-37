
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: function() {
      return !this.phoneNumber;
    },
    unique: true,
    sparse: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String,
    required: function() {
      return !this.email;
    },
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || /^\+91[6-9]\d{9}$/.test(v.replace(/\s/g, ''));
      },
      message: 'Please provide a valid Indian phone number'
    }
  },
  whatsappNumber: {
    type: String,
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || /^\+91[6-9]\d{9}$/.test(v.replace(/\s/g, ''));
      },
      message: 'Please provide a valid WhatsApp number'
    }
  },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'freelancer', 'admin'],
    default: null
  },
  roleSelected: {
    type: Boolean,
    default: false
  },
  authProvider: {
    type: String,
    enum: ['otpless', 'google', 'email'],
    required: true
  },
  otplessUserId: {
    type: String,
    unique: true,
    sparse: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  // Requirements based on user role
  requirements: {
    // Client requirements
    projectTypes: [String],
    budget: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' }
    },
    timeline: String,
    experience: String,
    
    // Freelancer requirements
    serviceCategories: [String],
    skillLevel: String,
    availability: String,
    preferredProjectSize: String,
    workingHours: {
      timezone: String,
      availability: [String]
    }
  },
  requirementsCompleted: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: null
  },
  location: {
    country: String,
    city: String,
    address: String
  },
  // Freelancer specific fields
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert']
    }
  }],
  hourlyRate: {
    type: Number,
    min: [1, 'Hourly rate must be at least ₹1']
  },
  portfolio: [{
    title: String,
    description: String,
    imageUrl: String,
    projectUrl: String
  }],
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  experience: {
    type: String,
    maxlength: [2000, 'Experience cannot exceed 2000 characters']
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startYear: Number,
    endYear: Number
  }],
  // Rating and reviews
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ username: 1 });
userSchema.index({ otplessUserId: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'skills.name': 1 });
userSchema.index({ 'rating.average': -1 });

// Hash password before saving (only for email auth)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate full name virtual
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
