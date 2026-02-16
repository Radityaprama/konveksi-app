import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// fallback credentials kalau .env ga ke-load
if (!process.env.MIDTRANS_SERVER_KEY) {
  process.env.MIDTRANS_SERVER_KEY = 'SB-Mid-server-XXXXXXXXXXXXXXXX';
  process.env.MIDTRANS_CLIENT_KEY = 'SB-Mid-client-XXXXXXXXXXXXXXXX';
  process.env.MIDTRANS_PRODUCTION = 'false';
}

import { connectDB } from './src/config/database.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import whatsappService from './src/services/whatsappService.js';

import healthRoutes from './src/routes/healthRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import midtransRoutes from './src/routes/midtransRoutes.js';
import whatsappRoutes from './src/routes/whatsappRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
whatsappService.initialize();

app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/midtrans', midtransRoutes);
app.use('/api/whatsapp', whatsappRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  await whatsappService.disconnect();
  server.close(() => process.exit(0));
});
