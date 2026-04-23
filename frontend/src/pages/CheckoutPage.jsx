import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import {
  MapPin, Truck, CreditCard, ChevronRight, ShieldCheck,
  Package, Loader2, CheckCircle, ArrowLeft, Lock, QrCode, Copy, Info, ShoppingBag
} from 'lucide-react';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

// ── Data Opsi ─────────────────────────────────────────────────────────────────
const shippingOptions = [
  { id: 'jne-reg', name: 'JEENE REG', label: 'Reguler', eta: '2–4 hari', cost: 15000 },
  { id: 'jnt-exp', name: 'JENTE Express', label: 'Express', eta: '1–2 hari', cost: 25000 },
  { id: 'sicepat', name: 'Si Paling Cepet', label: 'Hemat', eta: '3–5 hari', cost: 10000 },
  { id: 'gofood', name: 'GPhone Same Day', label: 'Same Day', eta: 'Hari ini', cost: 45000 },
];

const paymentMethods = [
  { id: 'transfer-bca', label: 'Transfer Bank BCA' },
  { id: 'transfer-mandiri', label: 'Transfer Bank Mandiri' },
  { id: 'qris', label: 'QRIS' },
  { id: 'debit', label: 'Kartu Debit / Kredit'},
  { id: 'paylater', label: 'Paylater'},
];

// ── Step Indicator ────────────────────────────────────────────────────────────
const steps = ['Alamat', 'Pengiriman', 'Pembayaran', 'Konfirmasi'];

