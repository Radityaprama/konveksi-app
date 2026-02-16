import axios from 'axios';

class WhatsAppService {
  constructor() {
    this.token = process.env.FONNTE_TOKEN;
    this.isReady = !!this.token;
  }

  async sendMessage(phoneNumber, message) {
    console.log('--- WA Debug Start ---');
    console.log('Phone Target:', phoneNumber);
    console.log('Token Present:', !!this.token);

    if (!this.token) {
      console.error('❌ WhatsApp service not configured: FONNTE_TOKEN missing');
      return;
    }

    // Format nomor HP ke 62xxxx
    let formattedNumber = phoneNumber.replace(/\D/g, '');
    if (!formattedNumber.startsWith('62')) {
      formattedNumber = formattedNumber.startsWith('0')
        ? '62' + formattedNumber.substring(1)
        : '62' + formattedNumber;
    }

    console.log('Formatted Number:', formattedNumber);

    try {
      const response = await axios.post('https://api.fonnte.com/send', {
        target: formattedNumber,
        message: message,
        countryCode: '62',
      }, {
        headers: {
          'Authorization': this.token.trim()
        }
      });

      console.log('✅ Fonnte Response:', JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error('❌ Fonnte API Error:');
      console.error('- Message:', err.message);
      if (err.response) {
        console.error('- Status:', err.response.status);
        console.error('- Data:', JSON.stringify(err.response.data));
      }
      throw err;
    } finally {
      console.log('--- WA Debug End ---');
    }
  }

  async sendOrderNotification(order) {
    const { customer, items, total, status } = order;

    const statusText = {
      pending: 'Terima kasih telah melakukan pemesanan!',
      paid: 'Pembayaran Anda telah dikonfirmasi!',
      processing: 'Pesanan Anda sedang diproses.',
      shipped: 'Pesanan Anda telah dikirim!',
      completed: 'Pesanan Anda telah selesai.',
      cancelled: 'Pesanan Anda dibatalkan.'
    };

    let message = `*PESANAN DANI KONVEKSI*\n\n`;
    message += `Halo ${customer.name},\n`;
    message += `${statusText[status] || ''}\n\n`;
    message += `*Detail Pesanan:*\n`;

    items.forEach((item, i) => {
      message += `${i + 1}. ${item.name} - ${item.quantity}x @ Rp ${item.price.toLocaleString('id-ID')}\n`;
    });

    message += `\n*Total: Rp ${total.toLocaleString('id-ID')}*\n`;
    message += `*Status: ${status === 'paid' ? 'BERHASIL' : status.toUpperCase()}*\n\n`;

    if (status === 'pending') {
      message += `Silakan lakukan pembayaran untuk melanjutkan pesanan Anda.\n`;
      if (order.midtrans?.redirect_url) {
        message += `Link Pembayaran: ${order.midtrans.redirect_url}\n`;
      }
      message += `\n`;
    } else if (status === 'paid') {
      message += `Pesanan Anda akan segera kami proses.\n\n`;
    }

    message += `Terima kasih telah berbelanja di Dani Konveksi!`;

    if (!customer.phone) return;
    return await this.sendMessage(customer.phone, message);
  }
}

const whatsappService = new WhatsAppService();
export default whatsappService;
