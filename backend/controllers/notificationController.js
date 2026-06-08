const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Public
const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  const query = { isActive: true };
  if (category && category !== 'All') query.category = category;

  const total = await Notification.countDocuments(query);
  const notifications = await Notification.find(query)
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: notifications,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

// @desc    Get all notifications for admin (including inactive)
// @route   GET /api/notifications/admin
// @access  Admin
const getAdminNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Notification.countDocuments(query);
  const notifications = await Notification.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: notifications,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Public
const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id).populate('createdBy', 'name');

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.json({ success: true, data: notification });
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Admin
const createNotification = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  const notification = await Notification.create({
    title,
    description,
    category: category || 'General',
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification,
  });
});

// @desc    Update notification
// @route   PUT /api/notifications/:id
// @access  Admin
const updateNotification = asyncHandler(async (req, res) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: 'Notification updated successfully',
    data: notification,
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Admin
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  await Notification.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Notification deleted successfully' });
});

module.exports = {
  getNotifications, getAdminNotifications, getNotificationById,
  createNotification, updateNotification, deleteNotification,
};
