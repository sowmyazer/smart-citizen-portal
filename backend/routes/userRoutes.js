const express = require('express');
const router = express.Router();
const {
  getAllCitizens,
  getCitizenById,
  updateProfile,
  deleteCitizen,
  toggleCitizenStatus,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllCitizens);
router.get('/:id', protect, adminOnly, getCitizenById);
router.put('/profile', protect, updateProfile);
router.delete('/:id', protect, adminOnly, deleteCitizen);
router.patch('/:id/toggle-status', protect, adminOnly, toggleCitizenStatus);

module.exports = router;
