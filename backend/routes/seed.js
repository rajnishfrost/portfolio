const express = require('express');
const router = express.Router();
const { seedData } = require('../controllers/seedController');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Middleware: allow seed if no users exist (first-time setup) or if authenticated
const seedAuth = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      return next();
    }
    // Otherwise require auth
    return auth(req, res, next);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/seed
router.post('/', seedAuth, seedData);

module.exports = router;
