import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  MapPin, Truck, Search, Package, CheckCircle2,
  Clock, Loader2, LogIn, CreditCard, ShoppingBag
} from 'lucide-react';

// ── Tentukan status & step berdasarkan data pesanan nyata ──────────────────
const getOrderStatus = (order) => {
  if (!order.isPaid) return { key: 'pending', label: 'Menunggu Pembayaran', steps: 0, color: 'bg-yellow-100 text-yellow-700' };

  const paid = new Date(order.paidAt || order.createdAt);
  const now = new Date();
  const hoursElapsed = (now - paid) / (1000 * 60 * 60);

  // Simulasi progres waktu:
  // < 24 jam → diproses, 24–72 jam → dikirim, > 72 jam → diterima
  if (hoursElapsed < 24) {
    return { key: 'processing', label: 'Diproses', steps: 1, color: 'bg-blue-100 text-blue-700' };
  } else if (hoursElapsed < 72) {
    return { key: 'shipping', label: 'Dalam Pengiriman', steps: 2, color: 'bg-indigo-100 text-indigo-700' };
  } else {
    return { key: 'delivered', label: 'Diterima', steps: 3, color: 'bg-green-100 text-green-700' };
  }
};

const getStatusLocation = (key, order) => {
  const city = order.shippingAddress?.city ?? 'tujuan';
  const courier = order.shippingMethod?.name ?? 'kurir';
  switch (key) {
    case 'pending':    return 'Menunggu konfirmasi pembayaran dari sistem.';
    case 'processing': return 'Pesanan sedang diverifikasi dan dikemas oleh tim GPhone.';
    case 'shipping':   return `Paket dalam perjalanan menuju ${city} via ${courier}.`;
    case 'delivered':  return `Paket telah tiba dan diterima di ${city}.`;
    default:           return '-';
  }
};

const trackingSteps = [
  { label: 'Pesanan Dikonfirmasi', icon: <CheckCircle2 size={18} /> },
  { label: 'Dalam Pengiriman',     icon: <Truck size={18} /> },
  { label: 'Pesanan Diterima',     icon: <Package size={18} /> },
];

// ── Komponen utama ─────────────────────────────────────────────────────────
const TrackOrderPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    const shortId = input.trim().replace('#', '').toUpperCase();

    if (!shortId) {
      setError('Harap masukkan nomor pesanan terlebih dahulu.');
      return;
    }
    if (shortId.length !== 8) {
      setError('Nomor pesanan harus terdiri dari 8 karakter (contoh: A1B2C3D4).');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/track/${shortId}`,
        config
      );
      setResult(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Pesanan tidak ditemukan. Pastikan nomor pesanan sudah benar dan merupakan pesanan Anda.');
      } else {
        setError(err.response?.data?.message ?? 'Gagal menghubungi server. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtRp = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`;

  return (
    <div className="animate-in fade-in pt-8 mb-24 max-w-2xl mx-auto">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
          <MapPin size={32} className="text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Lacak Pesanan</h1>
        <p className="text-gray-500 text-lg">Masukkan nomor pesanan untuk melihat status pengiriman Anda.</p>
      </div>

      {/* Jika belum login */}
      {!userInfo ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <LogIn size={28} className="text-indigo-500" />
          </div>
          <h2 className="font-bold text-gray-900 text-xl mb-2">Login diperlukan</h2>
          <p className="text-gray-500 text-sm mb-6">
            Anda harus masuk ke akun Anda untuk dapat melacak pesanan.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Masuk Sekarang
            </Link>
            <Link
              to="/register"
              className="border-2 border-gray-200 hover:border-indigo-300 text-gray-700 font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Daftar
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Form pencarian */}
          <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Pesanan</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Masukkan 8 karakter terakhir ID pesanan..."
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(''); setResult(null); }}
                  maxLength={8}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 font-mono tracking-widest"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Lacak
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
              <span className="font-semibold text-gray-500">ℹ</span>
              Nomor pesanan terdiri dari 8 karakter dan dapat ditemukan di halaman
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="text-indigo-500 underline hover:text-indigo-700 font-semibold"
              >
                Pesanan Saya
              </button>
              (contoh: <span className="font-mono font-bold text-indigo-500">A1B2C3D4</span>).
            </p>
          </form>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-5 flex items-start gap-3">
              <span className="text-red-500 text-lg shrink-0">⚠</span>
              <div>
                <p className="font-bold text-red-600 text-sm">Pesanan tidak ditemukan</p>
                <p className="text-red-400 text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Hasil */}
          {result && (() => {
            const status = getOrderStatus(result);
            const shortId = result._id.slice(-8).toUpperCase();
            const statusLocation = getStatusLocation(status.key, result);

            return (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header pesanan */}
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Nomor Pesanan</p>
                      <p className="font-mono font-extrabold text-gray-900 text-2xl">#{shortId}</p>
                      <p className="text-xs text-gray-500 mt-1.5">Dipesan: {fmtDate(result.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Step tracker */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between relative">
                    {/* Garis background */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 rounded-full mx-10" />
                    {/* Garis progress */}
                    {status.steps > 0 && (
                      <div
                        className="absolute top-5 left-0 h-1 bg-indigo-500 rounded-full mx-10 transition-all duration-700"
                        style={{ width: `${((status.steps - 1) / (trackingSteps.length - 1)) * (100 - 16)}%` }}
                      />
                    )}
                    {trackingSteps.map((s, i) => {
                      const done = i < status.steps;
                      const active = i === status.steps - 1;
                      return (
                        <div key={i} className="flex flex-col items-center z-10 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-sm transition-all
                            ${done ? (active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-indigo-600 text-white') : 'bg-gray-100 text-gray-400'}`}>
                            {s.icon}
                          </div>
                          <p className={`text-xs font-semibold text-center leading-tight ${done ? 'text-indigo-700' : 'text-gray-400'}`}>
                            {s.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status terkini */}
                  <div className="mt-6 p-4 bg-indigo-50 rounded-xl flex items-start gap-3">
                    <Clock size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Status Terkini</p>
                      <p className="text-sm font-semibold text-indigo-800 mt-0.5">{statusLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Detail item */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <ShoppingBag size={15} className="text-blue-500" /> Item Pesanan
                  </h3>
                  <div className="space-y-3">
                    {result.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-gray-50 rounded-xl p-1 shrink-0"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">x{item.quantity ?? item.qty}</p>
                        </div>
                        <span className="font-bold text-gray-700 text-sm shrink-0">
                          {fmtRp(item.price * (item.quantity ?? item.qty ?? 1))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info pengiriman & pembayaran */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Truck size={13} className="text-blue-500" /> Pengiriman
                    </h3>
                    <p className="text-sm font-semibold text-gray-800">{result.shippingMethod?.name ?? '—'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {result.shippingAddress?.address}, {result.shippingAddress?.city} {result.shippingAddress?.postalCode}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                      <CreditCard size={13} className="text-blue-500" /> Pembayaran
                    </h3>
                    <p className="text-sm font-semibold text-gray-800">{result.paymentMethod}</p>
                    <p className="text-xl font-extrabold text-indigo-600 mt-1">{fmtRp(result.totalPrice)}</p>
                  </div>
                </div>

              </div>
            );
          })()}
        </>
      )}
    </div>
  );
};

export default TrackOrderPage;
