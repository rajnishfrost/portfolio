const { validationResult } = require('express-validator');
const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.featured) {
      filter.featured = req.query.featured === 'true';
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('GetBlogs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Protected
exports.createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    console.error('CreateBlog error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Protected
exports.updateBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    console.error('UpdateBlog error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Protected
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    console.error('DeleteBlog error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
