const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');

// GET /api/profile
router.get('/', getProfile);

// PUT /api/profile
router.put(
  '/',
  auth,
  [
    body('name', 'Name is required').optional().notEmpty(),
    body('email', 'Please provide a valid email').optional().isEmail(),
  ],
  updateProfile
);

module.exports = router;
