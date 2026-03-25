const { validationResult } = require('express-validator');
const Skill = require('../models/Skill');
const Category = require('../models/Category');

// @desc    Get all skills grouped by category
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    let categories = await Category.find().sort({ order: 1 });

    // Auto-sync: if no categories exist but skills do, create from existing skills
    if (categories.length === 0) {
      const existingCatNames = await Skill.distinct('category');
      if (existingCatNames.length > 0) {
        const docs = existingCatNames.map((name, i) => ({ name, enabled: true, order: i }));
        await Category.insertMany(docs);
        categories = await Category.find().sort({ order: 1 });
      }
    }

    // For public: only show enabled categories
    const enabledCatNames = categories
      .filter((c) => isAdmin || c.enabled)
      .map((c) => c.name);

    const skills = await Skill.find(
      isAdmin ? {} : { category: { $in: enabledCatNames } }
    ).sort({ order: 1, proficiency: -1 });

    // Group by category, respecting category order
    const grouped = {};
    const catOrder = isAdmin
      ? categories.map((c) => c.name)
      : enabledCatNames;

    for (const catName of catOrder) {
      const catSkills = skills.filter((s) => s.category === catName);
      if (catSkills.length > 0) {
        grouped[catName] = catSkills;
      }
    }

    res.json({ skills, grouped });
  } catch (error) {
    console.error('GetSkills error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Protected
exports.createSkill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    console.error('CreateSkill error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Protected
exports.updateSkill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Skill not found' });
    }
    console.error('UpdateSkill error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Protected
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Skill not found' });
    }
    console.error('DeleteSkill error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reorder skills within a category
// @route   PUT /api/skills/reorder
// @access  Protected
exports.reorderSkills = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ message: 'orderedIds array is required' });
    }

    const ops = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    await Skill.bulkWrite(ops);

    res.json({ message: 'Skills reordered' });
  } catch (error) {
    console.error('ReorderSkills error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
