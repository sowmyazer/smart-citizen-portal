/**
 * authService.js
 * Auth-specific API calls with additional client-side logic.
 * Components should prefer these over calling api.js directly.
 */
import { authAPI } from './api';
import { LOCAL_STORAGE_KEY } from '../utils/constants';

/**
 * Register a new citizen.
 * @param {Object} formData - registration form values
 * @returns {Object} user data including token
 */
export const registerCitizen = async (formData) => {
  const res = await authAPI.register(formData);
  return res.data.data;
};

/**
 * Log in a user (citizen or admin).
 * @param {{ email: string, password: string }} credentials
 * @returns {Object} user data including token
 */
export const loginUser = async (credentials) => {
  const res = await authAPI.login(credentials);
  return res.data.data;
};

/**
 * Fetch the currently authenticated user's profile.
 * @returns {Object} user data
 */
export const fetchCurrentUser = async () => {
  const res = await authAPI.getMe();
  return res.data.data;
};

/**
 * Persist user data to localStorage and set axios default header.
 * @param {Object} userData - must include `token`
 */
export const persistUser = (userData) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
};

/**
 * Clear persisted user data.
 */
export const clearPersistedUser = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

/**
 * Read persisted user from localStorage.
 * @returns {Object|null}
 */
export const getPersistedUser = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * One-time admin creation endpoint (only works if no admin exists).
 * @returns {Object} admin user data
 */
export const createInitialAdmin = async () => {
  const res = await authAPI.createAdmin();
  return res.data.data;
};

/**
 * Checks if a stored token looks like a valid non-expired JWT.
 * This is a client-side heuristic only — the server always validates.
 * @param {string} token
 * @returns {boolean}
 */
export const isTokenFreshEnough = (token) => {
  if (!token) return false;
  try {
    const [, payloadB64] = token.split('.');
    const payload = JSON.parse(atob(payloadB64));
    // exp is in seconds
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
