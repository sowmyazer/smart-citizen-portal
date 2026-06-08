import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
API.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('smartcitizen_user');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartcitizen_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  createAdmin: () => API.post('/auth/create-admin'),
};

// USERS
export const userAPI = {
  getAllCitizens: (params) => API.get('/users', { params }),
  getCitizenById: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => API.put('/users/profile', data),
  deleteCitizen: (id) => API.delete(`/users/${id}`),
  toggleStatus: (id) => API.patch(`/users/${id}/toggle-status`),
};

// SCHEMES
export const schemeAPI = {
  getSchemes: (params) => API.get('/schemes', { params }),
  getActiveSchemes: (params) => API.get('/schemes/active', { params }),
  getSchemeById: (id) => API.get(`/schemes/${id}`),
  createScheme: (data) => API.post('/schemes', data),
  updateScheme: (id, data) => API.put(`/schemes/${id}`, data),
  deleteScheme: (id) => API.delete(`/schemes/${id}`),
};

// NOTIFICATIONS
export const notificationAPI = {
  getNotifications: (params) => API.get('/notifications', { params }),
  getAdminNotifications: (params) => API.get('/notifications/admin', { params }),
  getNotificationById: (id) => API.get(`/notifications/${id}`),
  createNotification: (data) => API.post('/notifications', data),
  updateNotification: (id, data) => API.put(`/notifications/${id}`, data),
  deleteNotification: (id) => API.delete(`/notifications/${id}`),
};

// ELIGIBILITY
export const eligibilityAPI = {
  checkEligibility: (data) => API.post('/eligibility/check', data),
  getHistory: () => API.get('/eligibility/history'),
  getStats: () => API.get('/eligibility/stats'),
};

// ANALYTICS
export const analyticsAPI = {
  getDashboardStats: () => API.get('/analytics/dashboard'),
};

export default API;
