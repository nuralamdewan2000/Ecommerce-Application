const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Define your routes here
router.get('/', authenticate, getProducts);
router.get('/:id', authenticate, getProductById);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;
