import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Loader2, Filter, Search, X, SlidersHorizontal } from 'lucide-react';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Filter state ──────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(30000000);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Daftar merek dinamis dari produk yang ada ─────────────────────
  const availableBrands = useMemo(() => {
    const brands = products.map(p => p.brand).filter(Boolean);
    return [...new Set(brands)].sort();
  }, [products]);

  // ── Harga min & max dari data produk ─────────────────────────────
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 30000000 };
    const prices = products.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  // Inisialisasi maxPrice ke harga maksimum saat produk dimuat
  useEffect(() => {
    if (products.length > 0) {
      setMaxPrice(priceRange.max);
    }
  }, [priceRange.max, products.length]);

  // ── Toggle merek ──────────────────────────────────────────────────
  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // ── Reset semua filter ────────────────────────────────────────────
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setMaxPrice(priceRange.max);
  };

  const isFiltered = searchQuery || selectedBrands.length > 0 || maxPrice < priceRange.max;

  // ── Logic filter gabungan ─────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());

      const matchBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(p.brand);

      const matchPrice = p.price <= maxPrice;

      return matchSearch && matchBrand && matchPrice;
    });
  }, [products, searchQuery, selectedBrands, maxPrice]);

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="animate-in fade-in pt-8 mb-24">
      {/* Header */}
      <div className="bg-gray-900 rounded-3xl p-10 mb-12 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">Katalog Belanja</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Telusuri semua lini terbaru GPhone. Gunakan filter untuk menemukan spesifikasi impian Anda.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar Filter ─────────────────────────────────────────── */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">

            {/* Header filter */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-gray-700" />
                <h2 className="font-bold text-lg">Filter</h2>
              </div>
              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                >
                  <X size={13} /> Reset
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Cari handphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-gray-300 hover:text-gray-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Merek — dinamis dari data produk */}
            <div className="mb-6">
              <h3 className="font-bold mb-3 text-gray-700 text-sm uppercase tracking-wider">Merek</h3>
              {loading ? (
                <p className="text-xs text-gray-400 italic">Memuat merek...</p>
              ) : availableBrands.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Belum ada merek tersedia.</p>
              ) : (
                <div className="space-y-2">
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? 'text-blue-600 font-semibold' : 'text-gray-600 group-hover:text-blue-600'}`}>
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Rentang Harga */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Rentang Harga</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  ≤ {formatRupiah(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={500000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>{formatRupiah(priceRange.min)}</span>
                <span>{formatRupiah(priceRange.max)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Product Grid ──────────────────────────────────────────── */}
        <div className="w-full lg:w-3/4">

          {/* Info hasil filter */}
          {!loading && (
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                Menampilkan <span className="font-bold text-gray-800">{filteredProducts.length}</span> dari{' '}
                <span className="font-bold text-gray-800">{products.length}</span> produk
              </p>
              {isFiltered && (
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery('')}><X size={11} /></button>
                    </span>
                  )}
                  {selectedBrands.map(b => (
                    <span key={b} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {b}
                      <button onClick={() => toggleBrand(b)}><X size={11} /></button>
                    </span>
                  ))}
                  {maxPrice < priceRange.max && (
                    <span className="flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                      ≤ {formatRupiah(maxPrice)}
                      <button onClick={() => setMaxPrice(priceRange.max)}><X size={11} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-gray-50 p-12 text-center rounded-2xl border border-gray-200">
              <Filter size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-bold text-lg mb-1">Produk tidak ditemukan</p>
              <p className="text-gray-400 text-sm mb-4">Coba ubah filter atau kata kunci pencarian Anda.</p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
