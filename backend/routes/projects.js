const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} = require('../controllers/projectController');
const auth = require('../middleware/auth');

// PUT /api/projects/reorder (before :id routes)
router.put('/reorder', auth, reorderProjects);

// GET /api/projects
router.get('/', getProjects);

// GET /api/projects/:id
router.get('/:id', getProject);

// POST /api/projects
router.post(
  '/',
  auth,
  [
    body('title', 'Title is required').notEmpty().trim(),
    body('description', 'Description is required').notEmpty().trim(),
    body('category', 'Category must be Personal, Office, Freelancing, or OpenSource')
      .isIn(['Personal', 'Office', 'Freelancing', 'OpenSource']),
  ],
  createProject
);

// PUT /api/projects/:id
router.put(
  '/:id',
  auth,
  [
    body('title', 'Title cannot be empty').optional().notEmpty().trim(),
    body('description', 'Description cannot be empty').optional().notEmpty().trim(),
    body('category', 'Category must be Personal, Office, Freelancing, or OpenSource')
      .optional()
      .isIn(['Personal', 'Office', 'Freelancing', 'OpenSource']),
  ],
  updateProject
);

// DELETE /api/projects/:id
router.delete('/:id', auth, deleteProject);

module.exports = router;
