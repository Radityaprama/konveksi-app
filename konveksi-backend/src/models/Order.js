import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  productId: { type: String, required: false },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

const OrderSchema = new mongoose.Schema({
  items: [ItemSchema],
  customer: CustomerSchema,
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  midtrans: {
    order_id: String,
    transaction_id: String,
    token: String,
    redirect_url: String,
  },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);