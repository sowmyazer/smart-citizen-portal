/**
 * analyticsService.js
 * Analytics-specific API calls with data transformation helpers for Recharts.
 */
import { analyticsAPI } from './api';
import { CHART_COLORS } from '../utils/constants';

/**
 * Fetch all dashboard statistics (cards + charts).
 * @returns {Object} { cards, categoryWiseSchemes, monthlyRegistrations, monthlyEligibilitySearches }
 */
export const fetchDashboardStats = async () => {
  const res = await analyticsAPI.getDashboardStats();
  return res.data.data;
};

/**
 * Transform category-wise scheme data for a Recharts PieChart.
 * Adds a `fill` colour from CHART_COLORS.
 *
 * @param {Array} rawData  - [{ name: 'Education', value: 5 }, ...]
 * @returns {Array}        - same shape with added `fill` field
 */
export const transformCategoryPieData = (rawData = []) =>
  rawData.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

/**
 * Transform monthly data for Recharts BarChart / LineChart.
 * Renames `count` → `value` for consistency if needed,
 * and ensures the array is sorted chronologically.
 *
 * @param {Array} rawData - [{ month: 'Jun 2024', count: 12 }, ...]
 * @returns {Array}
 */
export const transformMonthlyData = (rawData = []) =>
  [...rawData].map((item) => ({
    month: item.month,
    count: item.count,
  }));

/**
 * Merge registration and eligibility arrays into a single
 * dataset for a multi-line chart, keyed by month.
 *
 * @param {Array} registrations    - [{ month, count }, ...]
 * @param {Array} eligibilityChecks - [{ month, count }, ...]
 * @returns {Array} [{ month, registrations, eligibilityChecks }, ...]
 */
export const mergeMonthlyDatasets = (registrations = [], eligibilityChecks = []) => {
  const monthMap = {};

  registrations.forEach(({ month, count }) => {
    if (!monthMap[month]) monthMap[month] = { month, registrations: 0, eligibilityChecks: 0 };
    monthMap[month].registrations = count;
  });

  eligibilityChecks.forEach(({ month, count }) => {
    if (!monthMap[month]) monthMap[month] = { month, registrations: 0, eligibilityChecks: 0 };
    monthMap[month].eligibilityChecks = count;
  });

  return Object.values(monthMap).sort((a, b) => {
    // Sort by parsing the month label "Jun 2024"
    return new Date(a.month) - new Date(b.month);
  });
};

/**
 * Calculate the percentage change between two numbers.
 * Used to show growth indicators on stat cards.
 *
 * @param {number} current
 * @param {number} previous
 * @returns {{ value: string, positive: boolean }}
 */
export const calcPercentageChange = (current, previous) => {
  if (!previous || previous === 0) return { value: '—', positive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
    positive: change >= 0,
  };
};

/**
 * Returns a short label for a card stat (adds K/L/Cr suffix for large numbers).
 *
 * @param {number} num
 * @returns {string}
 */
export const formatStatNumber = (num) => {
  if (num === null || num === undefined) return '—';
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
};
