const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategory,
  deleteCategory,
  reorderCategories,
} = require('../controllers/categoryController');
const auth = require('../middleware/auth');

// GET /api/categories
router.get('/', getCategories);

// PUT /api/categories/reorder (before :id routes)
router.put('/reorder', auth, reorderCategories);

// POST /api/categories
router.post('/', auth, createCategory);

// PUT /api/categories/:id
router.put('/:id', auth, updateCategory);

// PUT /api/categories/:id/toggle
router.put('/:id/toggle', auth, toggleCategory);

// DELETE /api/categories/:id
router.delete('/:id', auth, deleteCategory);

module.exports = router;
