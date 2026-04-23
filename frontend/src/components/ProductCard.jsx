import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Zap, X, Cpu, HardDrive, Monitor, Battery, MemoryStick, ShoppingBag, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  // Admin tidak bisa belanja
  const isAdmin = userInfo?.isAdmin;

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (isAdmin) return;
    addToCart(product);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1500);
  };

  const handleBuyNow = (e) => {
    e?.stopPropagation();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (isAdmin) return;
    addToCart(product);
    navigate('/checkout');
  };

  const handleDelete = async () => {
    if (window.confirm('Hapus produk ini?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${product._id}`, config);
        alert('Produk berhasil dihapus');
        setIsModalOpen(false);
        window.location.reload(); 
      } catch (error) {
        console.error(error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const handleEdit = () => {
    setIsModalOpen(false);
    // Navigasi ke halaman akun dan buka tab edit dengan data produk ini
    navigate('/account', { state: { editProduct: product } });
  };

  const specs = product.specifications || {};
  const specList = [
    { icon: <MemoryStick size={14} />, label: 'RAM', value: specs.ram },
    { icon: <HardDrive size={14} />, label: 'Storage', value: specs.storage },
    { icon: <Cpu size={14} />, label: 'Prosesor', value: specs.processor },
    { icon: <Monitor size={14} />, label: 'Layar', value: specs.screen },
    { icon: <Battery size={14} />, label: 'Baterai', value: specs.battery },
  ].filter(s => s.value);

  return (
    <>
      {/* ── CARD ── */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Gambar */}
        <div className="h-56 overflow-hidden relative bg-gray-50 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-gray-700 shadow-sm">
            Sisa: {product.stock}
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Stok Habis</span>
            </div>
          )}
        </div>

        {/* Konten */}
        <div className="p-5">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{product.brand}</div>
          <h3 className="text-base font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>

          {/* Spek singkat */}
          {specList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {specList.slice(0, 2).map(s => (
                <span key={s.label} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  {s.icon} {s.value}
                </span>
              ))}
            </div>
          )}

          {/* Harga & CTA */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-extrabold text-gray-900">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {/* Hanya tampilkan tombol belanja untuk user biasa / tamu */}
            {!isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  title="Masukkan ke Keranjang"
                  className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                    product.stock > 0
                      ? cartAdded
                        ? 'bg-green-500 text-white scale-110'
                        : 'bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {cartAdded ? <CheckCircle size={18} /> : <ShoppingCart size={18} className={cartAdded ? '' : 'group-hover:animate-bounce'} />}
                  {cartAdded && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap animate-in fade-in zoom-in shadow">
                      Ditambahkan!
                    </span>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    product.stock > 0
                      ? 'bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-sm hover:shadow-orange-200 hover:shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Zap size={14} /> Beli
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PopUp DETAIL ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl animate-in zoom-in-95 fade-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header gambar */}
            <div className="relative bg-gray-50 h-64 flex items-center justify-center rounded-t-3xl overflow-hidden">
              <img src={product.image} alt={product.name} className="object-contain h-full w-full p-6" />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white rounded-full p-2 shadow transition-colors"
              >
                <X size={20} />
              </button>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-gray-700 shadow-sm">
                Sisa Stok: {product.stock}
              </div>
            </div>

            {/* Konten detail */}
            <div className="p-8">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{product.brand}</div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">{product.description}</p>

              {/* Spesifikasi lengkap */}
              {specList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Spesifikasi</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specList.map(s => (
                      <div key={s.label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <span className="text-blue-500">{s.icon}</span>
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase font-bold">{s.label}</div>
                          <div className="text-sm font-semibold text-gray-800">{s.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Harga & CTA PopUp */}
              <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Harga</div>
                  <div className="text-3xl font-extrabold text-gray-900">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={handleEdit}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200"
                      >
                        <Pencil size={20} /> Edit Produk
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-all duration-200"
                      >
                        <Trash2 size={20} /> Hapus Produk
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                          product.stock > 0
                            ? cartAdded
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {cartAdded ? <CheckCircle size={20} /> : <ShoppingBag size={20} />}
                        {cartAdded ? 'Ditambahkan!' : 'Keranjang'}
                      </button>
                      <button
                        onClick={handleBuyNow}
                        disabled={product.stock <= 0}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                          product.stock > 0
                            ? 'bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Zap size={20} /> Beli Langsung
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
