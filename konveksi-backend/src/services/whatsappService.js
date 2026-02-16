import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.qrCode = null;
  }

  initialize() {
    if (this.client) return;

    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './whatsapp-session'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });

    this.client.on('qr', (qr) => {
      console.log('Scan QR Code berikut untuk login WhatsApp:');
      qrcode.generate(qr, { small: true });
      this.qrCode = qr;
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client ready');
      this.isReady = true;
      this.qrCode = null;
    });

    this.client.on('authenticated', () => console.log('WhatsApp authenticated'));

    this.client.on('auth_failure', (msg) => {
      console.error('WhatsApp auth failure:', msg);
      this.isReady = false;
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp disconnected:', reason);
      this.isReady = false;
    });

    this.client.initialize();
  }

  async sendMessage(phoneNumber, message) {
    if (!this.isReady) throw new Error('WhatsApp client belum siap');

    let formattedNumber = phoneNumber.replace(/\D/g, '');

    if (!formattedNumber.startsWith('62')) {
      formattedNumber = formattedNumber.startsWith('0')
        ? '62' + formattedNumber.substring(1)
        : '62' + formattedNumber;
    }

    const chatId = `${formattedNumber}@c.us`;
    await this.client.sendMessage(chatId, message);
    console.log(`WA sent to ${formattedNumber}`);
    return { success: true, phoneNumber: formattedNumber };
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
    message += `*Status: ${status.toUpperCase()}*\n\n`;

    if (status === 'pending') {
      message += `Silakan lakukan pembayaran untuk melanjutkan pesanan Anda.\n\n`;
    } else if (status === 'paid') {
      message += `Pesanan Anda akan segera kami proses.\n\n`;
    }

    message += `Terima kasih telah berbelanja di Dani Konveksi!`;

    if (!customer.phone) throw new Error('Nomor HP customer tidak tersedia');
    return await this.sendMessage(customer.phone, message);
  }

  async sendPaymentReminder(order) {
    const { customer, total } = order;

    let message = `*PENGINGAT PEMBAYARAN*\n\n`;
    message += `Halo ${customer.name},\n\n`;
    message += `Pesanan Anda dengan total *Rp ${total.toLocaleString('id-ID')}* masih menunggu pembayaran.\n`;
    message += `Silakan segera lakukan pembayaran agar pesanan dapat kami proses.\n\n`;
    message += `Terima kasih!`;

    if (customer.phone) return await this.sendMessage(customer.phone, message);
  }

  getStatus() {
    return {
      isReady: this.isReady,
      hasQR: !!this.qrCode,
      qrCode: this.qrCode
    };
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isReady = false;
      this.client = null;
    }
  }
}

const whatsappService = new WhatsAppService();
export default whatsappService;
