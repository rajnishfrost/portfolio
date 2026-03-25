const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true,
  },
  companyLogo: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
  bullets: [{
    type: String,
    trim: true,
  }],
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Experience', ExperienceSchema);
