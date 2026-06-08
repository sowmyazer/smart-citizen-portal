const Scheme = require('../models/Scheme');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
const getSchemes = asyncHandler(async (req, res) => {
  const { search, category, status, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { schemeName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { benefits: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (status && status !== 'All') {
    query.status = status;
  }

  const total = await Scheme.countDocuments(query);
  const schemes = await Scheme.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: schemes,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

// @desc    Get single scheme
// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id).populate('createdBy', 'name email');

  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }

  res.json({ success: true, data: scheme });
});

// @desc    Create new scheme
// @route   POST /api/schemes
// @access  Admin
const createScheme = asyncHandler(async (req, res) => {
  const {
    schemeName, category, description, eligibilityCriteria,
    minAge, maxAge, maxIncome, eligibleCastes, eligibleOccupations,
    benefits, requiredDocuments, applyLink, status,
  } = req.body;

  const scheme = await Scheme.create({
    schemeName, category, description, eligibilityCriteria,
    minAge: minAge || 0,
    maxAge: maxAge || 120,
    maxIncome: maxIncome || 10000000,
    eligibleCastes: eligibleCastes || ['All'],
    eligibleOccupations: eligibleOccupations || ['All'],
    benefits,
    requiredDocuments: requiredDocuments || [],
    applyLink: applyLink || '',
    status: status || 'Active',
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Scheme created successfully',
    data: scheme,
  });
});

// @desc    Update scheme
// @route   PUT /api/schemes/:id
// @access  Admin
const updateScheme = asyncHandler(async (req, res) => {
  let scheme = await Scheme.findById(req.params.id);

  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }

  scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: 'Scheme updated successfully',
    data: scheme,
  });
});

// @desc    Delete scheme
// @route   DELETE /api/schemes/:id
// @access  Admin
const deleteScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);

  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }

  await Scheme.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Scheme deleted successfully' });
});

// @desc    Get all active schemes (public)
// @route   GET /api/schemes/active
// @access  Public
const getActiveSchemes = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = { status: 'Active' };
  if (category && category !== 'All') query.category = category;

  const schemes = await Scheme.find(query).sort({ createdAt: -1 });
  res.json({ success: true, data: schemes });
});

module.exports = { getSchemes, getSchemeById, createScheme, updateScheme, deleteScheme, getActiveSchemes };
