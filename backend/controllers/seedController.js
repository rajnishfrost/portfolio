const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Achievement = require('../models/Achievement');

// @desc    Seed initial portfolio data
// @route   POST /api/seed
// @access  Protected / One-time
exports.seedData = async (req, res) => {
  try {
    const data = req.body;

    const results = {};

    // Seed Profile
    if (data.profile) {
      await Profile.deleteMany({});
      const profile = await Profile.create(data.profile);
      results.profile = profile;
    }

    // Seed Projects
    if (data.projects && Array.isArray(data.projects)) {
      await Project.deleteMany({});
      const projects = await Project.insertMany(data.projects);
      results.projects = `${projects.length} projects seeded`;
    }

    // Seed Blogs
    if (data.blogs && Array.isArray(data.blogs)) {
      await Blog.deleteMany({});
      const blogs = await Blog.insertMany(data.blogs);
      results.blogs = `${blogs.length} blogs seeded`;
    }

    // Seed Skills
    if (data.skills && Array.isArray(data.skills)) {
      await Skill.deleteMany({});
      const skills = await Skill.insertMany(data.skills);
      results.skills = `${skills.length} skills seeded`;
    }

    // Seed Experience
    if (data.experience && Array.isArray(data.experience)) {
      await Experience.deleteMany({});
      const experience = await Experience.insertMany(data.experience);
      results.experience = `${experience.length} experiences seeded`;
    }

    // Seed Education
    if (data.education && Array.isArray(data.education)) {
      await Education.deleteMany({});
      const education = await Education.insertMany(data.education);
      results.education = `${education.length} education entries seeded`;
    }

    // Seed Achievements
    if (data.achievements && Array.isArray(data.achievements)) {
      await Achievement.deleteMany({});
      const achievements = await Achievement.insertMany(data.achievements);
      results.achievements = `${achievements.length} achievements seeded`;
    }

    res.json({ message: 'Data seeded successfully', results });
  } catch (error) {
    console.error('Seed error:', error.message);
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
};
