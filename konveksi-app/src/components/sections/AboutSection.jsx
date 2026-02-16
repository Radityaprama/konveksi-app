import React from 'react';
import { motion } from 'framer-motion';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import Button from '../ui/Button';
import workshopImage from '../../assets/images/tentang-kami.jpg';

const AboutSection = () => {
  const { scrollToSection } = useScrollToSection();

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:w-1/2 mb-10 md:mb-0"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-300 to-amber-500 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 h-96">
              <img 
                src={workshopImage}
                alt="Workshop KonveksiKu"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Workshop Kami
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:w-1/2 md:pl-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Tentang Dani Konveksi</h2>
          <p className="text-gray-600 mb-6">
            Berdiri sejak 2010, Dani Konveksi telah melayani ribuan pelanggan dari berbagai kalangan, mulai dari perusahaan besar, komunitas, hingga perorangan. Kami berkomitmen untuk memberikan produk berkualitas dengan harga terbaik.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <div className="text-3xl font-bold text-blue-600">10+</div>
              <div className="text-gray-600">Tahun Pengalaman</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">5000+</div>
              <div className="text-gray-600">Pelanggan Puas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600">Garansi Kualitas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">24 Jam</div>
              <div className="text-gray-600">Respon Cepat</div>
            </div>
          </div>
          
          <Button 
            onClick={() => scrollToSection('contact')}
            variant="primary"
          >
            Hubungi Kami
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;