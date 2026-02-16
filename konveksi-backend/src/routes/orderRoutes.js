import express from 'express';
import {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    checkPaymentStatus,
    cancelOrder,
    midtransNotification
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.post('/notification', midtransNotification);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.get('/:id/payment-status', checkPaymentStatus);
router.post('/:id/cancel', cancelOrder);

export default router;
