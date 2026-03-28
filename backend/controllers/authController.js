const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({ username, password: hashed });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'jwt-secret-key', 
      { expiresIn: '1h' }
    );

    // Set cookie
    res.cookie('token', token, { 
      httpOnly: true,
      secure: false, // set to true in production with https
      sameSite: 'lax'
    });

    // Create session
    req.session.userId = user._id;

    res.json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: 'Login failed' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
};
