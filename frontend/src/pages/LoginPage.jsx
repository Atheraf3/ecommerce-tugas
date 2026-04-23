import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal.');
    }
  };

  return (
    <div className="animate-in fade-in pt-12 mb-24 min-h-[60vh] flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <LogIn size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Selamat Datang Kembali</h2>
        <p className="text-center text-gray-500 mb-8">Masuk untuk melanjutkan ke GPhone</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="email" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" 
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" 
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
            Masuk
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar sekarang</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
