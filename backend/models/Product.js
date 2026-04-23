const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true }, 
  price: { type: Number, required: true },
  description: { type: String },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, default: 'Smartphone' },
  image: { type: String, required: true }, 
  specifications: {
    ram: { type: String },
    storage: { type: String },
    processor: { type: String },
    screen: { type: String },
    battery: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
