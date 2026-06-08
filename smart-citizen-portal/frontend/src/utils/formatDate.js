/**
 * formatDate.js
 * Date formatting utilities used across the portal.
 */

/**
 * Format a date to Indian locale (DD Month YYYY)
 * e.g. "15 June 2024"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateLong = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format a date to short Indian locale (DD/MM/YYYY)
 * e.g. "15/06/2024"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateShort = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Format a date with time
 * e.g. "15 Jun 2024, 10:30 AM"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format a date as relative time
 * e.g. "2 days ago", "Just now", "5 minutes ago"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '—';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  return formatDateShort(date);
};

/**
 * Format a month label for charts
 * e.g. new Date("2024-06-01") → "Jun 2024"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatMonthLabel = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Check if a date is today
 * @param {string|Date} date
 * @returns {boolean}
 */
export const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Format currency in Indian style
 * e.g. 250000 → "₹2,50,000"
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number with Indian comma grouping
 * e.g. 1250000 → "12,50,000"
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('en-IN').format(num);
};
