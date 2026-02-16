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

        this.isProduction = process.env.MIDTRANS_PRODUCTION === 'true';
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        const clientKey = process.env.MIDTRANS_CLIENT_KEY;

        if (!serverKey || !clientKey) {
            console.warn('Midtrans credentials not configured');
            this.isConfigured = false;
            this.initialized = true;
            return;
        }

        console.log('Midtrans Initializing with:');
        console.log('- Production:', this.isProduction);
        console.log('- Server Key:', serverKey ? `${serverKey.substring(0, 10)}...` : 'MISSING');
        console.log('- Client Key:', clientKey ? `${clientKey.substring(0, 10)}...` : 'MISSING');

        this.isConfigured = true;

        this.snap = new midtransClient.Snap({
            isProduction: this.isProduction,
            serverKey,
            clientKey,
        });

        this.coreApi = new midtransClient.CoreApi({
            isProduction: this.isProduction,
            serverKey,
            clientKey,
        });

        this.initialized = true;
    }

    async createTransaction(order) {
        this._initialize();

        if (!this.isConfigured) {
            throw new Error('Midtrans belum dikonfigurasi. Set MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY di .env');
        }

        const { items, customer, total, _id } = order;

        const item_details = items.map(item => ({
            id: item.productId ? String(item.productId) : `item_${Date.now()}`,
            price: Math.round(Number(item.price) || 0),
            quantity: Number(item.quantity) || 1,
            name: item.name || 'Item',
        }));

        const parameter = {
            transaction_details: {
                order_id: `ORDER_${_id}_${Date.now()}`,
                gross_amount: Math.round(total),
            },
            item_details,
            customer_details: {
                first_name: customer?.name || 'Customer',
                email: customer?.email || 'customer@example.com',
                phone: customer?.phone || '08123456789',
                billing_address: {
                    address: customer?.address || '',
                    city: customer?.city || '',
                    postal_code: customer?.postalCode || '',
                },
                shipping_address: {
                    address: customer?.address || '',
                    city: customer?.city || '',
                    postal_code: customer?.postalCode || '',
                }
            },
            credit_card: { secure: true },
            enabled_payments: [
                'credit_card', 'bca_va', 'bni_va', 'bri_va',
                'permata_va', 'other_va', 'gopay', 'shopeepay', 'qris'
            ],
            callbacks: {
                finish: process.env.FRONTEND_URL || 'http://localhost:3000/order-success',
                error: process.env.FRONTEND_URL || 'http://localhost:3000/order-failed',
                pending: process.env.FRONTEND_URL || 'http://localhost:3000/order-pending'
            }
        };

        const transaction = await this.snap.createTransaction(parameter);
        console.log('Midtrans transaction created:', parameter.transaction_details.order_id);

        return {
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            order_id: parameter.transaction_details.order_id
        };
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
        } else if (transactionStatus === 'refund') {
            orderStatus = 'refunded';
        }

        return { orderId, transactionId, transactionStatus, fraudStatus, orderStatus, statusResponse };
    }
}

const midtransService = new MidtransService();
export default midtransService;
