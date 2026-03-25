const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require('../controllers/educationController');
const auth = require('../middleware/auth');

// GET /api/education
router.get('/', getEducation);

// POST /api/education
router.post(
  '/',
  auth,
  [
    body('schoolName', 'School name is required').notEmpty().trim(),
    body('degree', 'Degree is required').notEmpty().trim(),
  ],
  createEducation
);

// PUT /api/education/:id
router.put(
  '/:id',
  auth,
  [
    body('schoolName', 'School name cannot be empty').optional().notEmpty().trim(),
    body('degree', 'Degree cannot be empty').optional().notEmpty().trim(),
  ],
  updateEducation
);

// DELETE /api/education/:id
router.delete('/:id', auth, deleteEducation);

module.exports = router;
