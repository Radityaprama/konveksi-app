import Order from '../models/Order.js';
import Product from '../models/Product.js';
import midtransService from '../services/midtransService.js';
import whatsappService from '../services/whatsappService.js';

function buildOrderMessage(order, statusLabel) {
  let msg = `*PESANAN DANI KONVEKSI*\n\n`;
  msg += `Halo ${order.customer.name},\n`;
  msg += `${statusLabel}\n\n`;
  msg += `*Detail Pesanan:*\n`;
  order.items.forEach((item, i) => {
    msg += `${i + 1}. ${item.name} - ${item.quantity}x @ Rp ${item.price.toLocaleString('id-ID')}\n`;
  });
  msg += `\n*Total: Rp ${order.total.toLocaleString('id-ID')}*\n`;
  return msg;
}

async function updateStockForOrder(order) {
  for (const item of order.items) {
    if (!item.productId) continue;
    try {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - (item.quantity || 1));
        await product.save();
      }
    } catch (e) {
      console.error('Stock update failed:', item.productId, e.message);
    }
  }
}

async function sendWA(order, message) {
  try {
    if (order.customer.phone) {
      await whatsappService.sendMessage(order.customer.phone, message);
    }
  } catch (err) {
    console.error('WA notification failed:', err.message);
  }
}

export const createOrder = async (req, res, next) => {
  try {
    const { items, customer } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Items tidak boleh kosong' });
    }
    if (!customer || !customer.name) {
      return res.status(400).json({ success: false, message: 'Nama customer wajib diisi' });
    }

    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    const order = await Order.create({ items, customer, total, status: 'pending' });

    try {
      const midtrans = await midtransService.createTransaction(order);

      order.midtrans = {
        order_id: midtrans.order_id,
        token: midtrans.token,
        redirect_url: midtrans.redirect_url,
      };
      await order.save();

      // notif WA - pesanan baru
      let msg = buildOrderMessage(order, 'Terima kasih telah melakukan pemesanan!');
      msg += `*Status: PENDING*\n\n`;
      msg += `Silakan lakukan pembayaran:\n${midtrans.redirect_url}\n\n`;
      msg += `Terima kasih telah berbelanja di Dani Konveksi!`;

      // Tunggu WA terkirim sebelum kirim response ke user
      await sendWA(order, msg);

      return res.status(201).json({
        success: true,
        message: 'Order berhasil dibuat',
        data: order,
        payment: {
          token: midtrans.token,
          redirect_url: midtrans.redirect_url,
        },
      });
    } catch (midtransError) {
      await Order.findByIdAndDelete(order._id);
      throw new Error(`Gagal membuat transaksi pembayaran: ${midtransError.message}`);
    }
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(parseInt(limit)).skip(skip);
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status tidak valid. Pilih: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });

    order.status = status;
    await order.save();

    // Notif status baru
    const statusText = {
      pending: 'Menunggu pembayaran.',
      paid: 'Pembayaran telah dikonfirmasi.',
      processing: 'Pesanan sedang diproses.',
      shipped: 'Pesanan telah dikirim.',
      completed: 'Pesanan telah selesai.',
      cancelled: 'Pesanan dibatalkan.'
    };

    let msg = buildOrderMessage(order, statusText[status]);
    msg += `*Status: ${status.toUpperCase()}*\n\n`;
    msg += `Terima kasih telah berbelanja di Dani Konveksi!`;

    await sendWA(order, msg);

    res.json({ success: true, message: 'Status order berhasil diupdate', data: order });
  } catch (err) {
    next(err);
  }
};

export const midtransNotification = async (req, res, next) => {
  try {
    const notification = req.body;
    const result = await midtransService.verifyNotification(notification);
    const { orderId, transactionId, orderStatus } = result;

    const order = await Order.findOne({ 'midtrans.order_id': orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });

    const prevStatus = order.status;
    order.status = orderStatus;
    order.midtrans.transaction_id = transactionId;

    if (orderStatus === 'paid' && prevStatus !== 'paid') {
      await updateStockForOrder(order);

      let msg = buildOrderMessage(order, 'Pembayaran Anda telah dikonfirmasi!');
      msg += `*Status: BERHASIL*\n\n`;
      msg += `Pesanan Anda akan segera kami proses.\n`;
      msg += `Terima kasih telah berbelanja di Dani Konveksi!`;
      await sendWA(order, msg);
    }

    await order.save();
    console.log(`Order ${order._id} updated: ${prevStatus} -> ${orderStatus}`);
    res.json({ success: true });
  } catch (err) {
    console.error('Midtrans notification error:', err);
    next(err);
  }
};

export const checkPaymentStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });

    if (!order.midtrans?.order_id) {
      return res.status(400).json({ success: false, message: 'Order tidak memiliki transaksi pembayaran' });
    }

    const status = await midtransService.getTransactionStatus(order.midtrans.order_id);
    const prevStatus = order.status;

    let newStatus = order.status;
    if ((status.transaction_status === 'capture' && status.fraud_status === 'accept') || status.transaction_status === 'settlement') {
      newStatus = 'paid';
    } else if (['cancel', 'deny', 'expire'].includes(status.transaction_status)) {
      newStatus = 'cancelled';
    }

    if (newStatus !== prevStatus) {
      order.status = newStatus;
      order.midtrans.transaction_id = status.transaction_id;
      order.midtrans.transaction_status = status.transaction_status;
      order.midtrans.fraud_status = status.fraud_status;

      if (newStatus === 'paid' && prevStatus !== 'paid') {
        await updateStockForOrder(order);

        let msg = buildOrderMessage(order, 'Pembayaran Anda telah dikonfirmasi!');
        msg += `*Status: BERHASIL*\n\n`;
        msg += `Pesanan Anda akan segera kami proses.\n`;
        msg += `Terima kasih telah berbelanja di Dani Konveksi!`;
        sendWA(order, msg);
      }

      await order.save();
      console.log(`Order ${order._id} updated: ${prevStatus} -> ${newStatus}`);
    }

    res.json({ success: true, data: { order, paymentStatus: status } });
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });

    if (['paid', 'processing', 'shipped'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order yang sudah dibayar/diproses tidak dapat dibatalkan' });
    }

    if (order.midtrans?.order_id) {
      midtransService.cancelTransaction(order.midtrans.order_id).catch(() => { });
    }

    order.status = 'cancelled';
    await order.save();

    if (whatsappService.isReady) {
      whatsappService.sendOrderNotification(order).catch(() => { });
    }

    res.json({ success: true, message: 'Order berhasil dibatalkan', data: order });
  } catch (err) {
    next(err);
  }
};