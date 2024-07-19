const express = require('express');
const { register, login, getProfile, updateProfile, deleteProfile } = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const { check } = require('express-validator');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// User registration
router.post('/register', validate([
  check('username').not().isEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]), register);

// User login
router.post('/login', validate([
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').not().isEmpty().withMessage('Password is required')
]), login);

// Get user profile
router.get('/profile', authenticate, getProfile);

// Update user profile
router.put('/profile', authenticate, updateProfile);

// Delete user profile
router.delete('/profile', authenticate, deleteProfile);

module.exports = router;
