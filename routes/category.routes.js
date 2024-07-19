const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Define your routes here
router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, getCategoryById);
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;
