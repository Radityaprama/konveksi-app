import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import { NAV_ITEMS } from '../../utils/constants';
import Button from '../ui/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { activeSection, scrollToSection } = useScrollToSection();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('#mobile-menu')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const getCartTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <span className="text-xl font-bold">👕</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dani Konveksi</h1>
            <p className="text-xs text-blue-600">Produksi Berkualitas, Harga Terjangkau</p>
          </div>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.section)}
              className={`font-medium capitalize transition-colors ${
                activeSection === item.section 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="relative ml-4">
            <button 
              id="cart-icon"
              onClick={() => scrollToSection('cart')}
              className="relative p-2 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Keranjang belanja"
            >
              <span className="text-xl">🛒</span>
              {getCartTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartTotalItems()}
                </span>
              )}
            </button>
          </div>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden bg-white border-t py-4 px-4 space-y-4"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.section);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-medium ${
                activeSection === item.section 
                  ? 'text-blue-600 border-l-4 border-blue-600 pl-3' 
                  : 'text-gray-700 hover:text-blue-600 pl-4'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t">
            <button 
              onClick={() => {
                scrollToSection('cart');
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full py-2 text-left font-medium text-gray-700 hover:text-blue-600"
            >
              <span>🛒 Keranjang</span>
              {getCartTotalItems() > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;