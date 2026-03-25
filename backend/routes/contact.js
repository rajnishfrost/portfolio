const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  submitContact,
  getContacts,
  markAsRead,
  deleteContact,
} = require('../controllers/contactController');
const auth = require('../middleware/auth');

// POST /api/contact
router.post(
  '/',
  [
    body('name', 'Name is required').notEmpty().trim(),
    body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    body('message', 'Message is required').notEmpty().trim(),
    body('subject').optional().trim(),
  ],
  submitContact
);

// GET /api/contact
router.get('/', auth, getContacts);

// PUT /api/contact/:id/read
router.put('/:id/read', auth, markAsRead);

// DELETE /api/contact/:id
router.delete('/:id', auth, deleteContact);

module.exports = router;
