import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    // Di Vercel jangan exit, biar serverless tetap jalan
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
    if (!isVercel) {
      process.exit(1);
    }
  }
};
