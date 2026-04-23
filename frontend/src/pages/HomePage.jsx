import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Loader2, ArrowRight, ShieldCheck, Truck, Clock, CheckCircle, Mail, X } from 'lucide-react';

// ─── Newsletter Success Pop-up ───────────────────────────────────────────────
const NewsletterModal = ({ onClose }) => (
  <div
    className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    style={{ animation: 'fadeIn 0.2s ease' }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-10 flex flex-col items-center text-center relative overflow-hidden"
      style={{ animation: 'scaleIn 0.25s cubic-bezier(0.21,1.02,0.73,1) both' }}
      onClick={e => e.stopPropagation()}
    >
      {/* Decorative ring */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-70" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-50 rounded-full opacity-60" />

      {/* Icon */}
      <div className="relative z-10 w-20 h-20 mb-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200">
        <CheckCircle size={40} className="text-white" strokeWidth={2} />
      </div>

      <h3 className="relative z-10 text-2xl font-extrabold text-gray-900 mb-2">Berhasil! </h3>
      <p className="relative z-10 text-gray-500 mb-2 leading-relaxed">
        Email Anda telah terdaftar di newsletter <span className="font-bold text-blue-600">GPhone</span>.
      </p>
      <p className="relative z-10 text-sm text-gray-400 mb-8">
        Kami akan mengirimkan info peluncuran & penawaran eksklusif langsung ke kotak masuk Anda.
      </p>

      <button
        onClick={onClose}
        className="relative z-10 w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-opacity shadow-md shadow-blue-200"
      >
        Oke, Terima Kasih!
      </button>

      {/* Close X */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
      >
        <X size={20} />
      </button>
    </div>

    {/* Inline keyframes */}
    <style>{`
      @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      @keyframes scaleIn { from { opacity:0; transform:scale(0.85) translateY(16px) } to { opacity:1; transform:scale(1) translateY(0) } }
    `}</style>
  </div>
);

// ─── Halaman Utama ────────────────────────────────────────────────────────────
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Harap masukkan alamat email Anda terlebih dahulu.');
      return;
    }
    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Format email tidak valid. Contoh: nama@email.com');
      return;
    }
    setEmailError('');
    setShowModal(true);
    setEmail('');
  };

  return (
    <div className="animate-in fade-in duration-500 pt-8">

      {/* Newsletter Success Pop-up */}
      {showModal && <NewsletterModal onClose={() => setShowModal(false)} />}

      {/* ── Hero Banner ────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-3xl overflow-hidden mb-16 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://liputanbangsa.com/wp-content/uploads/2024/09/Cuplikan-layar-2024-09-24-195725.png?q=80&w=2000&auto=format&fit=crop')] opacity-20 mix-blend-overlay bg-cover bg-center" />
        <div className="relative z-10 px-8 py-20 md:py-32 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Beli Disini Sekarang
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              GPhone Baru dalam Genggaman Anda.
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl leading-relaxed">
              Dapatkan perpaduan sempurna antara performa dan desain. GPhone menghadirkan smartphone terbaik di kelasnya khusus untuk Anda.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Belanja Sekarang
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px] opacity-30 animate-pulse" />
              <img
                src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=600&auto=format&fit=crop"
                alt="Smartphone Showcase"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl rotate-[-10deg] animate-in slide-in-from-right-8 duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ─────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { icon: <ShieldCheck size={32} />, title: 'Garansi Resmi', desc: 'Perlindungan penuh 12 bulan dari pabrik.' },
          { icon: <Truck size={32} />, title: 'Gratis Ongkir', desc: 'Pengiriman cepat dan aman ke seluruh Indonesia.' },
          { icon: <Clock size={32} />, title: 'Dukungan 24/7', desc: 'Customer service responsif kapan pun Anda butuh.' },
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Rekomendasi Teratas ────────────────────── */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Rekomendasi Teratas</h2>
            <p className="text-gray-500">Koleksi pilihan untuk memenuhi kebutuhan profesional Anda.</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Lihat Semua <ArrowRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
            <p className="text-gray-400 animate-pulse">Menyiapkan katalog terbaik...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200">
            <p className="font-bold text-lg mb-1">Gagal memuat produk!</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-xl font-bold text-gray-400 mb-2">Belum ada produk</p>
            <p className="text-gray-500">Tambahkan produk lewat Admin Panel terlebih dahulu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Newsletter ─────────────────────────────── */}
      <section className="bg-blue-50 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between mb-20 border border-blue-100">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Dapatkan Update Terbaru</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Berlangganan newsletter <span className="font-bold text-blue-600">GPhone</span> untuk info perilisan produk dan penawaran eksklusif.
          </p>
        </div>
        <div className="md:w-5/12 w-full">
          <form onSubmit={handleNewsletter} noValidate>
            <div className="flex">
              <div className="relative flex-grow">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                  className={`w-full pl-11 pr-4 py-4 rounded-l-2xl border-2 outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-colors ${
                    emailError ? 'border-red-300 bg-red-50' : 'border-transparent bg-white'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-r-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm whitespace-nowrap"
              >
                Kirim
              </button>
            </div>
            {emailError && (
              <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                ⚠ {emailError}
              </p>
            )}
          </form>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
