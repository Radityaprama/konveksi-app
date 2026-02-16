import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import Button from '../ui/Button';
import workshopImage from '../../assets/images/home-image.jpg';

const HeroSection = () => {
  const { scrollToSection } = useScrollToSection();
  const [imageError, setImageError] = useState(false);

  return (
    <section id="home" className="pt-28 pb-16 bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 mb-10 md:mb-0"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Produksi Baju Berkualitas <span className="text-blue-600">Custom</span>
            <br className="hidden md:block" />
            Sesuai Keinginan Anda
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg">
            Konveksi baju dengan pengalaman 10+ tahun, melayani pesanan partai besar maupun satuan dengan kualitas terbaik dan harga kompetitif.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => scrollToSection('products')}
              variant="primary"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              Lihat Produk
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              variant="secondary"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              Hubungi Kami
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:w-1/2 flex justify-center"
        >
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 overflow-hidden border border-gray-100 w-full max-w-md">
            <div className="relative">
              <img 
                src={imageError ? 'https://placehold.co/500x500/e0e7ff/1e293b?text=Workshop+KonveksiKu' : workshopImage}
                alt="Workshop KonveksiKu"
                className="rounded-xl w-full h-80 object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                Workshop Kami
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;