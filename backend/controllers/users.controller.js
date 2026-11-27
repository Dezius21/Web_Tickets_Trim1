const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model.js');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required: username, email, password' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password_hash,
      role: 'Inquilino'
    });

    return res.status(201).json({
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data format', error: error.message });
    }
    return res.status(500).json({ message: 'Internal server error during registration', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password_hash');

    if (!user || !user.state) {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error during login', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role, state } = req.query;
    let filter = {};

    if (role) filter.role = role;
    if (state !== undefined) filter.state = state === 'true';

    const users = await User.find(filter).populate('assignedTickets', 'subject state priority');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('assignedTickets', 'subject state priority');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving user details', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username or email already in use' });
    }
    return res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const updateUserRoleOrStatus = async (req, res) => {
  try {
    const { role, state } = req.body;
    const updateData = {};

    if (role) updateData.role = role;
    if (state !== undefined) updateData.state = state;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User permissions/status updated successfully',
      data: updatedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid role value. Allowed: Administrador, Inquilino, Contratista', error: error.message });
    }
    return res.status(500).json({ message: 'Error updating user permissions', error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving current user', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserRoleOrStatus
};