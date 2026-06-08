/**
 * eligibilityMatcher.js
 *
 * Client-side eligibility matching logic.
 * Mirrors the server-side matching in eligibilityController.js so that:
 *   1. The UI can show a live preview count without a round-trip.
 *   2. Unit tests can run purely in-browser.
 *
 * The authoritative match is always performed on the server.
 * Use these utilities for UX hints only.
 */

/**
 * Check whether a single scheme matches the given citizen profile.
 *
 * @param {Object} scheme   - Mongoose Scheme document (plain object)
 * @param {Object} profile  - { age, gender, caste, occupation, annualIncome }
 * @returns {boolean}
 */
export const schemeMatchesProfile = (scheme, profile) => {
  const { age, caste, occupation, annualIncome } = profile;

  // Age check
  const ageNum = Number(age);
  if (ageNum < scheme.minAge || ageNum > scheme.maxAge) return false;

  // Income check
  const incomeNum = Number(annualIncome);
  if (incomeNum > scheme.maxIncome) return false;

  // Caste check – 'All' in eligibleCastes means open to everyone
  const casteMatch =
    scheme.eligibleCastes?.includes('All') ||
    scheme.eligibleCastes?.includes(caste);
  if (!casteMatch) return false;

  // Occupation check
  const occupationMatch =
    scheme.eligibleOccupations?.includes('All') ||
    scheme.eligibleOccupations?.includes(occupation);
  if (!occupationMatch) return false;

  return true;
};

/**
 * Filter a list of schemes to only those matching the given profile.
 *
 * @param {Array}  schemes  - Array of scheme objects
 * @param {Object} profile  - { age, gender, caste, occupation, annualIncome }
 * @returns {Array} matched schemes
 */
export const filterEligibleSchemes = (schemes, profile) => {
  if (!schemes?.length || !profile) return [];
  return schemes.filter((scheme) => schemeMatchesProfile(scheme, profile));
};

/**
 * Return a count of matching schemes (lightweight, no filter copy).
 *
 * @param {Array}  schemes
 * @param {Object} profile
 * @returns {number}
 */
export const countEligibleSchemes = (schemes, profile) =>
  filterEligibleSchemes(schemes, profile).length;

/**
 * Validate a profile object before sending to the server.
 * Returns an object { valid: boolean, errors: { field: string } }
 *
 * @param {Object} profile - { age, caste, occupation, annualIncome }
 * @returns {{ valid: boolean, errors: Record<string,string> }}
 */
export const validateEligibilityProfile = (profile) => {
  const errors = {};
  const { age, caste, occupation, annualIncome } = profile;

  if (!age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
    errors.age = 'Age must be between 1 and 120';
  }
  if (!caste) {
    errors.caste = 'Caste category is required';
  }
  if (!occupation) {
    errors.occupation = 'Occupation is required';
  }
  if (annualIncome === '' || annualIncome === undefined || annualIncome === null) {
    errors.annualIncome = 'Annual income is required';
  } else if (isNaN(Number(annualIncome)) || Number(annualIncome) < 0) {
    errors.annualIncome = 'Annual income must be a non-negative number';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Group matched schemes by category.
 *
 * @param {Array} schemes
 * @returns {Record<string, Array>}  e.g. { Education: [...], Health: [...] }
 */
export const groupSchemesByCategory = (schemes) => {
  if (!schemes?.length) return {};
  return schemes.reduce((acc, scheme) => {
    const cat = scheme.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(scheme);
    return acc;
  }, {});
};

/**
 * Sort matched schemes so categories with more schemes appear first.
 *
 * @param {Array} schemes
 * @returns {Array} sorted copy
 */
export const sortSchemesByCategory = (schemes) => {
  if (!schemes?.length) return [];
  const grouped = groupSchemesByCategory(schemes);
  const sorted = [];
  Object.entries(grouped)
    .sort(([, a], [, b]) => b.length - a.length)
    .forEach(([, categorySchemes]) => sorted.push(...categorySchemes));
  return sorted;
};

/**
 * Build a human-readable eligibility summary string.
 *
 * @param {Object} profile
 * @param {number} matchCount
 * @returns {string}
 */
export const buildEligibilitySummary = (profile, matchCount) => {
  const { age, caste, occupation, annualIncome } = profile;
  const income = annualIncome
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(annualIncome)
    : '—';

  return (
    `Eligibility check for Age: ${age} yrs, Caste: ${caste}, ` +
    `Occupation: ${occupation}, Income: ${income}/yr — ` +
    `${matchCount} scheme${matchCount !== 1 ? 's' : ''} matched.`
  );
};
