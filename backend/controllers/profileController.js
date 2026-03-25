const { validationResult } = require('express-validator');
const Profile = require('../models/Profile');

// @desc    Get profile
// @route   GET /api/profile
// @access  Public
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('GetProfile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update profile (create if not exists)
// @route   PUT /api/profile
// @access  Protected
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let profile = await Profile.findOne();

    if (profile) {
      profile = await Profile.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      profile = await Profile.create(req.body);
    }

    res.json(profile);
  } catch (error) {
    console.error('UpdateProfile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
