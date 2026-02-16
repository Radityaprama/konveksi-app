import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const orderId = localStorage.getItem('pendingOrderId');
            if (orderId) {
                try {
                    const res = await API.get(`/orders/${orderId}`);
                    if (res.data.success) {
                        setOrder(res.data.data);
                    }
                } catch (err) {
                    console.error('Fetch order failed:', err);
                }
            }
            setLoading(false);
        };

        fetchOrder();

        // Redirect otomatis setelah 30 detik (lebih lama agar sempat klik WA)
        const timer = setTimeout(() => navigate('/'), 30000);
        return () => clearTimeout(timer);
    }, [navigate]);

    const handleConfirmWA = () => {
        if (!order) return;

        // Nomor WA Admin - Silakan ganti sesuai keinginan
        const adminPhone = "628820050";

        let message = `*KONFIRMASI PESANAN - DANI KONVEKSI*\n\n`;
        message += `Halo Admin,\n`;
        message += `Saya baru saja menyelesaikan pembayaran untuk pesanan berikut:\n\n`;
        message += `*ID Pesanan:* ${order._id}\n`;
        message += `*Nama:* ${order.customer.name}\n`;
        message += `*Total:* Rp ${order.total.toLocaleString('id-ID')}\n\n`;
        message += `*Detail Pesanan:*\n`;
        order.items.forEach((item, i) => {
            message += `- ${item.name} (${item.quantity}x)\n`;
        });
        message += `\nMohon segera diproses ya. Terima kasih!`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-extrabold text-gray-900 mb-4"
                >
                    Pembayaran Berhasil!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 mb-8"
                >
                    Terima kasih atas pesanan Anda. Kami telah menerima pembayaran Anda dan akan segera memprosesnya.
                </motion.p>

                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100"
                    >
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Ringkasan Pesanan</h3>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">ID Pesanan</span>
                            <span className="font-mono text-xs font-semibold text-gray-800">{order._id}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Total Pembayaran</span>
                            <span className="font-bold text-blue-600">Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-400 leading-relaxed italic">
                                *Silakan klik tombol di bawah untuk konfirmasi ke admin via WhatsApp agar pesanan lebih cepat diproses.
                            </p>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 gap-4"
                >
                    <button
                        onClick={handleConfirmWA}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 text-lg"
                    >
                        <span>📱</span> Konfirmasi via WhatsApp
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-white hover:bg-gray-50 text-gray-600 font-semibold py-3 px-6 rounded-xl border border-gray-200 transition-colors"
                    >
                        Kembali ke Toko
                    </button>
                </motion.div>

                <p className="text-xs text-gray-400 mt-8">
                    Halaman ini akan otomatis kembali ke beranda dalam waktu singkat.
                </p>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
