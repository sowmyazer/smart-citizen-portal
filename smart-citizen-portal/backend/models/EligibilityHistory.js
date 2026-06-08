const mongoose = require('mongoose');

const eligibilityHistorySchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  inputData: {
    age: Number,
    gender: String,
    caste: String,
    occupation: String,
    annualIncome: Number,
  },
  matchedSchemes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
  }],
  totalMatched: {
    type: Number,
    default: 0,
  },
  checkedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('EligibilityHistory', eligibilityHistorySchema);
