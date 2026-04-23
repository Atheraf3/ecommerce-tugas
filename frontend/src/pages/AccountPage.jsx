import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Package, Settings, LogOut, PlusCircle, Users, X, 
  CheckCircle, Pencil, Trash2, LayoutList, Loader2, MapPin, 
  Truck, CreditCard, ShoppingBag, Save, ChevronRight, Info
} from 'lucide-react';
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

  useEffect(() => {
    if (location.state?.editProduct && userInfo?.isAdmin) {
      startEditProduct(location.state.editProduct);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, userInfo]);

  const cfg = () => ({ headers: { Authorization: `Bearer ${userInfo.token}` } });
  const handleLogout = () => { logout(); navigate('/'); };

  const fetchMyOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/myorders`, cfg());
      setMyOrders(data);
    } catch (e) { console.error(e); }
    setOrdersLoading(false);
  };

  const fetchProfile = async () => {
    setAddressLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, cfg());
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
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, { address: addressForm }, cfg());
      setAddressSaved(true);
      setTimeout(() => setAddressSaved(false), 3000);
    } catch (e) { alert('Gagal menyimpan alamat'); }
    setAddressLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, cfg());
      setUsers(data);
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Hapus pengguna ini?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${id}`, cfg());
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (e) { alert('Gagal menghapus pengguna'); }
  };

  const openUserOrders = async (userId) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userId}/orders`, cfg());
      setSelectedUserOrders(data);
      setIsOrderModalOpen(true);
    } catch (e) { console.error(e); }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
      setProducts(data);
    } catch (e) { console.error(e); }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
      const payload = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) };
      if (editingProductId) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${editingProductId}`, payload, cfg());
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, payload, cfg());
      }
      setProductSuccess(true);
      setProductForm(emptyForm);
      setEditingProductId(null);
      setTimeout(() => setProductSuccess(false), 3000);
      fetchProducts();
    } catch (e) { alert('Gagal menyimpan produk'); }
    setProductLoading(false);
  };

  const startEditProduct = (product) => {
    setProductForm({
      name: product.name, price: product.price, brand: product.brand, category: product.category,
      stock: product.stock, image: product.image, description: product.description,
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
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, cfg());
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) { alert('Gagal menghapus produk'); }
  };

  const setSpec = (key, val) => setProductForm(f => ({
    ...f,
    specifications: { ...f.specifications, [key]: val }
  }));

  const adminNav = [
    { id: 'profile', label: 'Dashboard', icon: <User size={20} /> },
    { id: 'users', label: 'Pengguna', icon: <Users size={20} /> },
    { id: 'manage-products', label: 'Stok Produk', icon: <LayoutList size={20} /> },
    { id: 'add-product', label: 'Tambah', icon: <PlusCircle size={20} /> },
  ];

  const userNav = [
    { id: 'profile', label: 'Profil Saya', icon: <User size={20} /> },
    { id: 'orders', label: 'Pesanan Saya', icon: <Package size={20} /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={20} /> },
  ];

  const currentNav = userInfo.isAdmin ? adminNav : userNav;

  if (!userInfo) return null;

  return (
    <div className="animate-in fade-in pb-24 bg-gray-50/50 min-h-screen">
      
      {/* ── HEADER BANNER ── */}
      <div className={`w-full pt-12 pb-24 md:pb-32 px-4 ${userInfo.isAdmin ? 'bg-gradient-to-r from-indigo-900 to-indigo-700' : 'bg-gradient-to-r from-blue-900 to-indigo-800'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-full flex items-center justify-center text-white text-3xl md:text-5xl font-black shadow-2xl">
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left text-white">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">{userInfo.name}</h1>
            <p className="text-white/60 text-sm md:text-base font-medium mt-1 uppercase tracking-widest">
              {userInfo.isAdmin ? 'Administrator Portal' : 'Member Verified'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border border-white/10">
                {userInfo.email}
              </span>
              {!userInfo.isAdmin && (
                <span className="px-3 py-1 bg-green-500/20 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border border-green-500/20 text-green-300">
                  Platinum Member
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 md:-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── SIDEBAR / MOBILE NAV ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-24">
              {/* Mobile View: Grid Pills */}
              <div className="lg:hidden p-3 grid grid-cols-2 gap-2">
                {currentNav.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                      activeTab === item.id 
                      ? (userInfo.isAdmin ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-200')
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                <button onClick={handleLogout} className="col-span-2 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all border border-red-100 mt-2">
                  <LogOut size={18} /> Keluar dari Akun
                </button>
              </div>

              {/* Desktop View: List */}
              <div className="hidden lg:block p-4 space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-3">Menu Utama</p>
                {currentNav.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === item.id 
                      ? (userInfo.isAdmin ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-blue-600 text-white shadow-lg shadow-blue-100')
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon} {item.label}
                    </div>
                    {activeTab === item.id && <ChevronRight size={16} />}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                    <LogOut size={20} /> Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTENT AREA ── */}
          <div className="lg:col-span-9">
            
            {/* 1. PROFIL SAYA */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><User size={24} /></div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Informasi Pribadi</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                      <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-2xl text-gray-900 font-bold text-lg">{userInfo.name}</div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Email Aktif</label>
                      <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-2xl text-gray-900 font-bold text-lg">{userInfo.email}</div>
                    </div>
                  </div>
                </div>

                {!userInfo.isAdmin && (
                  <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group transition-all hover:shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><MapPin size={24} /></div>
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Alamat Pengiriman</h2>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-0.5">Primary Shipping Address</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveTab('settings')} className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">
                        <Pencil size={14} /> Perbarui Alamat
                      </button>
                    </div>

                    {addressLoading ? (
                      <div className="flex justify-center py-10"><Loader2 size={32} className="animate-spin text-blue-500" /></div>
                    ) : addressForm.street ? (
                      <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Kontak</label>
                          <p className="font-extrabold text-gray-800 text-lg">{addressForm.phone}</p>
                        </div>
                        <div className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Kota / Kode Pos</label>
                          <p className="font-extrabold text-gray-800 text-lg">{addressForm.city}, {addressForm.postalCode}</p>
                        </div>
                        <div className="md:col-span-2 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50">
                          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Alamat Lengkap</label>
                          <p className="font-bold text-gray-800 leading-relaxed text-lg">{addressForm.street}</p>
                          {addressForm.notes && <p className="mt-3 text-sm text-blue-600 font-medium italic bg-white/50 p-3 rounded-xl border border-blue-100">" {addressForm.notes} "</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
                        <MapPin size={48} className="text-gray-200 mx-auto mb-4" />
                        <h4 className="font-black text-gray-400 uppercase tracking-widest">Alamat Belum Disetel</h4>
                        <button onClick={() => setActiveTab('settings')} className="mt-6 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Setel Sekarang</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. PESANAN SAYA */}
            {activeTab === 'orders' && !userInfo.isAdmin && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 px-2">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Riwayat Belanja</h2>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Total {myOrders.length} Pesanan Terdeteksi</p>
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="flex items-center justify-center py-32 bg-white rounded-[2.5rem] border border-gray-100">
                    <Loader2 size={48} className="animate-spin text-blue-600" />
                  </div>
                ) : myOrders.length === 0 ? (
                  <div className="bg-white p-16 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 mx-auto"><ShoppingBag size={48} className="text-gray-200" /></div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">Keranjang Anda Masih Sepi</h3>
                    <p className="text-gray-400 font-medium mb-8">Saatnya membawa pulang gadget impian Anda sekarang.</p>
                    <button onClick={() => navigate('/shop')} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-blue-200">Mulai Jelajah</button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {myOrders.map(order => (
                      <div key={order._id} className="bg-white rounded-[2rem] shadow-lg shadow-gray-200/40 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl hover:border-blue-100 group">
                        {/* Order Status Ribbon */}
                        <div className={`p-4 md:px-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 ${order.isPaid ? 'bg-green-50/30' : 'bg-amber-50/30'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${order.isPaid ? 'bg-green-500 text-white' : 'bg-amber-500 text-white shadow-lg shadow-amber-200'}`}>
                              <Package size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice ID</p>
                              <p className="font-mono font-black text-gray-900 tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal Order</p>
                              <p className="font-bold text-gray-700 text-xs">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 animate-pulse'}`}>
                              {order.isPaid ? 'Payment Success' : 'Pending Payment'}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6 md:p-8 space-y-5">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-5">
                              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl p-2 flex items-center justify-center shrink-0 border border-gray-100">
                                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-black text-gray-900 truncate text-sm md:text-base">{item.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">QTY: {item.quantity || item.qty}</span>
                                  <span className="text-xs font-bold text-blue-600">Rp {item.price.toLocaleString('id-ID')}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer Info */}
                        <div className="px-6 md:px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="grid grid-cols-2 gap-4 md:flex md:gap-8">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm border border-gray-100"><Truck size={14} /></div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Shipping</p>
                                <p className="text-[11px] font-bold text-gray-700 truncate max-w-[100px]">{order.shippingMethod?.name || 'Standard'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm border border-gray-100"><CreditCard size={14} /></div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payment</p>
                                <p className="text-[11px] font-bold text-gray-700 truncate max-w-[100px]">{order.paymentMethod || 'Manual'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
                            <p className="text-2xl md:text-3xl font-black text-blue-600 tracking-tighter">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. PENGATURAN ALAMAT */}
            {activeTab === 'settings' && !userInfo.isAdmin && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Settings size={24} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Setelan Alamat</h2>
                      </div>
                    </div>
                    {addressSaved && (
                      <div className="flex items-center gap-2 text-green-600 text-xs font-black bg-green-50 px-4 py-2 rounded-full border border-green-100 animate-in zoom-in">
                        <CheckCircle size={16} /> DATA BERHASIL DISIMPAN!
                      </div>
                    )}
                  </div>

                  {addressLoading && !addressSaved ? (
                    <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-blue-500" /></div>
                  ) : (
                    <form onSubmit={saveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="md:col-span-2 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-start gap-4">
                        <div className="mt-1"><Info size={20} className="text-blue-500" /></div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
                          Alamat ini akan digunakan secara otomatis saat Anda melakukan checkout di masa mendatang. 
                          Pastikan informasi yang diberikan akurat untuk menghindari keterlambatan pengiriman.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">No. HP Aktif / WhatsApp</label>
                        <input
                          value={addressForm.phone}
                          onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="08xxxxxxxxxx"
                          type="tel"
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-gray-900 font-bold focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Kota atau Kabupaten</label>
                        <input
                          value={addressForm.city}
                          onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="Jakarta Selatan, Bandung, dll."
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-gray-900 font-bold focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Lengkap (Jl, No. Rumah, RT/RW)</label>
                        <textarea
                          value={addressForm.street}
                          onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                          placeholder="Masukkan detail alamat lengkap Anda..."
                          rows={4}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-gray-900 font-bold focus:border-blue-500 focus:bg-white outline-none transition-all resize-none placeholder:text-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Kode Pos</label>
                        <input
                          value={addressForm.postalCode}
                          onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          placeholder="12345"
                          maxLength={6}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-gray-900 font-bold focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Patokan / Catatan (Optional)</label>
                        <input
                          value={addressForm.notes}
                          onChange={e => setAddressForm({ ...addressForm, notes: e.target.value })}
                          placeholder="Pagar hitam, samping masjid, dll."
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-gray-900 font-bold focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={addressLoading}
                        className="md:col-span-2 mt-4 bg-blue-600 text-white font-black py-5 rounded-2xl text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 disabled:opacity-50"
                      >
                        {addressLoading ? <><Loader2 size={20} className="animate-spin" /> Menyetel...</> : <><Save size={20} /> Simpan Perubahan Alamat</>}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* ADMIN VIEW: KELOLA PENGGUNA */}
            {activeTab === 'users' && userInfo.isAdmin && (
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 animate-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Manajemen Pengguna</h2>
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user._id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-indigo-200 transition-all gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-bold border border-gray-100 shadow-sm">{user.name.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {user.isAdmin ? <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">Admin</span> : <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">User</span>}
                        <button onClick={() => openUserOrders(user._id)} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-indigo-600 border border-gray-100 hover:bg-indigo-50 shadow-sm transition-all">Riwayat</button>
                        {user._id !== userInfo._id && (
                          <button onClick={() => deleteUser(user._id)} className="p-2.5 text-red-400 hover:bg-red-50 hover:text-red-500 transition-all rounded-xl"><Trash2 size={18} /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN VIEW: KELOLA STOK */}
            {activeTab === 'manage-products' && userInfo.isAdmin && (
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 animate-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Katalog Stok</h2>
                  <button onClick={() => setActiveTab('add-product')} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <PlusCircle size={16} /> Tambah Baru
                  </button>
                </div>
                <div className="grid gap-4">
                  {products.map(p => (
                    <div key={p._id} className="p-4 md:p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-indigo-100">
                      <div className="w-20 h-20 bg-white rounded-2xl p-2 flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                        <img src={p.image} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <h4 className="font-bold text-gray-900 truncate uppercase tracking-tight">{p.name}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{p.brand} · Rp {p.price.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>STOK: {p.stock}</span>
                        <button onClick={() => startEditProduct(p)} className="p-2.5 bg-white text-indigo-600 rounded-xl border border-gray-100 hover:bg-indigo-50 shadow-sm"><Pencil size={18} /></button>
                        <button onClick={() => deleteProduct(p._id)} className="p-2.5 bg-white text-red-400 rounded-xl border border-gray-100 hover:bg-red-50 shadow-sm"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN VIEW: TAMBAH PRODUK */}
            {activeTab === 'add-product' && userInfo.isAdmin && (
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 animate-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{editingProductId ? '✏️ Update Produk' : '➕ Produk Baru'}</h2>
                  {editingProductId && <button onClick={() => { setProductForm(emptyForm); setEditingProductId(null); }} className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">Batal</button>}
                </div>

                {productSuccess && (
                  <div className="mb-8 p-5 bg-green-50 border border-green-100 rounded-3xl flex items-center gap-4 animate-in zoom-in duration-300">
                    <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-green-100">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-green-800 uppercase tracking-tight">Berhasil!</p>
                      <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Produk telah {editingProductId ? 'diperbarui' : 'ditambahkan ke katalog'}.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={submitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Produk Komplit</label>
                    <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold focus:border-indigo-500 focus:bg-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Harga Retail (Rp)</label>
                    <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold focus:border-indigo-500 focus:bg-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Merek Perangkat</label>
                    <input required value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold focus:border-indigo-500 focus:bg-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Stok Tersedia</label>
                    <input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold focus:border-indigo-500 focus:bg-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">URL Foto Produk</label>
                    <input required value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold focus:border-indigo-500 focus:bg-white outline-none" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
                    <textarea required rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold focus:border-indigo-500 focus:bg-white outline-none resize-none transition-all" />
                  </div>

                  {/* ── SPESIFIKASI TEKNIS ── */}
                  <div className="md:col-span-2 mt-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px bg-gray-100 flex-1"></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">Spesifikasi Detail</span>
                      <div className="h-px bg-gray-100 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { k: 'ram', l: 'RAM', p: '8GB / 12GB' },
                        { k: 'storage', l: 'Internal', p: '128GB / 256GB' },
                        { k: 'processor', l: 'Chipset', p: 'A17 Pro / Gen 3' },
                        { k: 'screen', l: 'Layar', p: '6.7" OLED' },
                        { k: 'battery', l: 'Baterai', p: '5000 mAh' },
                      ].map(s => (
                        <div key={s.k} className="space-y-1.5">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{s.l}</label>
                          <input
                            type="text"
                            placeholder={s.p}
                            value={productForm.specifications[s.k]}
                            onChange={e => setSpec(s.k, e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-bold focus:border-indigo-500 focus:bg-white outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={productLoading} className="md:col-span-2 mt-4 bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100">
                    {productLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {editingProductId ? 'Simpan Perubahan Produk' : 'Terbitkan Produk Sekarang'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── ADMIN MODAL: RIWAYAT PESANAN ── */}
      {isOrderModalOpen && selectedUserOrders && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 border border-indigo-100">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Log Transaksi</h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-4">
              {selectedUserOrders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><ShoppingBag size={40} /></div>
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Belum ada aktivitas belanja</p>
                </div>
              ) : (
                selectedUserOrders.map(order => (
                  <div key={order._id} className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-6 transition-all hover:border-indigo-100">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                      <span className="font-mono font-black text-indigo-600">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-widest">Paid</span>
                    </div>
                    <div className="space-y-3">
                      {order.orderItems?.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-bold text-gray-700">{it.name} <span className="text-gray-400">×{it.qty || it.quantity}</span></span>
                          <span className="font-black text-gray-900">Rp {it.price.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-indigo-100/50 flex justify-between items-center">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Transaksi</span>
                      <span className="text-xl font-black text-indigo-600">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountPage;
