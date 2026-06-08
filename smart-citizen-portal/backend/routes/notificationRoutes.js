const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getAdminNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getNotifications);
router.get('/admin', protect, adminOnly, getAdminNotifications);
router.get('/:id', getNotificationById);
router.post('/', protect, adminOnly, createNotification);
router.put('/:id', protect, adminOnly, updateNotification);
router.delete('/:id', protect, adminOnly, deleteNotification);

module.exports = router;
