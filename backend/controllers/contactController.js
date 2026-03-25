const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    console.error('SubmitContact error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Protected
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('GetContacts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark contact as read
// @route   PUT /api/contact/:id/read
// @access  Protected
exports.markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json(contact);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    console.error('MarkAsRead error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Protected
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    console.error('DeleteContact error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
