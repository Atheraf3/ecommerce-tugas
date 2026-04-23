import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Package, Settings, LogOut, PlusCircle, Users, X, CheckCircle, Pencil, Trash2, LayoutList, Loader2, MapPin, Truck, CreditCard, ShoppingBag, Save } from 'lucide-react';
import axios from 'axios';

const emptyForm = {
  name: '', price: '', brand: '', category: '', stock: '', image: '', description: '',
  specifications: { ram: '', storage: '', processor: '', screen: '', battery: '' }
};

const AccountPage = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('profile');

  // Admin – User states
  const [users, setUsers] = useState([]);
  const [selectedUserOrders, setSelectedUserOrders] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Admin – Product states
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productSuccess, setProductSuccess] = useState(false);
  const [productLoading, setProductLoading] = useState(false);

  // User – My Orders states
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // User – Settings / Alamat Tersimpan
  const [addressForm, setAddressForm] = useState({ phone: '', street: '', city: '', postalCode: '', notes: '' });
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    if (userInfo.isAdmin) {
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'manage-products' || activeTab === 'add-product') fetchProducts();
    } else {
      if (activeTab === 'orders') fetchMyOrders();
      if (activeTab === 'settings' || activeTab === 'profile') fetchProfile();
    }
  }, [userInfo, navigate, activeTab]);

  // Efek untuk menangani Edit Produk dari ProductCard (Modal Detail)
  useEffect(() => {
    if (location.state?.editProduct && userInfo?.isAdmin) {
      startEditProduct(location.state.editProduct);
      // Bersihkan state agar tidak terpicu berulang kali saat refresh atau ganti tab
      window.history.replaceState({}, document.title);
    }
  }, [location.state, userInfo]);

  const cfg = () => ({ headers: { Authorization: `Bearer ${userInfo.token}` } });

  const handleLogout = () => { logout(); navigate('/'); };

  // ── My Orders ──
  const fetchMyOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders/myorders', cfg());
      setMyOrders(data);
    } catch (e) { console.error(e); }
    setOrdersLoading(false);
  };

  // ── Profile / Alamat ──
  const fetchProfile = async () => {
    setAddressLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/users/profile', cfg());
      if (data.address) {
        setAddressForm({
          phone: data.address.phone || '',
          street: data.address.street || '',
          city: data.address.city || '',
          postalCode: data.address.postalCode || '',
          notes: data.address.notes || '',
        });
      }
    } catch (e) { console.error(e); }
    setAddressLoading(false);
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    setAddressSaved(false);
    try {
      await axios.put('http://localhost:5000/api/users/profile', { address: addressForm }, cfg());
      setAddressSaved(true);
      setTimeout(() => setAddressSaved(false), 3000);
    } catch (e) {
      alert('Gagal menyimpan alamat');
    }
    setAddressLoading(false);
  };

  // ── Users CRUD ──
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users', cfg());
      setUsers(data);
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Hapus pengguna ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, cfg());
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (e) { alert('Gagal menghapus pengguna'); }
  };

  const openUserOrders = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/users/${userId}/orders`, cfg());
      setSelectedUserOrders(data);
      setIsOrderModalOpen(true);
    } catch (e) { console.error(e); }
  };

  // ── Products CRUD ──
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch (e) { console.error(e); }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      };
      if (editingProductId) {
        await axios.put(`http://localhost:5000/api/products/${editingProductId}`, payload, cfg());
      } else {
        await axios.post('http://localhost:5000/api/products', payload, cfg());
      }
      setProductSuccess(true);
      setProductForm(emptyForm);
      setEditingProductId(null);
      setTimeout(() => setProductSuccess(false), 3000);
      fetchProducts();
    } catch (e) {
      alert('Gagal menyimpan produk');
    }
    setProductLoading(false);
  };

  const startEditProduct = (product) => {
    setProductForm({
      name: product.name,
      price: product.price,
      brand: product.brand,
      category: product.category,
      stock: product.stock,
      image: product.image,
      description: product.description,
      specifications: {
        ram: product.specifications?.ram || '',
        storage: product.specifications?.storage || '',
        processor: product.specifications?.processor || '',
        screen: product.specifications?.screen || '',
        battery: product.specifications?.battery || '',
      }
    });
    setEditingProductId(product._id);
    setActiveTab('add-product');
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, cfg());
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) { alert('Gagal menghapus produk'); }
  };

  const setSpec = (key, val) => setProductForm(f => ({
    ...f,
    specifications: { ...f.specifications, [key]: val }
  }));

  if (!userInfo) return null;

  const adminNav = [
    { id: 'profile', label: 'Profil Admin', icon: <User size={18} /> },
    { id: 'users', label: 'Kelola Pengguna', icon: <Users size={18} /> },
    { id: 'manage-products', label: 'Kelola Produk', icon: <LayoutList size={18} /> },
    { id: 'add-product', label: 'Tambah/Edit Produk', icon: <PlusCircle size={18} /> },
  ];

  const userNav = [
    { id: 'profile', label: 'Profil Saya', icon: <User size={18} /> },
    { id: 'orders', label: 'Pesanan Saya', icon: <Package size={18} /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={18} /> },
  ];

  const currentNav = userInfo.isAdmin ? adminNav : userNav;

  return (
    <div className="animate-in fade-in pt-8 mb-24 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{userInfo.isAdmin ? 'Admin Panel' : 'Akun Saya'}</h1>

      <div className="grid md:grid-cols-4 gap-8">

        {/* ── Sidebar ── */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className={`p-6 text-center ${userInfo.isAdmin ? 'bg-indigo-50 border-indigo-100' : 'bg-blue-50 border-blue-100'} border-b`}>
              <div className={`w-20 h-20 mx-auto ${userInfo.isAdmin ? 'bg-indigo-600' : 'bg-blue-600'} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md uppercase`}>
                {userInfo.name.charAt(0)}
              </div>
              <h3 className="font-bold text-gray-900">{userInfo.name}</h3>
              <p className={`text-xs font-bold mt-1 ${userInfo.isAdmin ? 'text-indigo-600' : 'text-blue-600'}`}>
                {userInfo.isAdmin ? 'ADMINISTRATOR' : 'Verified User'}
              </p>
            </div>
            <div className="p-2 space-y-1">
              {currentNav.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id ? (userInfo.isAdmin ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white') : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {item.icon}{item.label}
                </button>
              ))}
              <hr className="my-2 border-gray-100" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={18} /> Keluar
              </button>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="md:col-span-3 space-y-6">

          {/* PROFIL */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Pribadi</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Nama Lengkap</label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium">{userInfo.name}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Alamat Email</label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium">{userInfo.email}</div>
                  </div>
                </div>
              </div>

              {/* Alamat tersimpan — hanya untuk user biasa */}
              {!userInfo.isAdmin && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin size={20} className="text-blue-500" /> Alamat Pengiriman
                    </h2>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="text-xs text-blue-500 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Ubah
                    </button>
                  </div>

                  {addressLoading ? (
                    <div className="flex justify-center py-6"><Loader2 size={24} className="animate-spin text-blue-400" /></div>
                  ) : addressForm.street || addressForm.city || addressForm.phone ? (
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Nomor Telepon</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium">
                          {addressForm.phone || <span className="text-gray-300 italic">Belum diisi</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Kota / Kabupaten</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium">
                          {addressForm.city || <span className="text-gray-300 italic">Belum diisi</span>}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Alamat Lengkap</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium">
                          {addressForm.street || <span className="text-gray-300 italic">Belum diisi</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Kode Pos</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium">
                          {addressForm.postalCode || <span className="text-gray-300 italic">Belum diisi</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Catatan</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium">
                          {addressForm.notes || <span className="text-gray-300 italic">—</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                      <MapPin size={36} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium mb-1">Belum ada alamat tersimpan</p>
                      <p className="text-gray-400 text-sm mb-4">Tambahkan alamat pengiriman default Anda agar checkout lebih cepat.</p>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Tambah Alamat
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FORM TAMBAH / EDIT PRODUK */}
          {activeTab === 'add-product' && userInfo.isAdmin && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{editingProductId ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}</h2>
                {editingProductId && (
                  <button onClick={() => { setProductForm(emptyForm); setEditingProductId(null); }} className="text-sm text-gray-400 hover:text-red-500">
                    Batal Edit
                  </button>
                )}
              </div>
              {productSuccess && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 font-medium">
                  <CheckCircle size={20} /> Produk berhasil {editingProductId ? 'diperbarui' : 'diunggah'}!
                </div>
              )}
              <form onSubmit={submitProduct} className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
                  <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Harga (Rp)</label>
                  <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Merek</label>
                  <input required type="text" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                  <input required type="text" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Smartphone" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stok</label>
                  <input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">URL Gambar</label>
                  <input required type="text" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                  <textarea required rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none resize-none" />
                </div>

                {/* ── Spesifikasi ── */}
                <div className="md:col-span-2">
                  <div className="border-t border-dashed border-gray-200 pt-5 mb-4">
                    <h3 className="font-bold text-gray-800 mb-1">Spesifikasi Perangkat</h3>
                    <p className="text-xs text-gray-400">Isi detail teknis handphone (opsional tapi direkomendasikan)</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: 'ram', label: 'RAM', ph: 'mis. 12GB' },
                      { key: 'storage', label: 'Storage', ph: 'mis. 256GB' },
                      { key: 'processor', label: 'Prosesor/Chipset', ph: 'mis. Snapdragon 8 Gen 3' },
                      { key: 'screen', label: 'Ukuran Layar', ph: 'mis. 6.7 inch AMOLED' },
                      { key: 'battery', label: 'Kapasitas Baterai', ph: 'mis. 5000 mAh' },
                    ].map(({ key, label, ph }) => (
                      <div key={key}>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                        <input
                          type="text"
                          placeholder={ph}
                          value={productForm.specifications[key]}
                          onChange={e => setSpec(key, e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={productLoading}
                  className="md:col-span-2 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  {productLoading ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : editingProductId ? 'Perbarui Produk' : 'Simpan Produk'}
                </button>
              </form>
            </div>
          )}

          {/* TABEL KELOLA PRODUK */}
          {activeTab === 'manage-products' && userInfo.isAdmin && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Kelola Produk ({products.length})</h2>
                <button onClick={() => { setProductForm(emptyForm); setEditingProductId(null); setActiveTab('add-product'); }} className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 flex items-center gap-2">
                  <PlusCircle size={16} /> Tambah
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-100 text-gray-400 uppercase text-xs tracking-wider">
                      <th className="pb-3 px-3">Nama</th>
                      <th className="pb-3 px-3">Merek</th>
                      <th className="pb-3 px-3 text-right">Harga</th>
                      <th className="pb-3 px-3 text-center">Stok</th>
                      <th className="pb-3 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                        <td className="py-3 px-3 font-semibold text-gray-900 truncate max-w-[160px]">{p.name}</td>
                        <td className="py-3 px-3 text-gray-500">{p.brand}</td>
                        <td className="py-3 px-3 text-right font-bold text-gray-800">Rp {p.price.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{p.stock}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditProduct(p)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg" title="Edit"><Pencil size={16} /></button>
                            <button onClick={() => deleteProduct(p._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg" title="Hapus"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && <p className="text-center py-10 text-gray-400">Belum ada produk. Tambahkan dari menu di atas.</p>}
              </div>
            </div>
          )}

          {/* TABEL KELOLA PENGGUNA */}
          {activeTab === 'users' && userInfo.isAdmin && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar Pengguna ({users.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-100 text-gray-400 uppercase text-xs tracking-wider">
                      <th className="pb-3 px-4">Nama</th>
                      <th className="pb-3 px-4">Email</th>
                      <th className="pb-3 px-4 text-center">Peran</th>
                      <th className="pb-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                        <td className="py-4 px-4 font-bold text-gray-900">{user.name}</td>
                        <td className="py-4 px-4 text-gray-600">{user.email}</td>
                        <td className="py-4 px-4 text-center font-bold">
                          {user.isAdmin ? <span className="text-indigo-600 text-xs bg-indigo-50 px-2 py-0.5 rounded-full">Admin</span> : <span className="text-blue-500 text-xs bg-blue-50 px-2 py-0.5 rounded-full">User</span>}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openUserOrders(user._id)} className="text-indigo-600 hover:text-indigo-800 font-bold text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg">Pesanan</button>
                            {user._id !== userInfo._id && (
                              <button onClick={() => deleteUser(user._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg" title="Hapus"><Trash2 size={15} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USER – PESANAN */}
          {activeTab === 'orders' && !userInfo.isAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Pesanan Saya</h2>
                <span className="text-sm text-gray-400">{myOrders.length} pesanan</span>
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
              ) : myOrders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={36} className="text-gray-300" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Belum ada pesanan</h3>
                  <p className="text-gray-400 text-sm mb-5">Anda belum pernah melakukan pembelian.</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                myOrders.map(order => {
                  const shortId = order._id.slice(-8).toUpperCase();
                  const fmtRp = v => `Rp ${Number(v).toLocaleString('id-ID')}`;
                  const fmtDate = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                  return (
                    <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Package size={18} className="text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nomor Pesanan</p>
                            <p className="font-mono font-extrabold text-gray-900">#{shortId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{fmtDate(order.createdAt)}</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.isPaid ? '✓ Lunas' : 'Menunggu Bayar'}
                          </span>
                        </div>
                      </div>

                      {/* Item produk */}
                      <div className="p-5 space-y-3">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 object-contain bg-gray-50 rounded-xl p-1 shrink-0"
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

                      {/* Footer: pengiriman, bayar, total */}
                      <div className="px-5 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <div className="flex flex-col gap-1.5 text-sm">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Truck size={14} className="text-blue-400" />
                            {order.shippingMethod?.name ?? '—'} &mdash; {order.shippingAddress?.city ?? ''}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <CreditCard size={14} className="text-blue-400" />
                            {order.paymentMethod ?? '—'}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Total Pembayaran</p>
                          <p className="text-xl font-extrabold text-blue-600">{fmtRp(order.totalPrice)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* USER – PENGATURAN / ALAMAT */}
          {activeTab === 'settings' && !userInfo.isAdmin && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-500" /> Alamat Pengiriman Default
                </h2>
                {addressSaved && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1.5 rounded-full">
                    <CheckCircle size={16} /> Tersimpan!
                  </div>
                )}
              </div>

              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Simpan alamat pengiriman default Anda agar otomatis terisi saat checkout. Anda tetap dapat mengubahnya saat proses pemesanan.
              </p>

              {addressLoading && !addressSaved ? (
                <div className="flex justify-center py-10"><Loader2 size={28} className="animate-spin text-blue-500" /></div>
              ) : (
                <form onSubmit={saveAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nomor Telepon</label>
                    <input
                      value={addressForm.phone}
                      onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
                    <textarea
                      value={addressForm.street}
                      onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                      placeholder="Nama jalan, nomor rumah, RT/RW, Kelurahan, Kecamatan"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kota / Kabupaten</label>
                    <input
                      value={addressForm.city}
                      onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="Jakarta, Bandung, Surabaya..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kode Pos</label>
                    <input
                      value={addressForm.postalCode}
                      onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      placeholder="12345"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Catatan (opsional)</label>
                    <input
                      value={addressForm.notes}
                      onChange={e => setAddressForm({ ...addressForm, notes: e.target.value })}
                      placeholder="Lantai, blok, warna pagar, dll."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addressLoading}
                    className="sm:col-span-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
                  >
                    {addressLoading ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><Save size={16} /> Simpan Alamat</>}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── MODAL: Riwayat Pesanan Pengguna ── */}
      {isOrderModalOpen && selectedUserOrders && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Riwayat Transaksi Pengguna</h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {selectedUserOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 font-medium">Pengguna ini belum pernah melakukan checkout.</div>
              ) : (
                <div className="space-y-4">
                  {selectedUserOrders.map(order => (
                    <div key={order._id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between border-b pb-2 mb-2 text-sm text-gray-500">
                        <span className="font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="font-bold text-green-600">Terbayar</span>
                      </div>
                      <div className="space-y-2">
                        {order.orderItems?.map(item => (
                          <div key={item._id} className="flex justify-between items-center text-sm font-medium text-gray-800">
                            <span>{item.name} <span className="text-gray-400">(x{item.qty})</span></span>
                            <span>Rp {item.price?.toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-right font-extrabold text-lg text-gray-900">
                        Total: Rp {order.totalPrice?.toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountPage;
