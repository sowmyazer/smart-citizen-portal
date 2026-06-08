/**
 * schemeService.js
 * Scheme-specific API calls with response normalisation.
 */
import { schemeAPI } from './api';

/**
 * Fetch paginated schemes with optional filters.
 * @param {{ page, limit, search, category, status }} params
 * @returns {{ schemes: Array, pagination: Object }}
 */
export const fetchSchemes = async (params = {}) => {
  const res = await schemeAPI.getSchemes(params);
  return {
    schemes: res.data.data,
    pagination: res.data.pagination,
  };
};

/**
 * Fetch all Active schemes (no pagination – for dropdowns / eligibility).
 * @param {string} [category] optional category filter
 * @returns {Array}
 */
export const fetchActiveSchemes = async (category) => {
  const params = {};
  if (category && category !== 'All') params.category = category;
  const res = await schemeAPI.getActiveSchemes(params);
  return res.data.data;
};

/**
 * Fetch a single scheme by ID.
 * @param {string} id
 * @returns {Object}
 */
export const fetchSchemeById = async (id) => {
  const res = await schemeAPI.getSchemeById(id);
  return res.data.data;
};

/**
 * Create a new scheme.
 * @param {Object} schemeData
 * @returns {Object} created scheme
 */
export const createScheme = async (schemeData) => {
  const res = await schemeAPI.createScheme(schemeData);
  return res.data.data;
};

/**
 * Update an existing scheme.
 * @param {string} id
 * @param {Object} schemeData
 * @returns {Object} updated scheme
 */
export const updateScheme = async (id, schemeData) => {
  const res = await schemeAPI.updateScheme(id, schemeData);
  return res.data.data;
};

/**
 * Delete a scheme by ID.
 * @param {string} id
 * @returns {string} success message
 */
export const deleteScheme = async (id) => {
  const res = await schemeAPI.deleteScheme(id);
  return res.data.message;
};

/**
 * Build a formatted payload from a scheme form (handles type coercions,
 * document array cleaning, etc.).
 *
 * @param {Object} formData         - raw react-hook-form values
 * @param {Array}  eligibleCastes
 * @param {Array}  eligibleOccupations
 * @param {Array}  requiredDocuments - raw array including empty strings
 * @returns {Object} clean payload ready to POST/PUT
 */
export const buildSchemePayload = (
  formData,
  eligibleCastes,
  eligibleOccupations,
  requiredDocuments
) => ({
  ...formData,
  minAge: Number(formData.minAge) || 0,
  maxAge: Number(formData.maxAge) || 120,
  maxIncome: Number(formData.maxIncome) || 10000000,
  eligibleCastes: eligibleCastes.length > 0 ? eligibleCastes : ['All'],
  eligibleOccupations: eligibleOccupations.length > 0 ? eligibleOccupations : ['All'],
  requiredDocuments: requiredDocuments.filter(Boolean),
  applyLink: formData.applyLink?.trim() || '',
});
