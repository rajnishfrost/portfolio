const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Rate limiting: max 3 login attempts per IP in 15 minutes
const loginAttempts = new Map();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
};

const checkRateLimit = (ip) => {
  const record = loginAttempts.get(ip);
  if (!record) return { blocked: false };
  if (Date.now() - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return { blocked: false };
  }
  if (record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.firstAttempt + WINDOW_MS - Date.now()) / 1000);
    return { blocked: true, retryAfter };
  }
  return { blocked: false };
};

const recordFailedAttempt = (ip) => {
  const record = loginAttempts.get(ip);
  if (!record || Date.now() - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: Date.now() });
  } else {
    record.count++;
  }
};

const resetAttempts = (ip) => {
  loginAttempts.delete(ip);
};

// @desc    Register admin user
// @route   POST /api/auth/register
// @access  Protected (only first user or existing admin)
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if any users exist
    const userCount = await User.countDocuments();

    // If users exist, only an authenticated admin can register new users
    if (userCount > 0 && !req.user) {
      return res.status(403).json({ message: 'Only existing admins can register new users' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(clientIp);
    if (rateCheck.blocked) {
      return res.status(429).json({
        message: `Too many login attempts. Try again after ${rateCheck.retryAfter} seconds.`,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      recordFailedAttempt(clientIp);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      recordFailedAttempt(clientIp);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    resetAttempts(clientIp);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Protected
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
