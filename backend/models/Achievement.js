const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  links: [{
    name: { type: String, trim: true },
    url: { type: String, trim: true },
  }],
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Achievement', AchievementSchema);
