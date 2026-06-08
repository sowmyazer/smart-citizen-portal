/**
 * constants.js
 * Single source of truth for all app-wide constants.
 * Import from here instead of hard-coding values in components.
 */

// ─── API ────────────────────────────────────────────────────────────────────
export const API_BASE_URL = '/api';

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const USER_ROLES = {
  ADMIN: 'admin',
  CITIZEN: 'citizen',
};

export const LOCAL_STORAGE_KEY = 'smartcitizen_user';

// ─── SCHEME CATEGORIES ───────────────────────────────────────────────────────
export const SCHEME_CATEGORIES = [
  'Education',
  'Agriculture',
  'Housing',
  'Health',
  'Women Welfare',
  'Senior Citizen',
  'Employment',
  'Disability Welfare',
];

export const SCHEME_CATEGORIES_WITH_ALL = ['All', ...SCHEME_CATEGORIES];

export const CATEGORY_ICONS = {
  Education: '🎓',
  Agriculture: '🌾',
  Housing: '🏠',
  Health: '🏥',
  'Women Welfare': '👩',
  'Senior Citizen': '👴',
  Employment: '💼',
  'Disability Welfare': '♿',
};

export const CATEGORY_COLORS = {
  Education: 'blue',
  Agriculture: 'green',
  Housing: 'orange',
  Health: 'red',
  'Women Welfare': 'pink',
  'Senior Citizen': 'purple',
  Employment: 'indigo',
  'Disability Welfare': 'yellow',
};

// Tailwind badge classes per category
export const CATEGORY_BADGE_CLASSES = {
  Education: 'bg-blue-100 text-blue-700',
  Agriculture: 'bg-green-100 text-green-700',
  Housing: 'bg-orange-100 text-orange-700',
  Health: 'bg-red-100 text-red-700',
  'Women Welfare': 'bg-pink-100 text-pink-700',
  'Senior Citizen': 'bg-purple-100 text-purple-700',
  Employment: 'bg-indigo-100 text-indigo-700',
  'Disability Welfare': 'bg-yellow-100 text-yellow-700',
};

// ─── CASTE CATEGORIES ────────────────────────────────────────────────────────
export const CASTE_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
export const CASTE_CATEGORIES_WITH_ALL = ['All', ...CASTE_CATEGORIES];

// ─── OCCUPATIONS ─────────────────────────────────────────────────────────────
export const OCCUPATIONS = [
  'Farmer',
  'Student',
  'Self-Employed',
  'Government Employee',
  'Private Employee',
  'Unemployed',
  'Business',
  'Other',
];
export const OCCUPATIONS_WITH_ALL = ['All', ...OCCUPATIONS];

// ─── GENDERS ─────────────────────────────────────────────────────────────────
export const GENDERS = ['Male', 'Female', 'Other'];

// ─── SCHEME STATUS ───────────────────────────────────────────────────────────
export const SCHEME_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

// ─── NOTIFICATION CATEGORIES ─────────────────────────────────────────────────
export const NOTIFICATION_CATEGORIES = [
  'General',
  'Scheme Update',
  'Alert',
  'Event',
  'Deadline',
];
export const NOTIFICATION_CATEGORIES_WITH_ALL = ['All', ...NOTIFICATION_CATEGORIES];

export const NOTIFICATION_CATEGORY_COLORS = {
  General: 'bg-slate-100 text-slate-700',
  'Scheme Update': 'bg-blue-100 text-blue-700',
  Alert: 'bg-red-100 text-red-700',
  Event: 'bg-purple-100 text-purple-700',
  Deadline: 'bg-orange-100 text-orange-700',
};

export const NOTIFICATION_CATEGORY_ICONS = {
  General: '📢',
  'Scheme Update': '📋',
  Alert: '⚠️',
  Event: '🎯',
  Deadline: '⏰',
};

// ─── PAGINATION ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_SCHEMES = 9;

// ─── CHART COLORS ─────────────────────────────────────────────────────────────
export const CHART_COLORS = [
  '#2563EB',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
];

// ─── ELIGIBILITY DEFAULTS ─────────────────────────────────────────────────────
export const DEFAULT_MIN_AGE = 0;
export const DEFAULT_MAX_AGE = 120;
export const DEFAULT_MAX_INCOME = 10000000;

// ─── TOAST CONFIG ─────────────────────────────────────────────────────────────
export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'light',
};

// ─── ADMIN DEMO CREDENTIALS ───────────────────────────────────────────────────
export const ADMIN_DEMO = {
  email: 'admin@smartcitizen.gov.in',
  password: 'Admin@123',
};

// ─── APP META ─────────────────────────────────────────────────────────────────
export const APP_NAME = 'Smart Citizen Portal';
export const APP_TAGLINE = 'Government Scheme Eligibility Portal';
export const APP_VERSION = '1.0.0';
