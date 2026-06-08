const User = require('../models/User');
const generateToken = require('../config/generateToken');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Register a new citizen
// @route   POST /api/auth/register
// @access  Public
const registerCitizen = asyncHandler(async (req, res) => {
  const { name, email, password, mobile, age, gender, caste, occupation, annualIncome, village, district, state } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    name, email, password, mobile, age, gender, caste, occupation,
    annualIncome, village, district, state, role: 'citizen',
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user (citizen or admin)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error('Your account has been deactivated. Contact admin.');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      age: user.age,
      gender: user.gender,
      caste: user.caste,
      occupation: user.occupation,
      annualIncome: user.annualIncome,
      village: user.village,
      district: user.district,
      state: user.state,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

// @desc    Create initial admin (only if no admin exists)
// @route   POST /api/auth/create-admin
// @access  Public (one time setup)
const createAdmin = asyncHandler(async (req, res) => {
  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@smartcitizen.gov.in',
    password: 'Admin@123',
    role: 'admin',
    mobile: '9999999999',
  });

  res.status(201).json({
    success: true,
    message: 'Admin created successfully',
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    },
  });
});

module.exports = { registerCitizen, loginUser, getMe, createAdmin };
