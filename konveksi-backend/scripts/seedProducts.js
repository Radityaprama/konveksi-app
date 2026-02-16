import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../src/config/database.js';
import Product from '../src/models/Product.js';

const samples = [
  {
    name: 'Kaos Polos Hitam',
    description: 'Kaos polos bahan cotton combed 30s, warna hitam',
    price: 65000,
    category: 'Kaos',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155222c9b8?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4c2c3f6e9d8f3b8d3b8f9f5e0e2a1c0d'
  },
  {
    name: 'Kaos Olahraga Biru',
    description: 'Kaos olahraga breathable, cocok untuk gym',
    price: 120000,
    category: 'Kaos Olahraga',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9a3f8b6d9c1b2a0e4b6c8d7f5a3b2c1d'
  },
  {
    name: 'Rompi Kerja',
    description: 'Rompi kerja bahan tebal dengan kantong tambahan',
    price: 180000,
    category: 'Rompi',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1602810317146-7d5a8d2c4f3b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8b2d3c4f5a6e7b8c9d0f1a2b3c4d5e6f'
  },
];

const run = async () => {
  try {
    await connectDB();
    // Upsert sample products to avoid duplicates
    for (const p of samples) {
      await Product.findOneAndUpdate({ name: p.name }, p, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    const all = await Product.find({}).limit(20);
    console.log('Seed completed. Products in DB:');
    console.log(all.map(x => ({ id: x._id.toString(), name: x.name, price: x.price })));
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

run();
