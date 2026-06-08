const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all citizens (Admin)
// @route   GET /api/users
// @access  Admin
const getAllCitizens = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  const query = { role: 'citizen' };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
      { district: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const citizens = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: citizens,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit),
    },
  });
});

// @desc    Get single citizen by ID
// @route   GET /api/users/:id
// @access  Admin
const getCitizenById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user || user.role !== 'citizen') {
    res.status(404);
    throw new Error('Citizen not found');
  }

  res.json({ success: true, data: user });
});

// @desc    Update citizen profile
// @route   PUT /api/users/profile
// @access  Citizen (self)
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const allowedFields = ['name', 'mobile', 'age', 'gender', 'caste', 'occupation', 'annualIncome', 'village', 'district', 'state'];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      mobile: updatedUser.mobile,
      age: updatedUser.age,
      gender: updatedUser.gender,
      caste: updatedUser.caste,
      occupation: updatedUser.occupation,
      annualIncome: updatedUser.annualIncome,
      village: updatedUser.village,
      district: updatedUser.district,
      state: updatedUser.state,
    },
  });
});

// @desc    Delete citizen
// @route   DELETE /api/users/:id
// @access  Admin
const deleteCitizen = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.role !== 'citizen') {
    res.status(404);
    throw new Error('Citizen not found');
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Citizen deleted successfully' });
});

// @desc    Toggle citizen active status
// @route   PATCH /api/users/:id/toggle-status
// @access  Admin
const toggleCitizenStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.role !== 'citizen') {
    res.status(404);
    throw new Error('Citizen not found');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `Citizen ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { isActive: user.isActive },
  });
});

module.exports = { getAllCitizens, getCitizenById, updateProfile, deleteCitizen, toggleCitizenStatus };
