const { validationResult } = require('express-validator');
const Experience = require('../models/Experience');

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
    res.json(experiences);
  } catch (error) {
    console.error('GetExperiences error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create experience
// @route   POST /api/experience
// @access  Protected
exports.createExperience = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const experience = await Experience.create(req.body);
    res.status(201).json(experience);
  } catch (error) {
    console.error('CreateExperience error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Protected
exports.updateExperience = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json(experience);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Experience not found' });
    }
    console.error('UpdateExperience error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Protected
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Experience not found' });
    }
    console.error('DeleteExperience error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
