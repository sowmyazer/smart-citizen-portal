const Scheme = require('../models/Scheme');
const EligibilityHistory = require('../models/EligibilityHistory');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Check eligibility
// @route   POST /api/eligibility/check
// @access  Private (Citizen)
const checkEligibility = asyncHandler(async (req, res) => {
  const { age, gender, caste, occupation, annualIncome } = req.body;

  if (!age || !caste || !occupation || annualIncome === undefined) {
    res.status(400);
    throw new Error('Please provide age, caste, occupation, and annual income');
  }

  const activeSchemes = await Scheme.find({ status: 'Active' });

  const matchedSchemes = activeSchemes.filter((scheme) => {
    // Age check
    const ageMatch = age >= scheme.minAge && age <= scheme.maxAge;

    // Income check
    const incomeMatch = annualIncome <= scheme.maxIncome;

    // Caste check
    const casteMatch =
      scheme.eligibleCastes.includes('All') ||
      scheme.eligibleCastes.includes(caste);

    // Occupation check
    const occupationMatch =
      scheme.eligibleOccupations.includes('All') ||
      scheme.eligibleOccupations.includes(occupation);

    return ageMatch && incomeMatch && casteMatch && occupationMatch;
  });

  // Save to history
  await EligibilityHistory.create({
    citizenId: req.user._id,
    inputData: { age, gender, caste, occupation, annualIncome },
    matchedSchemes: matchedSchemes.map((s) => s._id),
    totalMatched: matchedSchemes.length,
  });

  res.json({
    success: true,
    data: {
      matchedSchemes,
      totalMatched: matchedSchemes.length,
      inputData: { age, gender, caste, occupation, annualIncome },
    },
  });
});

// @desc    Get eligibility history for citizen
// @route   GET /api/eligibility/history
// @access  Private (Citizen)
const getEligibilityHistory = asyncHandler(async (req, res) => {
  const history = await EligibilityHistory.find({ citizenId: req.user._id })
    .populate('matchedSchemes', 'schemeName category benefits')
    .sort({ checkedAt: -1 })
    .limit(10);

  res.json({ success: true, data: history });
});

// @desc    Get all eligibility checks count (Admin)
// @route   GET /api/eligibility/stats
// @access  Admin
const getEligibilityStats = asyncHandler(async (req, res) => {
  const total = await EligibilityHistory.countDocuments();
  const recent = await EligibilityHistory.find()
    .populate('citizenId', 'name email')
    .sort({ checkedAt: -1 })
    .limit(5);

  res.json({ success: true, data: { total, recent } });
});

module.exports = { checkEligibility, getEligibilityHistory, getEligibilityStats };
