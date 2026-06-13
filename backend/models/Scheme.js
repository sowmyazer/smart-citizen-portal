const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  schemeName: {
    type: String,
    required: [true, 'Scheme name is required'],
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Education', 'Agriculture', 'Housing', 'Health', 'Women Welfare', 'Senior Citizen', 'Employment', 'Disability Welfare'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  eligibilityCriteria: {
    type: String,
    required: [true, 'Eligibility criteria is required'],
    trim: true,
  },
  minAge: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxAge: {
    type: Number,
    default: 120,
    min: 0,
  },
  maxIncome: {
    type: Number,
    default: 10000000,
    min: 0,
  },
  eligibleCastes: {
    type: [String],
    enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'All'],
    default: ['All'],
  },
  eligibleOccupations: {
    type: [String],
    enum: ['Farmer', 'Student', 'Self-Employed', 'Government Employee', 'Private Employee', 'Unemployed', 'Business', 'Other', 'All'],
    default: ['All'],
  },
  benefits: {
    type: String,
    required: [true, 'Benefits are required'],
    trim: true,
  },
  genderEligibility: {
    type: String,
    // FIX 1: 'ASll' was a typo — corrected to 'All'
    // FIX 2: default was 'all' (lowercase) — must exactly match an enum value
    enum: ['Male', 'Female', 'Other', 'All'],
    default: 'All',
  },
  requiredDocuments: {
    type: [String],
    default: [],
  },
  applyLink: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

schemeSchema.index({ schemeName: 'text', description: 'text' });

module.exports = mongoose.model('Scheme', schemeSchema);