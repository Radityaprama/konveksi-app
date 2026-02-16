import React, { useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection';
import CategoriesSection from '../components/sections/CategoriesSection';
import ProductsSection from '../components/sections/ProductsSections';
import AboutSection from '../components/sections/AboutSection';
import CartSection from '../components/sections/CartSection';
import ContactSection from '../components/sections/ContactSection';
import API from '../services/api';

const Home = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionStatus = urlParams.get('transaction_status');
    const orderId = urlParams.get('order_id');

    if (transactionStatus && orderId) {
      const pendingOrderId = localStorage.getItem('pendingOrderId');

      if (pendingOrderId) {
        API.get(`/orders/${pendingOrderId}/payment-status`)
          .then(res => {
            if (res.data?.data?.order?.status === 'paid') {
              alert('Pembayaran berhasil! Terima kasih atas pesanan Anda.');
            }
            localStorage.removeItem('pendingOrderId');
          })
          .catch(err => console.error('Payment status check failed:', err));
      }

      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection />
      <AboutSection />
      <CartSection />
      <ContactSection />
    </>
  );
};

export default Home;