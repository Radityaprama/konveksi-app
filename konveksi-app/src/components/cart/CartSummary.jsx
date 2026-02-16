import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import Button from '../ui/Button';
import API from '../../services/api';

const CartSummary = () => {
  const { getTotalPrice, cartItems, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) return;

    const isValid = cartItems.every(item =>
      (item._id || item.id) &&
      typeof item.price === 'number' &&
      item.quantity > 0
    );

    if (!isValid) {
      alert('Data keranjang tidak valid. Pastikan produk memiliki ID dan harga yang benar.');
      return;
    }

    setIsLoading(true);

    const orderPayload = {
      items: cartItems.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.image || ''
      })),
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }
    };

    try {
      const res = await API.post('/orders', orderPayload);
      if (res?.data?.success) {
        const order = res.data.data;
        const paymentUrl = res.data.payment?.redirect_url;

        localStorage.setItem('pendingOrderId', order._id);
        clearCart();
        setShowCheckout(false);

        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          alert('Pesanan berhasil dibuat!');
        }
      }
    } catch (err) {
      console.error('Order error:', err);
      alert(`Gagal membuat pesanan: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 border-t">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700 font-medium text-lg">Total Keseluruhan:</span>
          <span className="text-3xl font-bold text-blue-600">
            Rp {getTotalPrice().toLocaleString('id-ID')}
          </span>
        </div>

        <Button
          onClick={() => setShowCheckout(true)}
          variant="gradient"
          size="lg"
          className="w-full"
        >
          Lanjutkan ke Pemesanan
        </Button>

        <p className="text-center text-gray-500 text-sm mt-3">
          * Harga belum termasuk ongkos kirim dan biaya custom desain
        </p>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCheckout(false); }}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            style={{ animation: 'modalIn 0.25s ease-out' }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Detail Pemesanan</h2>
                  <p className="text-gray-400 text-sm mt-0.5">Lengkapi informasi di bawah ini</p>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Summary Bar */}
            <div className="px-6 py-3 bg-blue-50 flex items-center justify-between text-sm">
              <span className="text-gray-500">{cartItems.length} produk</span>
              <span className="font-semibold text-blue-700">
                Rp {getTotalPrice().toLocaleString('id-ID')}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOrder} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nama penerima pesanan"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-gray-800 placeholder-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="email@contoh.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-gray-800 placeholder-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  No. WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-gray-800 placeholder-gray-300"
                />
                <p className="text-xs text-gray-400 mt-1">Konfirmasi pesanan dikirim via WhatsApp</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Alamat Pengiriman
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Alamat lengkap"
                  rows="2"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-gray-800 placeholder-gray-300 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-500 font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                </button>
              </div>
            </form>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-center text-xs text-gray-400">
                Pembayaran diproses secara aman melalui payment gateway
              </p>
            </div>
          </div>

          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default CartSummary;