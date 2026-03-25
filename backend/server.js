const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/education', require('./routes/education'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/seed', require('./routes/seed'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
