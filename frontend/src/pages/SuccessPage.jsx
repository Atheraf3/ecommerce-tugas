import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Package, MapPin, Truck, CreditCard, Home, ShoppingBag, Loader2 } from 'lucide-react';

const SuccessPage = () => {
  const { orderId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}`, config);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) fetchOrder();
    else setLoading(false);

    // Animasi Progress Bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 35); // 100 * 35ms = ~3.5 detik

    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [orderId, userInfo]);

  // UI Loading (Fetching data)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Menghubungkan ke server...</p>
      </div>
    );
  }

  // UI Processing (Animasi Tunggu)
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-blue-50 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-200 animate-pulse">
              <CreditCard size={40} className="text-white" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Memverifikasi Pembayaran</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
          Mohon tunggu sebentar, kami sedang memproses transaksi Anda dengan aman.
        </p>
        <div className="w-full max-w-xs bg-gray-100 h-2 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{progress}% Selesai</p>
      </div>
    );
  }

  const fmtRp = v => `Rp ${Number(v).toLocaleString('id-ID')}`;
  const shortId = orderId?.slice(-8).toUpperCase();

  return (
    <div className="animate-in fade-in pt-8 mb-24 max-w-2xl mx-auto">

      {/* Hero sukses */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-10 text-center text-white mb-8 shadow-xl shadow-green-200">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
          <CheckCircle size={44} className="text-white" strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Pesanan Berhasil! </h1>
        <p className="text-green-100 mb-4">Terima kasih atas kepercayaan Anda berbelanja di GPhone.</p>
        <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full font-mono font-bold text-white text-sm border border-white/30">
          #{shortId}
        </div>
      </div>

      {/* Detail Pesanan */}
      {order ? (
        <div className="space-y-5">
          {/* Item pesanan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} className="text-blue-500" /> Item Pesanan
            </h2>
            <div className="space-y-4">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-contain bg-gray-50 rounded-xl p-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">x{item.quantity ?? item.qty}</p>
                  </div>
                  <span className="font-bold text-gray-700 text-sm shrink-0">
                    {fmtRp(item.price * (item.quantity ?? item.qty))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info pengiriman */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                <MapPin size={15} className="text-blue-500" /> Alamat Pengiriman
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.city} {order.shippingAddress?.postalCode}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                <Truck size={15} className="text-blue-500" /> Pengiriman
              </h3>
              <p className="text-sm font-semibold text-gray-700">{order.shippingMethod?.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">{fmtRp(order.shippingMethod?.cost ?? 0)}</p>
            </div>
          </div>

          {/* Pembayaran & Total */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-500" /> Ringkasan Pembayaran
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Metode Pembayaran</span>
                <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Status</span>
                <span className="font-bold text-green-600">✓ Pembayaran Berhasil</span>
              </div>
              <div className="flex justify-between font-extrabold text-gray-900 text-base pt-3 border-t border-gray-100 mt-3">
                <span>Total Pembayaran</span>
                <span className="text-blue-600">{fmtRp(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Info langkah selanjutnya */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-700 leading-relaxed">
            <p className="font-bold mb-1">Apa yang terjadi selanjutnya?</p>
            <ul className="list-disc list-inside space-y-1 text-blue-600">
              <li>Pesanan Anda sedang diverifikasi oleh tim GPhone</li>
              <li>Produk akan dikemas dan dikirim dalam 1 hari kerja</li>
              <li>Lacak pesanan Anda di halaman <Link to="/track-order" className="underline font-semibold">Lacak Pesanan</Link></li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Detail pesanan tidak dapat dimuat.</p>
        </div>
      )}

      {/* Tombol aksi */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          to="/"
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors"
        >
          <Home size={18} /> Kembali ke Beranda
        </Link>
        <Link
          to="/shop"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 font-bold py-4 rounded-2xl transition-colors"
        >
          <ShoppingBag size={18} /> Belanja Lagi
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
