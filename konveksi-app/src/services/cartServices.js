import React from 'react';
import API from '../../services/api';

const loadSnapScript = () => {
  if (document.getElementById('midtrans-snap')) return Promise.resolve();
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.id = 'midtrans-snap';
    s.src = `https://app.sandbox.midtrans.com/snap/snap.js`;
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '';
    if (clientKey) s.setAttribute('data-client-key', clientKey);
    s.onload = resolve;
    document.head.appendChild(s);
  });
};

const CartSection = ({ cartItems = [], clearCart = () => {}, getCartTotal = () => 0, customerInfo = {} }) => {
  const buildPayload = () => ({
    items: cartItems.map(i => ({
      productId: i._id || i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    })),
    customer: {
      name: customerInfo?.name || 'Guest',
      email: customerInfo?.email || '',
      phone: customerInfo?.phone || '',
      address: customerInfo?.address || '',
    },
  });

  const handleCheckoutRedirect = async () => {
    try {
      const payload = buildPayload();
      const res = await API.post('/orders', payload);
      const redirect = res?.data?.midtrans?.redirect_url;
      if (redirect) {
        window.location.href = redirect;
      } else {
        alert('Gagal membuat transaksi (redirect). Coba lagi.');
        console.error('Missing redirect_url', res?.data);
      }
    } catch (err) {
      console.error(err);
      alert('Checkout error: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleCheckoutSnap = async () => {
    try {
      const payload = buildPayload();
      const res = await API.post('/orders', payload);
      const token = res?.data?.midtrans?.token;
      if (!token) {
        alert('Gagal membuat transaksi (token). Coba lagi.');
        console.error('Missing token', res?.data);
        return;
      }
      await loadSnapScript();
      window.snap.pay(token, {
        onSuccess: function(result){
          console.log('Midtrans success', result);
        },
        onPending: function(result){
          console.log('Midtrans pending', result);
          alert('Pembayaran pending. Cek status pesanan di dashboard.');
        },
        onError: function(result){
          console.error('Midtrans error', result);
          alert('Terjadi error saat pembayaran.');
        },
        onClose: function(){
          alert('Anda menutup popup pembayaran.');
        }
      });
    } catch (err) {
      console.error(err);
      alert('Checkout error: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <section className="cart-section">
      <div className="cart-actions">
        <button onClick={handleCheckoutRedirect} className="btn btn-primary">Checkout (Redirect)</button>
        <button onClick={handleCheckoutSnap} className="btn btn-outline">Checkout (Snap)</button>
      </div>
    </section>
  );
};

export default CartSection;