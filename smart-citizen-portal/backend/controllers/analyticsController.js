const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Notification = require('../models/Notification');
const EligibilityHistory = require('../models/EligibilityHistory');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalCitizens, totalSchemes, totalNotifications, totalEligibilityChecks] = await Promise.all([
    User.countDocuments({ role: 'citizen' }),
    Scheme.countDocuments(),
    Notification.countDocuments(),
    EligibilityHistory.countDocuments(),
  ]);

  // Category-wise schemes
  const categoryWiseSchemes = await Scheme.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Monthly registrations (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRegistrations = await User.aggregate([
    { $match: { role: 'citizen', createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Monthly eligibility searches (last 6 months)
  const monthlyEligibilitySearches = await EligibilityHistory.aggregate([
    { $match: { checkedAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$checkedAt' },
          month: { $month: '$checkedAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatMonthly = (data) =>
    data.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count,
    }));

  res.json({
    success: true,
    data: {
      cards: {
        totalCitizens,
        totalSchemes,
        totalNotifications,
        totalEligibilityChecks,
      },
      categoryWiseSchemes: categoryWiseSchemes.map((c) => ({
        name: c._id,
        value: c.count,
      })),
      monthlyRegistrations: formatMonthly(monthlyRegistrations),
      monthlyEligibilitySearches: formatMonthly(monthlyEligibilitySearches),
    },
  });
});

module.exports = { getDashboardStats };
