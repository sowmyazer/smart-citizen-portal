/**
 * notificationService.js
 * Notification-specific API calls with response normalisation.
 */
import { notificationAPI } from './api';

/**
 * Fetch public (active) notifications with pagination.
 * @param {{ page, limit, category }} params
 * @returns {{ notifications: Array, pagination: Object }}
 */
export const fetchNotifications = async (params = {}) => {
  const res = await notificationAPI.getNotifications(params);
  return {
    notifications: res.data.data,
    pagination: res.data.pagination,
  };
};

/**
 * Fetch all notifications (including inactive) for the admin view.
 * @param {{ page, limit, search }} params
 * @returns {{ notifications: Array, pagination: Object }}
 */
export const fetchAdminNotifications = async (params = {}) => {
  const res = await notificationAPI.getAdminNotifications(params);
  return {
    notifications: res.data.data,
    pagination: res.data.pagination,
  };
};

/**
 * Fetch a single notification by ID.
 * @param {string} id
 * @returns {Object}
 */
export const fetchNotificationById = async (id) => {
  const res = await notificationAPI.getNotificationById(id);
  return res.data.data;
};

/**
 * Create a new notification.
 * @param {{ title, description, category }} data
 * @returns {Object} created notification
 */
export const createNotification = async (data) => {
  const res = await notificationAPI.createNotification(data);
  return res.data.data;
};

/**
 * Update an existing notification.
 * @param {string} id
 * @param {Object} data
 * @returns {Object} updated notification
 */
export const updateNotification = async (id, data) => {
  const res = await notificationAPI.updateNotification(id, data);
  return res.data.data;
};

/**
 * Delete a notification by ID.
 * @param {string} id
 * @returns {string} success message
 */
export const deleteNotification = async (id) => {
  const res = await notificationAPI.deleteNotification(id);
  return res.data.message;
};

/**
 * Returns the Tailwind badge class for a given notification category.
 * @param {string} category
 * @returns {string}
 */
export const getNotificationCategoryClass = (category) => {
  const map = {
    General: 'bg-slate-100 text-slate-700',
    'Scheme Update': 'bg-blue-100 text-blue-700',
    Alert: 'bg-red-100 text-red-700',
    Event: 'bg-purple-100 text-purple-700',
    Deadline: 'bg-orange-100 text-orange-700',
  };
  return map[category] || map.General;
};

/**
 * Returns the emoji icon for a given notification category.
 * @param {string} category
 * @returns {string}
 */
export const getNotificationIcon = (category) => {
  const icons = {
    General: '📢',
    'Scheme Update': '📋',
    Alert: '⚠️',
    Event: '🎯',
    Deadline: '⏰',
  };
  return icons[category] || '📢';
};
