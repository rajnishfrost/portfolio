const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getSkills, createSkill, updateSkill, deleteSkill, reorderSkills } = require('../controllers/skillController');
const auth = require('../middleware/auth');

// GET /api/skills
router.get('/', getSkills);

// PUT /api/skills/reorder
router.put('/reorder', auth, reorderSkills);

// POST /api/skills
router.post(
  '/',
  auth,
  [
    body('name', 'Skill name is required').notEmpty().trim(),
    body('category', 'Category is required').notEmpty().trim(),
    body('proficiency', 'Proficiency must be a number between 0 and 100')
      .optional()
      .isInt({ min: 0, max: 100 }),
  ],
  createSkill
);

// PUT /api/skills/:id
router.put(
  '/:id',
  auth,
  [
    body('name', 'Skill name cannot be empty').optional().notEmpty().trim(),
    body('category', 'Category cannot be empty').optional().notEmpty().trim(),
    body('proficiency', 'Proficiency must be a number between 0 and 100')
      .optional()
      .isInt({ min: 0, max: 100 }),
  ],
  updateSkill
);

// DELETE /api/skills/:id
router.delete('/:id', auth, deleteSkill);

module.exports = router;
