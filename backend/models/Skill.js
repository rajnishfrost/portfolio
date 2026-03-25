const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
  },
  icon: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Skill', SkillSchema);
