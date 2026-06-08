/**
 * eligibilityService.js
 * Eligibility-specific API calls with request preparation and response normalisation.
 */
import { eligibilityAPI } from './api';
import { validateEligibilityProfile } from '../utils/eligibilityMatcher';

/**
 * Send an eligibility check to the server.
 * Validates the payload client-side before making the request.
 *
 * @param {{ age, gender, caste, occupation, annualIncome }} profile
 * @returns {{ matchedSchemes: Array, totalMatched: number, inputData: Object }}
 * @throws {Error} if client-side validation fails
 */
export const checkEligibility = async (profile) => {
  const { valid, errors } = validateEligibilityProfile(profile);
  if (!valid) {
    const firstError = Object.values(errors)[0];
    throw new Error(firstError);
  }

  const payload = {
    age: Number(profile.age),
    gender: profile.gender || '',
    caste: profile.caste,
    occupation: profile.occupation,
    annualIncome: Number(profile.annualIncome),
  };

  const res = await eligibilityAPI.checkEligibility(payload);
  return res.data.data;
};

/**
 * Fetch the current citizen's eligibility check history.
 * @returns {Array} array of EligibilityHistory documents (latest first, max 10)
 */
export const fetchEligibilityHistory = async () => {
  const res = await eligibilityAPI.getHistory();
  return res.data.data;
};

/**
 * Fetch eligibility stats for admin dashboard.
 * @returns {{ total: number, recent: Array }}
 */
export const fetchEligibilityStats = async () => {
  const res = await eligibilityAPI.getStats();
  return res.data.data;
};

/**
 * Format eligibility history item for display in tables/cards.
 * @param {Object} historyItem
 * @returns {Object} formatted version
 */
export const formatHistoryItem = (historyItem) => {
  if (!historyItem) return null;
  return {
    id: historyItem._id,
    date: historyItem.checkedAt,
    age: historyItem.inputData?.age,
    caste: historyItem.inputData?.caste,
    occupation: historyItem.inputData?.occupation,
    annualIncome: historyItem.inputData?.annualIncome,
    gender: historyItem.inputData?.gender,
    matchedCount: historyItem.totalMatched,
    matchedSchemes: historyItem.matchedSchemes || [],
  };
};

/**
 * Returns a colour class based on the number of matched schemes.
 * @param {number} count
 * @returns {string} Tailwind class string
 */
export const getMatchCountColor = (count) => {
  if (count === 0) return 'bg-red-100 text-red-700';
  if (count <= 2) return 'bg-yellow-100 text-yellow-700';
  if (count <= 5) return 'bg-blue-100 text-blue-700';
  return 'bg-green-100 text-green-700';
};
