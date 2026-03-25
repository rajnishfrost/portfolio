const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
  },
  logo: {
    type: String,
    default: '',
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true,
  },
  duration: {
    type: String,
    trim: true,
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

module.exports = mongoose.model('Education', EducationSchema);
