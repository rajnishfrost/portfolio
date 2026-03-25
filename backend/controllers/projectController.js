const { validationResult } = require('express-validator');
const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.featured) {
      filter.featured = req.query.featured === 'true';
    }

    const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('GetProjects error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.error('GetProject error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Protected
exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('CreateProject error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Protected
exports.updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.error('UpdateProject error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Protected
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.error('DeleteProject error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reorder projects
// @route   PUT /api/projects/reorder
// @access  Protected
exports.reorderProjects = async (req, res) => {
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

    await Project.bulkWrite(ops);

    res.json({ message: 'Projects reordered' });
  } catch (error) {
    console.error('ReorderProjects error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
