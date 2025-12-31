const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create PIN (First time setup)
exports.createPin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || pin.length !== 4) {
      return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    // Check if user already exists
    const existingUser = await User.findOne();
    if (existingUser) {
      return res.status(400).json({ error: 'PIN already exists' });
    }

    const user = new User({ pin });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({ message: 'PIN created successfully', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login with PIN
exports.login = async (req, res) => {
  try {
    const { pin } = req.body;

    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ error: 'No user found. Create PIN first.' });
    }

    const isMatch = await user.comparePin(pin);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect PIN' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if PIN exists
exports.checkPin = async (req, res) => {
  try {
    const user = await User.findOne();
    res.json({ pinExists: !!user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};