const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  mobile: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
  },
  age: {
    type: Number,
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  caste: {
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST', 'EWS'],
  },
  occupation: {
    type: String,
    enum: ['Farmer', 'Student', 'Self-Employed', 'Government Employee', 'Private Employee', 'Unemployed', 'Business', 'Other'],
  },
  annualIncome: {
    type: Number,
    min: [0, 'Annual income cannot be negative'],
  },
  village: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['citizen', 'admin'],
    default: 'citizen',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
