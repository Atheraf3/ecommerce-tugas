const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Buat pesanan baru dari checkout
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, shippingAddress, shippingMethod, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'Tidak ada item pesanan' });
  }

  try {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: `Gagal membuat pesanan: ${error.message}` });
  }
});

// @route   GET /api/orders/myorders
// @desc    Ambil semua pesanan milik user yang sedang login
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// @route   GET /api/orders/track/:shortId
// @desc    Lacak pesanan berdasarkan 8 karakter terakhir _id (milik user sendiri atau admin semua)
// @access  Private
router.get('/track/:shortId', protect, async (req, res) => {
  try {
    const shortId = req.params.shortId.toUpperCase();

    // Admin bisa lihat semua, user biasa hanya miliknya sendiri
    const query = req.user.isAdmin ? {} : { user: req.user._id };
    const orders = await Order.find(query).sort({ createdAt: -1 });

    // Cocokkan 8 karakter terakhir _id
    const found = orders.find(o =>
      o._id.toString().slice(-8).toUpperCase() === shortId
    );

    if (!found) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan. Pastikan nomor pesanan sudah benar.' });
    }

    res.json(found);
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// @route   GET /api/orders/:id
// @desc    Ambil detail pesanan berdasarkan ID MongoDB lengkap
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

module.exports = router;
