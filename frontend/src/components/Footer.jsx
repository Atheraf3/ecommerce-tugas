import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, MessageCircle, Globe, Hash, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group inline-flex">
              <div className="bg-gradient-to-tr from-blue-500 to-indigo-400 text-white p-2 rounded-xl">
                <Smartphone size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">GPhone</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mt-4">
              Toko smartphone premium terpercaya. Dapatkan impian Anda dengan jaminan garansi resmi dan pelayanan luar biasa.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.gsmarena.com/" className="text-gray-400 hover:text-blue-400 transition-colors"><Globe size={20} /></a>
              <a href="https://wa.me/6281292152339/" className="text-gray-400 hover:text-blue-400 transition-colors"><MessageCircle size={20} /></a>
              <a href="https://mrafli.online/" className="text-gray-400 hover:text-pink-400 transition-colors"><Hash size={20} /></a>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Pintasan</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors flex items-center gap-2">Beranda</Link></li>
              <li><Link to="/shop" className="hover:text-blue-400 transition-colors flex items-center gap-2">Katalog Belanja</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2">Tentang Kami</Link></li>
              <li><Link to="/account" className="hover:text-blue-400 transition-colors flex items-center gap-2">Akun Saya</Link></li>
            </ul>
          </div>

          {/* Help Col */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Layanan Pelanggan</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/help" className="hover:text-blue-400 transition-colors">Pusat Bantuan</Link></li>
              <li><Link to="/return-policy" className="hover:text-blue-400 transition-colors">Kebijakan Pengembalian</Link></li>
              <li><Link to="/track-order" className="hover:text-blue-400 transition-colors">Lacak Pesanan</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-400 shrink-0" />
                <span>Tamcot, Samping Rel Kereta Api, Stasiun Taman Kota, Jakarta Barat. 291103</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-blue-400 shrink-0" />
                <span>+62 812-9215-2339</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-blue-400 shrink-0" />
                <span>support@gphone.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} GPhone E-Commerce. All rights reserved.</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            {/* Dummy Payment Badges */}
            <div className="bg-gray-800 text-xs px-3 py-1 rounded text-gray-300 font-bold border border-gray-700">Debit</div>
            <div className="bg-gray-800 text-xs px-3 py-1 rounded text-gray-300 font-bold border border-gray-700">Kredit</div>
            <div className="bg-gray-800 text-xs px-3 py-1 rounded text-gray-300 font-bold border border-gray-700">E-Wallet</div>
            <div className="bg-gray-800 text-xs px-3 py-1 rounded text-gray-300 font-bold border border-gray-700">Paylater</div>
            <div className="bg-gray-800 text-xs px-3 py-1 rounded text-gray-300 font-bold border border-gray-700">VISA</div>
            <div className="bg-gray-800 text-xs px-3 py-1 rounded text-gray-300 font-bold border border-gray-700">MasterCard</div>
            <div className="bg-gray-800 text-xs px-3 py-1 rounded text-gray-300 font-bold border border-gray-700">QRIS</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
