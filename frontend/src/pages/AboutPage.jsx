import React from 'react';

const AboutPage = () => {
  return (
    <div className="animate-in fade-in pt-8 mb-24 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Cerita Di Balik GPhone</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          GPhone didirikan dengan satu tujuan: Menyediakan akses mudah, transparan, dan terpercaya kepada masyarakat yang ingin membeli smartphone. Sebagai proyek E-Commerce mutakhir, platform ini didedikasikan untuk pengalaman berbelanja nomor satu.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <img 
            src="https://ik.imagekit.io/2xthk8ud4/Ecommerce%20HP/Profile.png?q=80&w=1000&auto=format&fit=crop" 
            alt="Tim Pengembang" 
            className="rounded-3xl shadow-xl rotate-[-2deg] transition-transform hover:rotate-0 duration-500"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Visi Kami</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Menjadi pelopor retail ekosistem digital yang tak hanya menjual produk, tetapi memberikan nilai tambah lewat inovasi pelayanan, antarmuka pengguna interaktif, dan skalabilitas data real-time.
          </p>
          <div className="flex gap-4">
            <div className="border border-gray-200 rounded-xl p-4 text-center w-1/2">
              <h4 className="text-3xl font-black text-blue-600">10k+</h4>
              <p className="text-sm font-medium text-gray-500 mt-1">Pelanggan Aktif</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 text-center w-1/2">
              <h4 className="text-3xl font-black text-indigo-600">99%</h4>
              <p className="text-sm font-medium text-gray-500 mt-1">Tingkat Kepuasan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
