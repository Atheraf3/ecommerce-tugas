const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const { protect, admin } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// @route   POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Data pengguna tidak valid' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// @route   GET /api/users/profile
// @desc    Ambil profil user yang sedang login (termasuk alamat tersimpan)
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update profil user (nama, alamat pengiriman)
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });

    // Update name jika ada
    if (req.body.name) user.name = req.body.name;

    // Update address
    if (req.body.address) {
      user.address = {
        phone: req.body.address.phone ?? user.address?.phone ?? '',
        street: req.body.address.street ?? user.address?.street ?? '',
        city: req.body.address.city ?? user.address?.city ?? '',
        postalCode: req.body.address.postalCode ?? user.address?.postalCode ?? '',
        notes: req.body.address.notes ?? user.address?.notes ?? '',
      };
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      isAdmin: updated.isAdmin,
      address: updated.address,
    });
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// @route   GET /api/users
// @desc    (ADMIN) Get All Users
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// @route   GET /api/users/:id/orders
// @desc    (ADMIN) Get user orders for detailed popup
router.get('/:id/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).populate('orderItems.product', 'name price image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan mengambil data pesanan pengguna' });
  }
});

// @route   DELETE /api/users/:id
// @desc    (ADMIN) Hapus pengguna
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

module.exports = router;
