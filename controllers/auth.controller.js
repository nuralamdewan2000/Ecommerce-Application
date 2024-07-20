const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/token.util');

// Function to register a new user
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ username, email, password: hashedPassword });
    
    res.status(200).json({ message: 'User registration sucessfully' });
  } catch (err) {
    res.status(500).json({ message: 'User registration failed', error: err.message });
  }
};

// Function to log in an existing user
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Function to get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      username: user.username,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
};

// Function to update user profile
const updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);

    await user.save();
    res.status(200).json({
      username: user.username,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user profile', error: err.message });
  }
};

// Function to delete user profile
const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user profile', error: err.message });
  }
};

// Export functions at the end
module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile
};
