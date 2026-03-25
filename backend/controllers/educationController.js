const { validationResult } = require('express-validator');
const Education = require('../models/Education');

// @desc    Get all education entries
// @route   GET /api/education
// @access  Public
exports.getEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1 });
    res.json(education);
  } catch (error) {
    console.error('GetEducation error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create education entry
// @route   POST /api/education
// @access  Protected
exports.createEducation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const education = await Education.create(req.body);
    res.status(201).json(education);
  } catch (error) {
    console.error('CreateEducation error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update education entry
// @route   PUT /api/education/:id
// @access  Protected
exports.updateEducation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    res.json(education);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Education not found' });
    }
    console.error('UpdateEducation error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete education entry
// @route   DELETE /api/education/:id
// @access  Protected
exports.deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    res.json({ message: 'Education deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Education not found' });
    }
    console.error('DeleteEducation error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
