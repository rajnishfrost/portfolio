const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Personal', 'Office', 'Freelancing', 'OpenSource'],
    required: [true, 'Category is required'],
  },
  techStack: [{
    type: String,
    trim: true,
  }],
  liveUrl: {
    type: String,
    trim: true,
    default: '',
  },
  githubUrl: {
    type: String,
    trim: true,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
