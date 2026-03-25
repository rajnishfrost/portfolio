const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  resumeLink: {
    type: String,
    trim: true,
  },
  socialLinks: {
    github: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    medium: { type: String, trim: true, default: '' },
    twitter: { type: String, trim: true, default: '' },
  },
  profileImage: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  isHireable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
