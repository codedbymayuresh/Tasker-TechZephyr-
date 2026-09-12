const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { calculateLevelProgress } = require('../utils/rpgEngine');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Shapes a user document into the safe object we send to the client.
const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  xp: user.xp,
  gold: user.gold,
  attributes: user.attributes,
  streak: user.streak,
  inventory: user.inventory,
  ...calculateLevelProgress(user.xp), // level, currentLevelXp, xpForNextLevel
});

// @route POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are all required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // .select('+password') because the schema excludes it by default
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the `protect` middleware
    res.json({ user: formatUser(req.user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe, formatUser };
