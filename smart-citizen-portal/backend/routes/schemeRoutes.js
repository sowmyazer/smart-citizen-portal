const express = require('express');
const router = express.Router();
const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  getActiveSchemes,
} = require('../controllers/schemeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/active', getActiveSchemes);
router.get('/', getSchemes);
router.get('/:id', getSchemeById);
router.post('/', protect, adminOnly, createScheme);
router.put('/:id', protect, adminOnly, updateScheme);
router.delete('/:id', protect, adminOnly, deleteScheme);

module.exports = router;
