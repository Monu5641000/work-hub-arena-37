
const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  submitDeliverables
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/deliverables', submitDeliverables);

module.exports = router;
