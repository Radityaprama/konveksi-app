import React from 'react';
import { motion } from 'framer-motion';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import { CATEGORIES } from '../../utils/constants';
import SectionTitle from '../ui/SectionTitle';
import kaosPanjang from '../../assets/images/kaos-panjang.jpg';
import modelRompi1 from '../../assets/images/model-rompi1.jpg';
import modelRompi2 from '../../assets/images/model-rompi2.jpg';
import modelRompi3 from '../../assets/images/model-rompi3.jpg';
import kaosOlahraga from '../../assets/images/kaos-olahraga.jpg';

const CategoriesSection = () => {
  const { scrollToSection } = useScrollToSection();

  const categoryImages = {
    'Kaos Panjang': kaosPanjang,
    'Model Rompi 1': modelRompi1,
    'Model Rompi 2': modelRompi2,
    'Model Rompi 3': modelRompi3,
    'Kaos Olahraga': kaosOlahraga,
  };

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Kategori Produk"
          subtitle="Temukan berbagai jenis pakaian yang kami produksi dengan kualitas terbaik dan harga terjangkau"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-56 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                <img
                  src={categoryImages[category.name]}
                  alt={category.name}
                  className="max-w-full max-h-full object-contain transition-transform hover:scale-110"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                <button
                  onClick={() => scrollToSection('products')}
                  className="mt-3 text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  Lihat Produk →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;