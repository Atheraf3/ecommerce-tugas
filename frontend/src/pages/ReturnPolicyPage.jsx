import React from 'react';
import { RotateCcw, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

const sections = [
  {
    icon: <CheckCircle size={20} className="text-green-500" />,
    title: 'Kondisi yang Dapat Dikembalikan',
    items: [
      'Produk diterima dalam kondisi rusak atau cacat pabrik',
      'Produk tidak sesuai dengan deskripsi atau foto yang tertera',
      'Produk salah kirim (tipe/warna/kapasitas berbeda dari pesanan)',
      'Produk tidak berfungsi saat pertama kali dihidupkan',
    ],
  },
  {
    icon: <XCircle size={20} className="text-red-400" />,
    title: 'Kondisi yang Tidak Dapat Dikembalikan',
    items: [
      'Produk rusak akibat kelalaian atau penggunaan yang tidak wajar',
      'Permintaan pengembalian melebihi 3 hari setelah produk diterima',
      'Produk sudah dibuka segel tanpa alasan kerusakan',
      'Aksesori dan hadiah promosi tidak termasuk dalam cakupan retur',
    ],
  },
];

const steps = [
  { step: '1', label: 'Hubungi CS', desc: 'Hubungi tim kami via WhatsApp atau email dalam 3x24 jam.' },
  { step: '2', label: 'Kirim Bukti', desc: 'Lampirkan foto/video produk dan nomor pesanan Anda.' },
  { step: '3', label: 'Verifikasi', desc: 'Tim kami akan memverifikasi klaim dalam 1–2 hari kerja.' },
  { step: '4', label: 'Penyelesaian', desc: 'Penggantian produk atau refund diproses dalam 3–5 hari kerja.' },
];

const ReturnPolicyPage = () => {
  return (
    <div className="animate-in fade-in pt-8 mb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
          <RotateCcw size={32} className="text-orange-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Kebijakan Pengembalian</h1>
        <p className="text-gray-500 text-lg">Kami berkomitmen memastikan kepuasan Anda dalam setiap transaksi.</p>
      </div>

      {/* Waktu Pengembalian */}
      <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
        <Clock size={28} className="text-blue-500 shrink-0" />
        <div>
          <div className="font-bold text-blue-900">Batas Waktu Pengembalian</div>
          <div className="text-blue-700 text-sm mt-0.5">Pengajuan retur paling lambat <strong>3 hari (72 jam)</strong> setelah produk diterima berdasarkan tanggal konfirmasi pengiriman.</div>
        </div>
      </div>

      {/* Kondisi */}
      <div className="space-y-6 mb-10">
        {sections.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              {s.icon}
              <h2 className="font-bold text-gray-800 text-lg">{s.title}</h2>
            </div>
            <ul className="space-y-2">
              {s.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-gray-300 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Alur Pengembalian */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package size={20} className="text-indigo-500" />
          <h2 className="font-bold text-gray-800 text-lg">Alur Pengembalian Produk</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-extrabold text-lg mb-3 shadow-md">
                {s.step}
              </div>
              <div className="font-bold text-gray-800 text-sm mb-1">{s.label}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
