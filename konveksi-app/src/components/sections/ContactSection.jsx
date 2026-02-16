import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/TextArea';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Hubungi Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Siap memproduksi baju sesuai kebutuhan Anda? Hubungi kami sekarang untuk konsultasi gratis!
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="name"
                type="text"
                label="Nama Lengkap"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Masukkan nama Anda"
              />
              
              <Input
                id="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="Masukkan email Anda"
              />
              
              <Textarea
                id="message"
                label="Pesan"
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                placeholder="Tulis pesan Anda di sini..."
              />
              
              <Button type="submit" variant="primary" className="w-full">
                Kirim Pesan
              </Button>
            </form>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Kontak</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">📍</div>
                    <div>
                      <p className="font-medium">Alamat</p>
                      <p className="text-gray-600">Desa Tiparkidul RT 04/01, Kec. Ajibarang, Jawa Barat 40235</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">📱</div>
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p className="text-gray-600">+62 882 0050  (WhatsApp)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">✉️</div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">danikonveksi@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">🕒</div>
                    <div>
                      <p className="font-medium">Jam Operasional</p>
                      <p className="text-gray-600">Senin - Jumat: 08.00 - 17.00 WIB</p>
                      <p className="text-gray-600">Sabtu: 08.00 - 15.00 WIB</p>
                      <p className="text-gray-600">Minggu: Libur</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Lokasi Workshop</h3>
                <div className="bg-gray-100 border-2 border-dashed rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🗺️</div>
                    <p className="text-gray-600">Peta lokasi workshop kami akan ditampilkan di sini</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;