const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experienceController');
const auth = require('../middleware/auth');

// GET /api/experience
router.get('/', getExperiences);

// POST /api/experience
router.post(
  '/',
  auth,
  [
    body('role', 'Role is required').notEmpty().trim(),
    body('company', 'Company is required').notEmpty().trim(),
    body('startDate', 'Start date is required').notEmpty(),
  ],
  createExperience
);

// PUT /api/experience/:id
router.put(
  '/:id',
  auth,
  [
    body('role', 'Role cannot be empty').optional().notEmpty().trim(),
    body('company', 'Company cannot be empty').optional().notEmpty().trim(),
  ],
  updateExperience
);

// DELETE /api/experience/:id
router.delete('/:id', auth, deleteExperience);

module.exports = router;
