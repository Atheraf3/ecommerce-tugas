import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, Smartphone, Store, Info, UserRound, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/', icon: <Store size={18} /> },
    { name: 'Belanja', path: '/shop', icon: <Smartphone size={18} /> },
    { name: 'Tentang', path: '/about', icon: <Info size={18} /> },
    { 
      name: userInfo ? (userInfo.isAdmin ? 'Admin Panel' : 'Akun Saya') : 'Masuk', 
      path: userInfo ? '/account' : '/login', 
      icon: userInfo ? <UserRound size={18} /> : <LogIn size={18} /> 
    },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-white py-5 shadow-xs'}`}>
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-md">
            <Smartphone size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-900 tracking-tight">
            GPhone
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === link.path ? 'text-blue-600' : 'text-gray-600'}`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Cart & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {/* Ikon keranjang hanya untuk non-admin */}
          {!userInfo?.isAdmin && (
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingBag size={24} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}
          
          <button 
            className="md:hidden p-2 text-gray-700" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 w-full">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-xl ${location.pathname === link.path ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
