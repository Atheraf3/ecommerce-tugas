# Smartphone E-Commerce & Company Profile

Aplikasi web e-commerce modern khusus penjualan smartphone yang menggabungkan profil perusahaan dan fungsionalitas toko online. Dibangun menggunakan MERN Stack (MongoDB, Express, React, Node.js) dengan arsitektur Monorepo.

## Tech Stack

### Frontend
- **React.js (Vite):** Library UI untuk membangun interface yang reaktif.
- **Tailwind CSS:** Framework CSS untuk desain modern dan responsif.
- **React Router Dom:** Navigasi antar halaman (Home, Shop, Cart, Checkout, dll).
- **Context API:** Manajemen state untuk Keranjang Belanja (Cart) dan Autentikasi (Auth).

### Backend
- **Node.js & Express.js:** Server-side framework untuk menyediakan API.
- **MongoDB & Mongoose:** Database NoSQL untuk penyimpanan data Produk, User, dan Pesanan.
- **JSON Web Token (JWT):** Sistem autentikasi keamanan pengguna.

### Deployment & Tools
- **Vercel:** Platform deployment (Frontend & Backend terintegrasi).
- **Postman:** Alat pengujian API Endpoints.

## Fitur Utama (Flow Demo)

1. **Company Profile:** Halaman About, Terms, dan Help untuk membangun kepercayaan pelanggan.
2. **Katalog Produk:** Menampilkan daftar smartphone dengan filter kategori dan brand.
3. **Sistem Keranjang (Cart):** Tambah, kurangi, atau hapus item secara real-time.
4. **Autentikasi:** Register dan Login akun untuk melakukan transaksi.
5. **Checkout System:** Pengisian detail alamat, pilihan jasa pengiriman (JNE/J&T), dan metode pembayaran.
6. **Success Page & QR Code:** Setelah pesanan dibuat, sistem akan men-generate **QR Code Dummy** sebagai simulasi proses pembayaran.

##  Struktur Folder

```text
my-ecommerce-app/
├── backend/            # Express API & MongoDB Models
│   ├── config/         # Koneksi Database
│   ├── controllers/    # Logika Bisnis (User, Product, Order)
│   ├── models/         # Schema Mongoose
│   ├── routes/         # API Endpoints
│   └── server.js       # Entry Point Backend
├── frontend/           # React App (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── context/    # State Management (Cart & Auth)
│   │   ├── pages/      # Halaman Utama Aplikasi
│   │   └── main.jsx    # Entry Point Frontend
└── vercel.json         # Konfigurasi Deployment Monorepo
```

##  Cara Menjalankan Secara Lokal

### 1. Clone Repository
```bash
git clone [https://github.com/username/ecommerce-tugas-akhir.git](https://github.com/username/ecommerce-tugas-akhir.git)
cd ecommerce-tugas-akhir
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Buat file `.env` di dalam folder `backend` dan isi:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```
Jalankan server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
Jalankan React app:
```bash
npm run dev
```

**Muhammad Rafli** 