const StepBar = ({ current }) => (
  <div className="flex items-center mb-10">
    {steps.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
              ${done ? 'bg-blue-600 text-white' : active ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-100 text-gray-400'}`}>
              {done ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-xs mt-1.5 font-semibold ${active ? 'text-blue-600' : done ? 'text-blue-500' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${i < current ? 'bg-blue-500' : 'bg-gray-100'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── Ringkasan Pesanan (sidebar) ───────────────────────────────────────────────
const OrderSummary = ({ cartItems, shipping, subtotal, tax }) => {
  const shippingCost = shipping?.cost ?? 0;
  const total = Math.round(subtotal + tax + shippingCost);

  const fmtRp = v => `Rp ${v.toLocaleString('id-ID')}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
      <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingBag size={18} className="text-blue-500" /> Ringkasan Pesanan
      </h2>
      
      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
        {cartItems.map((item, idx) => (
          <div key={idx} className="flex gap-3">
            <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{item.quantity} x {fmtRp(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-6 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-700">{fmtRp(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Pajak (11%)</span>
          <span className="font-semibold text-gray-700">{fmtRp(tax)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Pengiriman</span>
          <span className="font-semibold text-gray-700">{fmtRp(shippingCost)}</span>
        </div>
        <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-gray-100 mt-3">
          <span>Total</span>
          <span className="text-blue-600">{fmtRp(total)}</span>
        </div>
      </div>
    </div>
  );
};

// ── Main CheckoutPage ─────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form states
  const [address, setAddress] = useState({
    name: userInfo?.name ?? '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = subtotal * 0.11;
  const total = Math.round(subtotal + tax + (selectedShipping?.cost ?? 0));

  // Ambil alamat tersimpan dari profil user saat halaman pertama kali dibuka
  useEffect(() => {
    const fetchSavedAddress = async () => {
      if (!userInfo) return;
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
        if (data.address) {
          setAddress(prev => ({
            name: prev.name || userInfo.name || '',
            phone: data.address.phone || prev.phone,
            address: data.address.street || prev.address,
            city: data.address.city || prev.city,
            postalCode: data.address.postalCode || prev.postalCode,
            notes: data.address.notes || prev.notes,
          }));
        }
      } catch (e) {
        // Jika gagal, tetap gunakan data kosong (user isi manual)
        console.error('Gagal memuat alamat tersimpan:', e);
      }
    };
    fetchSavedAddress();
  }, [userInfo]);

  // Redirect jika tidak login atau keranjang kosong
  if (!userInfo) {
    navigate('/login');
    return null;
  }
  if (cartItems.length === 0 && step < 3) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 mb-4">Keranjang Anda kosong.</p>
        <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
          Kembali Belanja
        </Link>
      </div>
    );
  }

  // ── Validasi per step ──
  const validateStep = () => {
    if (step === 0) {
      if (!address.name || !address.phone || !address.address || !address.city || !address.postalCode) {
        Swal.fire({
          icon: 'warning',
          title: 'Data Belum Lengkap',
          text: 'Harap lengkapi semua data alamat pengiriman.',
          confirmButtonColor: '#2563eb'
        });
        return false;
      }
      if (!/^[0-9]{8,15}$/.test(address.phone.replace(/[\s-]/g, ''))) {
        Swal.fire({
          icon: 'error',
          title: 'Nomor Tidak Valid',
          text: 'Format nomor telepon tidak sesuai.',
          confirmButtonColor: '#2563eb'
        });
        return false;
      }
    }
    if (step === 1 && !selectedShipping) {
      Toast.fire({ icon: 'warning', title: 'Pilih metode pengiriman!' });
      return false;
    }
    if (step === 2 && !selectedPayment) {
      Toast.fire({ icon: 'warning', title: 'Pilih metode pembayaran!' });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  // ── Submit Order ──
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const payload = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id,
          qty: item.quantity, // backward compat
        })),
        shippingAddress: {
          address: `${address.address}${address.notes ? ' (' + address.notes + ')' : ''}`,
          city: address.city,
          postalCode: address.postalCode,
        },
        shippingMethod: { name: selectedShipping.name, cost: selectedShipping.cost },
        paymentMethod: selectedPayment.label,
        totalPrice: total,
      };
      const { data } = await axios.post('http://localhost:5000/api/orders', payload, config);
      clearCart();
      navigate(`/success/${data._id}`);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: err.response?.data?.message ?? 'Gagal memproses pesanan. Coba lagi.',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setLoading(false);
    }
  };

  const fmtRp = v => `Rp ${v?.toLocaleString('id-ID')}`;

  // Dummy VA Generator
  const dummyVA = selectedPayment?.id === 'transfer-bca' ? '8801' + Math.floor(100000000 + Math.random() * 900000000) : 
                  selectedPayment?.id === 'transfer-mandiri' ? '8902' + Math.floor(100000000 + Math.random() * 900000000) : 
                  '9901' + Math.floor(100000000 + Math.random() * 900000000);

  return (
    <div className="animate-in fade-in pt-8 mb-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {step > 0 && (
          <button onClick={handleBack} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="text-gray-400 text-sm mt-0.5">Selesaikan pesanan Anda dengan aman</p>
        </div>
      </div>

      <StepBar current={step} />

      <div className="flex flex-col lg:flex-row gap-8">

        <div className="flex-1">

          {/* ─── STEP 0: Alamat ─── */}
          {step === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-blue-500" /> Alamat Pengiriman
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Penerima *</label>
                  <input
                    value={address.name}
                    onChange={e => setAddress({ ...address, name: e.target.value })}
                    placeholder="Nama lengkap penerima"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nomor Telepon *</label>
                  <input
                    value={address.phone}
                    onChange={e => setAddress({ ...address, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alamat Lengkap *</label>
                  <textarea
                    value={address.address}
                    onChange={e => setAddress({ ...address, address: e.target.value })}
                    placeholder="Nama jalan, nomor rumah, RT/RW, Kelurahan, Kecamatan"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kota / Kabupaten *</label>
                  <input
                    value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                    placeholder="Jakarta, Bandung, Surabaya..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kode Pos *</label>
                  <input
                    value={address.postalCode}
                    onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="12345"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Catatan (opsional)</label>
                  <input
                    value={address.notes}
                    onChange={e => setAddress({ ...address, notes: e.target.value })}
                    placeholder="Lantai, blok, warna pagar, dll."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 1: Pengiriman ─── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <Truck size={20} className="text-blue-500" /> Metode Pengiriman
              </h2>
              <div className="space-y-3">
                {shippingOptions.map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all
                      ${selectedShipping?.id === opt.id
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="shipping"
                        value={opt.id}
                        checked={selectedShipping?.id === opt.id}
                        onChange={() => setSelectedShipping(opt)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{opt.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{opt.label} · Estimasi {opt.eta}</div>
                      </div>
                    </div>
                    <span className="font-bold text-gray-700 text-sm">Rp {opt.cost.toLocaleString('id-ID')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 2: Pembayaran ─── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-500" /> Metode Pembayaran
              </h2>
              <div className="space-y-3">
                {paymentMethods.map(pm => (
                  <label
                    key={pm.id}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all
                      ${selectedPayment?.id === pm.id
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={selectedPayment?.id === pm.id}
                      onChange={() => setSelectedPayment(pm)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-sm">{pm.label}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 3: Konfirmasi ─── */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Instruksi Pembayaran */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-50 overflow-hidden">
                <div className="bg-blue-600 p-4 text-center">
                  <p className="text-white font-bold flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                    <CreditCard size={16} /> Instruksi Pembayaran
                  </p>
                </div>
                <div className="p-8">
                  {selectedPayment?.id === 'qris' ? (
                    <div className="flex flex-col items-center text-center">
                      <p className="text-sm text-gray-500 mb-4">Silakan pindai kode QR di bawah ini menggunakan aplikasi pembayaran Anda.</p>
                      <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm mb-4">
                        <QRCodeCanvas 
                          value={`GPHONE-PAYMENT-SIMULATION-${total}`} 
                          size={180}
                          level={"H"}
                          includeMargin={true}
                        />
                      </div>
                      <div className="bg-indigo-50 px-4 py-2 rounded-full flex items-center gap-2 mb-2">
                        <QrCode size={16} className="text-indigo-600" />
                        <span className="text-xs font-extrabold text-indigo-700 tracking-wider">QRIS DUMMY</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <p className="text-sm text-gray-500 mb-4">Silakan transfer ke nomor virtual account berikut:</p>
                      <div className="bg-gray-50 w-full p-6 rounded-2xl border-2 border-dashed border-gray-200 mb-4 relative group">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">{selectedPayment?.label}</p>
                        <p className="text-3xl font-black text-gray-900 tracking-wider font-mono">{dummyVA}</p>
                        <button 
                          onClick={() => { 
                            navigator.clipboard.writeText(dummyVA); 
                            Toast.fire({ icon: 'success', title: 'Nomor VA berhasil disalin!' });
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <Copy size={16} className="text-blue-500" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-blue-50 px-3 py-1.5 rounded-full">
                        <Info size={12} className="text-blue-400" />
                        Pengecekan otomatis dalam 5-10 menit setelah transfer.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detail Alamat & Pengiriman */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MapPin size={14} className="text-blue-500" /> Alamat
                  </h3>
                  <p className="text-sm font-bold text-gray-900">{address.name}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{address.address}, {address.city}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Truck size={14} className="text-blue-500" /> Kurir
                  </h3>
                  <p className="text-sm font-bold text-gray-900">{selectedShipping?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedShipping?.label} · {selectedShipping?.eta}</p>
                </div>
              </div>

              {/* Total Card */}
              <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Total Pembayaran</p>
                    <p className="text-3xl font-black mt-1 tracking-tight">{fmtRp(total)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <ShieldCheck size={28} className="text-indigo-300" />
                  </div>
                </div>
              </div>

              {/* Tombol Bayar */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-5 rounded-3xl text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
              >
                {loading
                  ? <><Loader2 size={22} className="animate-spin" /> Memproses...</>
                  : <><CheckCircle size={20} /> Saya Sudah Bayar</>}
              </button>
            </div>
          )}

          {/* ── Tombol Lanjut (Step 0–2) ── */}
          {step < 3 && (
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-base transition-colors flex items-center justify-center gap-2 shadow-[0_6px_20px_-4px_rgba(37,99,235,0.4)]"
            >
              Lanjutkan <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* ── Kanan: Order Summary ── */}
        <div className="w-full lg:w-80 shrink-0">
          <OrderSummary
            cartItems={cartItems}
            shipping={selectedShipping}
            subtotal={subtotal}
            tax={tax}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
