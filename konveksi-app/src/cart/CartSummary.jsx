import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import Button from '../ui/Button';

const CartSummary = () => {
  const { getTotalPrice } = useCart();
  const { scrollToSection } = useScrollToSection();

  return (
    <div className="p-6 bg-gray-50 border-t">
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-700 font-medium text-lg">Total Keseluruhan:</span>
        <span className="text-3xl font-bold text-blue-600">
          Rp {getTotalPrice().toLocaleString('id-ID')}
        </span>
      </div>
      
      <Button 
        onClick={() => scrollToSection('contact')}
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
  );
};

export default CartSummary;