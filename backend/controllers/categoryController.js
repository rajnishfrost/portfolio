const Category = require('../models/Category');
const Skill = require('../models/Skill');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ order: 1 });

    // Auto-sync: if no categories exist but skills do, create categories from existing skills
    if (categories.length === 0) {
      const existingCatNames = await Skill.distinct('category');
      if (existingCatNames.length > 0) {
        const docs = existingCatNames.map((name, i) => ({ name, enabled: true, order: i }));
        await Category.insertMany(docs);
        categories = await Category.find().sort({ order: 1 });
      }
    }

    res.json(categories);
  } catch (error) {
    console.error('GetCategories error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Protected
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const count = await Category.countDocuments();
    const category = await Category.create({ name: name.trim(), order: count });
    res.status(201).json(category);
  } catch (error) {
    console.error('CreateCategory error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update category (rename)
// @route   PUT /api/categories/:id
// @access  Protected
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const oldName = category.name;
    const newName = name.trim();

    // Check if new name already exists (different category)
    if (oldName !== newName) {
      const existing = await Category.findOne({ name: newName, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
    }

    category.name = newName;
    await category.save();

    // Update all skills that had the old category name
    if (oldName !== newName) {
      await Skill.updateMany({ category: oldName }, { $set: { category: newName } });
    }

    res.json(category);
  } catch (error) {
    console.error('UpdateCategory error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle category enabled/disabled
// @route   PUT /api/categories/:id/toggle
// @access  Protected
exports.toggleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.enabled = !category.enabled;
    await category.save();

    res.json(category);
  } catch (error) {
    console.error('ToggleCategory error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete category (and optionally its skills)
// @route   DELETE /api/categories/:id
// @access  Protected
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete all skills in this category
    await Skill.deleteMany({ category: category.name });
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: 'Category and its skills deleted' });
  } catch (error) {
    console.error('DeleteCategory error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Protected
exports.reorderCategories = async (req, res) => {
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

    await Category.bulkWrite(ops);

    res.json({ message: 'Categories reordered' });
  } catch (error) {
    console.error('ReorderCategories error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
