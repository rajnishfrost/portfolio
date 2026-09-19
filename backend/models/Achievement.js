const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
  },
  image: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Achievement', AchievementSchema);
