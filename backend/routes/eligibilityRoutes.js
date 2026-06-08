const express = require('express');
const router = express.Router();
const { checkEligibility, getEligibilityHistory, getEligibilityStats } = require('../controllers/eligibilityController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/check', protect, checkEligibility);
router.get('/history', protect, getEligibilityHistory);
router.get('/stats', protect, adminOnly, getEligibilityStats);

module.exports = router;
