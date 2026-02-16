import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">👕</span>
              </div>
              <h3 className="text-2xl font-bold">Dani Konveksi</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Konveksi baju berkualitas dengan harga terjangkau untuk kebutuhan pribadi, komunitas, maupun perusahaan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">FB</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">IG</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">TW</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">YT</a>
            </div>
          </div>
          
          {/* Products */}
          <div>
            <h4 className="text-lg font-bold mb-4">Produk</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#products" className="hover:text-white transition-colors">Kaos Polos</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Kemeja</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Jaket</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Celana</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Topi & Aksesoris</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#contact" className="hover:text-white transition-colors">Custom Desain</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Sablon Digital</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Bordir Komputer</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Pemesanan Grosir</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Konsultasi Gratis</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Berlangganan untuk mendapatkan promo dan update terbaru dari kami.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Anda"
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-gray-800"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 rounded-r-lg transition-colors">
                ✓
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© 2026 Dani Konveksi. All rights reserved. | Produksi Baju Berkualitas Sejak 2010</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;