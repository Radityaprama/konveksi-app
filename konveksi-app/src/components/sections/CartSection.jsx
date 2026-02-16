import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import SectionTitle from '../ui/SectionTitle';
import CartTable from '../cart/CartTable';
import CartSummary from '../cart/CartSummary';
import Button from '../ui/Button';

const CartSection = () => {
  const { cartItems, clearCart } = useCart();
  const { scrollToSection } = useScrollToSection();

  const handleClearCart = () => {
    if (window.confirm('Kosongkan keranjang belanja?')) {
      clearCart();
    }
  };

  return (
    <section id="cart" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Keranjang Belanja" 
          subtitle="Periksa item yang ingin Anda pesan. Kami siap memproduksi sesuai kebutuhan Anda!"
        />
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Keranjang Anda Kosong</h3>
              <p className="text-gray-600 mb-6">Tambahkan produk untuk memulai pesanan Anda</p>
              <Button 
                onClick={() => scrollToSection('products')}
                variant="primary"
              >
                Lihat Produk
              </Button>
            </div>
          ) : (
            <>
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">
                  {cartItems.length} Item dalam keranjang
                </h3>
                <button 
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Kosongkan Keranjang
                </button>
              </div>
              
              <CartTable items={cartItems} />
              <CartSummary />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CartSection;