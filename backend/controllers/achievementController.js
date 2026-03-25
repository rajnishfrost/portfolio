const { validationResult } = require('express-validator');
const Achievement = require('../models/Achievement');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1 });
    res.json(achievements);
  } catch (error) {
    console.error('GetAchievements error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create achievement
// @route   POST /api/achievements
// @access  Protected
exports.createAchievement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const achievement = await Achievement.create(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    console.error('CreateAchievement error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Protected
exports.updateAchievement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    console.error('UpdateAchievement error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Protected
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json({ message: 'Achievement deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    console.error('DeleteAchievement error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
