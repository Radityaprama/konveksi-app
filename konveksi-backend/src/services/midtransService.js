import midtransClient from 'midtrans-client';

class MidtransService {
    constructor() {
        this.snap = null;
        this.coreApi = null;
        this.isConfigured = false;
        this.initialized = false;
    }

    _initialize() {
        if (this.initialized) return;

        // Ambil dan bersihkan variabels (hapus spasi tersembunyi)
        this.isProduction = String(process.env.MIDTRANS_PRODUCTION).trim() === 'true';
        const serverKey = (process.env.MIDTRANS_SERVER_KEY || '').trim();
        const clientKey = (process.env.MIDTRANS_CLIENT_KEY || '').trim();
        const merchantId = (process.env.MIDTRANS_MERCHANT_ID || '').trim();

        if (!serverKey || !clientKey) {
            console.warn('Midtrans credentials not configured');
            this.isConfigured = false;
            this.initialized = true;
            return;
        }

        console.log('--- Midtrans Config Check ---');
        console.log('Mode:', this.isProduction ? 'PRODUCTION' : 'SANDBOX');
        console.log('Server Key (first 10):', serverKey.substring(0, 10));
        console.log('Merchant ID:', merchantId || 'not set');
        console.log('-----------------------------');

        this.isConfigured = true;

        const config = {
            isProduction: this.isProduction,
            serverKey,
            clientKey
        };

        if (merchantId) config.merchantId = merchantId;

        this.snap = new midtransClient.Snap(config);
        this.coreApi = new midtransClient.CoreApi(config);

        this.initialized = true;
    }

    async createTransaction(order) {
        this._initialize();

        if (!this.isConfigured) {
            throw new Error('Midtrans belum dikonfigurasi. Cek Environment Variables di Vercel.');
        }

        const { items, customer, total, _id } = order;

        const item_details = items.map(item => ({
            id: item.productId ? String(item.productId).trim() : `item_${Date.now()}`,
            price: Math.round(Number(item.price) || 0),
            quantity: Number(item.quantity) || 1,
            name: (item.name || 'Item').substring(0, 50),
        }));

        const parameter = {
            transaction_details: {
                // Gunakan ID yang sangat bersih
                order_id: `ORDER-${_id}-${Date.now()}`,
                gross_amount: Math.round(total),
            },
            item_details,
            customer_details: {
                first_name: (customer?.name || 'Customer').substring(0, 20),
                email: customer?.email || 'customer@example.com',
                phone: customer?.phone || '08123456789'
            },
            credit_card: { secure: true },
            // Aktifkan semua metode pembayaran standar sandbox
            enabled_payments: [
                'credit_card', 'bca_va', 'bni_va', 'bri_va',
                'permata_va', 'gopay', 'qris', 'shopeepay'
            ]
        };

        try {
            const transaction = await this.snap.createTransaction(parameter);
            console.log('✓ Midtrans Transaksi Berhasil Created:', parameter.transaction_details.order_id);
            return {
                token: transaction.token,
                redirect_url: transaction.redirect_url,
                order_id: parameter.transaction_details.order_id
            };
        } catch (err) {
            console.error('❌ Midtrans API Error Details:', JSON.stringify(err.ApiResponse || err, null, 2));
            throw err;
        }
    }

    async getTransactionStatus(orderId) {
        this._initialize();
        return await this.coreApi.transaction.status(orderId);
    }

    async cancelTransaction(orderId) {
        this._initialize();
        return await this.coreApi.transaction.cancel(orderId);
    }

    async verifyNotification(notification) {
        this._initialize();
        const statusResponse = await this.coreApi.transaction.notification(notification);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const transactionId = statusResponse.transaction_id;

        let orderStatus = 'pending';
        if (transactionStatus === 'capture') {
            orderStatus = fraudStatus === 'accept' ? 'paid' : (fraudStatus === 'challenge' ? 'challenge' : 'cancelled');
        } else if (transactionStatus === 'settlement') {
            orderStatus = 'paid';
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            orderStatus = 'cancelled';
        }

        return { orderId, transactionId, transactionStatus, fraudStatus, orderStatus, statusResponse };
    }
}

const midtransService = new MidtransService();
export default midtransService;
