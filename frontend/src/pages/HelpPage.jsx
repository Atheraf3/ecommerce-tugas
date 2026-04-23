import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from 'lucide-react';

const faqs = [
  {
    q: 'Bagaimana cara melakukan pemesanan?',
    a: 'Pilih produk yang Anda inginkan, klik "Keranjang" atau "Beli Langsung", lalu ikuti proses checkout. Pastikan Anda sudah login sebelum melakukan pembelian.',
  },
  {
    q: 'Metode pembayaran apa saja yang tersedia?',
    a: 'Kami menerima pembayaran melalui Transfer Bank (BCA, Mandiri, BNI), QRIS, dan kartu kredit/debit VISA & Mastercard.',
  },
  {
    q: 'Berapa lama proses pengiriman?',
    a: 'Pengiriman reguler membutuhkan 2–5 hari kerja. Untuk pengiriman ekspres, estimasi 1–2 hari kerja. Waktu dapat bervariasi tergantung lokasi tujuan.',
  },
  {
    q: 'Apakah produk yang dijual bergaransi resmi?',
    a: 'Ya, semua produk GPhone dilengkapi garansi resmi dari distributor selama 12 bulan yang mencakup kerusakan pabrik.',
  },
  {
    q: 'Bagaimana jika produk yang diterima rusak atau cacat?',
    a: 'Segera hubungi kami dalam 3x24 jam setelah produk diterima. Kami akan memproses penggantian atau pengembalian dana sesuai kebijakan pengembalian kami.',
  },
  {
    q: 'Bisakah saya membatalkan pesanan?',
    a: 'Pembatalan pesanan dapat dilakukan sebelum pesanan diproses (biasanya dalam 1 jam setelah checkout). Hubungi CS kami sesegera mungkin.',
  },
];

const HelpPage = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="animate-in fade-in pt-8 mb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <HelpCircle size={32} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Pusat Bantuan</h1>
        <p className="text-gray-500 text-lg">Ada pertanyaan? Kami siap membantu Anda.</p>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Pertanyaan yang Sering Diajukan (FAQ)</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map((item, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 pr-4">{item.q}</span>
                {openIdx === idx
                  ? <ChevronUp size={18} className="text-blue-500 shrink-0" />
                  : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed bg-blue-50/30">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Kontak */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Masih butuh bantuan? Hubungi kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <MessageCircle size={24} className="text-green-500" />, label: 'WhatsApp', value: '+6281292152339', href: 'https://wa.me/+6281292152339' },
            { icon: <Phone size={24} className="text-blue-500" />, label: 'Telepon', value: '+6281292152339', href: 'tel:+6281292152339' },
            { icon: <Mail size={24} className="text-indigo-500" />, label: 'Email', value: 'support@gphone.id', href: 'mailto:support@gphone.id' },
          ].map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-center"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">{c.icon}</div>
              <div>
                <div className="font-bold text-gray-800 text-sm">{c.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{c.value}</div>
              </div>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-5">Jam operasional: Senin–Sabtu, pukul 08.00–20.00 WIB</p>
      </div>
    </div>
  );
};

export default HelpPage;
