const express = require('express');
const router = express.Router();
const { registerCitizen, loginUser, getMe, createAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerCitizen);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/create-admin', createAdmin);

module.exports = router;
