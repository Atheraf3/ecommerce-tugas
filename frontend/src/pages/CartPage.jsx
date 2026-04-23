import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  // Admin tidak boleh belanja
  if (userInfo?.isAdmin) {
    return (
      <div className="pt-16 mb-24 text-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={48} className="text-indigo-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin tidak dapat berbelanja</h2>
        <p className="text-gray-500 mb-6">Akun Administrator hanya dapat mengelola katalog dan pengguna.</p>
        <Link to="/account" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 inline-flex items-center gap-2">
          Kembali ke Admin Panel
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="animate-in fade-in pt-8 mb-24 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Keranjang Belanja</h1>
        <div className="bg-white p-16 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Anda Kosong</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Sepertinya Anda belum memilih apa pun. Temukan beragam pilihan smartphone kelas atas di katalog kami.
          </p>
          <Link to="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
            Mulai Belanja <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in pt-8 mb-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Keranjang Belanja</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600 font-medium flex items-center gap-1.5 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={16} /> Kosongkan Semua
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Kiri: Daftar Item ── */}
        <div className="w-full lg:w-2/3 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hidden md:grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-6">Produk</div>
            <div className="col-span-3 text-center">Kuantitas</div>
            <div className="col-span-3 text-right">Subtotal</div>
          </div>

          {cartItems.map((item) => (
            <div key={item._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-12 gap-4 items-center hover:border-blue-100 transition-all">
              {/* Gambar + Info */}
              <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">{item.brand}</div>
                  <h3 className="font-bold text-gray-900 truncate text-sm">{item.name}</h3>
                  <div className="text-sm text-gray-400 mt-0.5">Rp {item.price.toLocaleString('id-ID')}</div>
                </div>
                {/* Tombol hapus hanya di mobile */}
                <button onClick={() => removeFromCart(item._id)} className="md:hidden text-gray-300 hover:text-red-500 p-1">
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Kontrol Kuantitas */}
              <div className="col-span-6 md:col-span-3 flex items-center justify-center">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-3 py-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-bold text-gray-800 min-w-[40px] text-center border-x border-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="px-3 py-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Subtotal + Hapus */}
              <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-3">
                <span className="font-extrabold text-gray-900 text-base">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="hidden md:block text-gray-300 hover:text-red-500 transition-colors p-1"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Kanan: Ringkasan ── */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Ringkasan Belanja</h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} item)</span>
                <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>PPN (11%)</span>
                <span className="font-medium">Rp {Math.round(tax).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-gray-900 font-bold">Total Harga</span>
                <span className="text-2xl font-extrabold text-blue-600">
                  Rp {Math.round(total).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-[0_8px_20px_-5px_rgba(37,99,235,0.4)]"
            >
              Proses Checkout <ArrowRight size={20} />
            </Link>

            <div className="mt-5 flex items-start gap-3 bg-green-50 p-4 rounded-xl">
              <ShieldCheck size={22} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-xs text-green-700 font-medium leading-relaxed">
                Transaksi dijamin aman. GPhone menggunakan enkripsi kelas perbankan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
