import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

// Kunci localStorage per-user agar keranjang tidak bercampur
const getCartKey = (userInfo) => {
  return userInfo ? `cartItems_${userInfo._id}` : 'cartItems_guest';
};

export const CartProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  const cartKey = getCartKey(userInfo);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saat user berganti (login/logout), load keranjang yang sesuai
  useEffect(() => {
    try {
      const saved = localStorage.getItem(cartKey);
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch {
      setCartItems([]);
    }
  }, [cartKey]);

  // Simpan setiap kali cartItems berubah
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) {
      // Hapus jika kuantitas < 1
      setCartItems(prev => prev.filter(item => item._id !== id));
      return;
    }
    setCartItems(prev =>
      prev.map(item => item._id === id ? { ...item, quantity: qty } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem(cartKey, JSON.stringify([]));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
