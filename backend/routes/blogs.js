const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getBlogs, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const auth = require('../middleware/auth');

// GET /api/blogs
router.get('/', getBlogs);

// POST /api/blogs
router.post(
  '/',
  auth,
  [
    body('title', 'Title is required').notEmpty().trim(),
  ],
  createBlog
);

// PUT /api/blogs/:id
router.put(
  '/:id',
  auth,
  [
    body('title', 'Title cannot be empty').optional().notEmpty().trim(),
  ],
  updateBlog
);

// DELETE /api/blogs/:id
router.delete('/:id', auth, deleteBlog);

module.exports = router;
