const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Ambil semua produk
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil produk.' });
  }
});

// @desc    Buat produk baru (Admin Input)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, brand, category, stock, specifications } = req.body;
    
    const product = new Product({
      name, price, description, image, brand, category, stock, specifications
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk baru' });
  }
});

// @desc    Ambil satu produk berdasarkan ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});


// @desc    Update produk (Admin Edit)
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, brand, category, stock, specifications } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.image = image ?? product.image;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;
    if (specifications) product.specifications = specifications;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate produk' });
  }
});

// @desc    Hapus produk
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk' });
  }
});

module.exports = router;
