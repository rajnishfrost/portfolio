const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', BlogSchema);
