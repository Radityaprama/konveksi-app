import React from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../../utils/constants';
import { useState, useEffect } from 'react';
import API from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import Button from '../ui/Button';
import kaosPanjang from '../../assets/images/kaos-panjang.jpg';
import modelRompi1 from '../../assets/images/model-rompi1.jpg';
import modelRompi2 from '../../assets/images/model-rompi2.jpg';
import modelRompi3 from '../../assets/images/model-rompi3.jpg';
import kaosOlahraga from '../../assets/images/kaos-olahraga.jpg';

const ProductsSection = () => {
  const { addToCart } = useCart();
  const { scrollToSection } = useScrollToSection();

  const productImages = {
    'Kaos Panjang': kaosPanjang,
    'Model Rompi 1': modelRompi1,
    'Model Rompi 2': modelRompi2,
    'Model Rompi 3': modelRompi3,
    'Kaos Olahraga': kaosOlahraga,
  };

  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    let mounted = true;
    API.get('/products')
      .then(r => {
        if (mounted && r?.data?.data) {

          const featuredNames = ['Kaos Panjang', 'Model Rompi 1', 'Model Rompi 2', 'Model Rompi 3', 'Kaos Olahraga'];
          const fromApi = r.data.data
            .filter(p => featuredNames.includes(p.name))
            .map(p => ({ id: p._id || p.id, ...p }));


          if (fromApi.length > 0) {
            setProducts(fromApi.slice(0, 5));
          }
        }
      })
      .catch(() => { });
    return () => { mounted = false; };
  }, []);


  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Produk Unggulan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Produk-produk terbaik kami yang dibuat dengan bahan premium dan jahitan berkualitas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-56 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                <img
                  src={product.image || productImages[product.name]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-transform hover:scale-110"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
                  {product.category}
                </span>
                <p className="text-blue-600 font-bold text-2xl mb-3">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                <Button
                  onClick={() => addToCart({
                    ...product,
                    image: product.image || productImages[product.name]
                  })}
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>➕</span>
                  <span>Tambah ke Keranjang</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => scrollToSection('contact')}
            variant="gradient"
            size="lg"
          >
            Pesan Sekarang
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;