import express from 'express';
import whatsappService from '../services/whatsappService.js';

const router = express.Router();

// Get WhatsApp status
router.get('/status', (req, res) => {
    const status = whatsappService.getStatus();
    res.json({
        success: true,
        data: status
    });
});

// Send test message
router.post('/send-test', async (req, res, next) => {
    try {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and message are required'
            });
        }

        const result = await whatsappService.sendMessage(phoneNumber, message);

        res.json({
            success: true,
            message: 'Message sent successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
});

// Disconnect WhatsApp
router.post('/disconnect', async (req, res, next) => {
    try {
        await whatsappService.disconnect();
        res.json({
            success: true,
            message: 'WhatsApp disconnected'
        });
    } catch (error) {
        next(error);
    }
});

// Reconnect WhatsApp
router.post('/reconnect', (req, res) => {
    whatsappService.initialize();
    res.json({
        success: true,
        message: 'WhatsApp reconnection initiated'
    });
});

export default router;
