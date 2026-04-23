import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

const terms = [
  {
    title: '1. Ketentuan Umum',
    content:
      'Dengan mengakses dan menggunakan layanan GPhone, Anda menyetujui syarat dan ketentuan yang berlaku. GPhone berhak mengubah ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Penggunaan layanan secara terus-menerus dianggap sebagai persetujuan terhadap perubahan tersebut.',
  },
  {
    title: '2. Akun Pengguna',
    content:
      'Anda bertanggung jawab atas keamanan akun dan kata sandi Anda. GPhone tidak bertanggung jawab atas kerugian akibat akses tidak sah ke akun Anda. Satu akun hanya boleh digunakan oleh satu orang. Akun yang terindikasi melakukan penipuan atau penyalahgunaan akan dinonaktifkan.',
  },
  {
    title: '3. Pemesanan & Pembayaran',
    content:
      'Semua harga yang tertera sudah termasuk PPN. Pemesanan dianggap sah setelah pembayaran berhasil dikonfirmasi. GPhone berhak membatalkan pesanan jika terdapat indikasi kecurangan atau stok habis. Konfirmasi pembayaran akan dikirim melalui email dalam 1x24 jam.',
  },
  {
    title: '4. Pengiriman',
    content:
      'GPhone bekerja sama dengan jasa ekspedisi terpercaya. Estimasi waktu pengiriman tercantum pada halaman checkout. Risiko kerusakan selama pengiriman ditanggung oleh pihak ekspedisi. GPhone tidak bertanggung jawab atas keterlambatan di luar kendali kami seperti bencana alam atau kondisi cuaca ekstrem.',
  },
  {
    title: '5. Hak Kekayaan Intelektual',
    content:
      'Seluruh konten di platform GPhone — termasuk logo, teks, gambar, dan desain antarmuka — merupakan milik GPhone dan dilindungi oleh hak cipta. Dilarang menyalin, memodifikasi, atau mendistribusikan konten tanpa izin tertulis dari GPhone.',
  },
  {
    title: '6. Privasi Data',
    content:
      'GPhone mengumpulkan data pribadi hanya untuk keperluan proses transaksi, pengiriman, dan peningkatan layanan. Data Anda tidak akan dijual atau dibagikan kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum yang berlaku.',
  },
  {
    title: '7. Batasan Tanggung Jawab',
    content:
      'GPhone tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan layanan kami. Total tanggung jawab GPhone tidak melebihi nilai transaksi yang dipersengketakan. GPhone tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan.',
  },
  {
    title: '8. Hukum yang Berlaku',
    content:
      'Syarat dan Ketentuan ini diatur oleh hukum yang berlaku di Republik Indonesia. Setiap sengketa yang tidak dapat diselesaikan secara musyawarah akan diselesaikan melalui lembaga arbitrase atau pengadilan yang berwenang di Indonesia.',
  },
];

const TermsPage = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="animate-in fade-in pt-8 mb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
          <FileText size={32} className="text-gray-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Syarat & Ketentuan</h1>
        <p className="text-gray-500 text-lg">Harap baca dan pahami ketentuan berikut sebelum menggunakan layanan GPhone.</p>
        <p className="text-xs text-gray-400 mt-3">Terakhir diperbarui: 1 April 2026</p>
      </div>

      {/* Terms Accordion */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="divide-y divide-gray-100">
          {terms.map((item, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-800">{item.title}</span>
                {openIdx === idx
                  ? <ChevronUp size={18} className="text-blue-500 shrink-0" />
                  : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed bg-gray-50/50">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-700 leading-relaxed">
        <span className="font-bold">Catatan:</span> Dengan mendaftar dan menggunakan layanan GPhone, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan di atas. Jika ada pertanyaan, silakan hubungi kami di <a href="mailto:support@gphone.id" className="underline font-semibold">support@gphone.id</a>.
      </div>
    </div>
  );
};

export default TermsPage;
