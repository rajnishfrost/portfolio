const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require('../controllers/achievementController');
const auth = require('../middleware/auth');

// GET /api/achievements
router.get('/', getAchievements);

// POST /api/achievements
router.post(
  '/',
  auth,
  [
    body('title', 'Title is required').notEmpty().trim(),
  ],
  createAchievement
);

// PUT /api/achievements/:id
router.put(
  '/:id',
  auth,
  [
    body('title', 'Title cannot be empty').optional().notEmpty().trim(),
  ],
  updateAchievement
);

// DELETE /api/achievements/:id
router.delete('/:id', auth, deleteAchievement);

module.exports = router;
