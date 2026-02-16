const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/admin.controller');

router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

router.get('/orders', protect, adminOnly, getAllOrders);
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);

router.get('/users', protect, adminOnly, getAllUsers);

router.get('/products', protect, adminOnly, getAllProducts);
router.post('/products', protect, adminOnly, createProduct);
router.put('/products/:id', protect, adminOnly, updateProduct);
router.delete('/products/:id', protect, adminOnly, deleteProduct);

module.exports = router;