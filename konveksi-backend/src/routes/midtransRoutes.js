import express from 'express';
import { midtransNotification } from '../controllers/orderController.js';

const router = express.Router();

router.post('/notification', express.json(), midtransNotification);

export default router;
