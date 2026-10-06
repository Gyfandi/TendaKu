# 🏕️ TendaKu

**TendaKu** adalah aplikasi mobile untuk membantu pengelolaan penyewaan perlengkapan outdoor seperti tenda, carrier, sleeping bag, kompor portable, dan perlengkapan camping lainnya.

Aplikasi ini dirancang untuk membantu pemilik rental dalam mengelola data barang, penyewa, transaksi penyewaan, serta memantau ketersediaan perlengkapan secara lebih mudah dan terorganisir.

---

## 📱 Tentang TendaKu

Melakukan pengelolaan rental perlengkapan outdoor secara manual dapat menyebabkan berbagai masalah, seperti kesulitan mengetahui stok barang, pencatatan transaksi yang tidak terorganisir, hingga kesalahan dalam mencatat tanggal pengembalian.

**TendaKu** hadir sebagai solusi sederhana berbasis mobile untuk membantu proses tersebut.

Dengan TendaKu, pengguna dapat:

- 📦 Mengelola data perlengkapan outdoor
- 👤 Mengelola data penyewa
- 📝 Mencatat transaksi penyewaan
- 📅 Mencatat tanggal peminjaman dan pengembalian
- 📊 Memantau kondisi dan ketersediaan barang
- 💰 Menghitung harga penyewaan
- ⚠️ Mengetahui status barang yang sedang dipinjam atau terlambat dikembalikan

---

## ✨ Fitur Utama

### 📦 Manajemen Barang

Digunakan untuk mengelola seluruh perlengkapan outdoor yang tersedia di rental.

Fitur meliputi:

- Menampilkan daftar barang
- Menambahkan barang
- Mengubah data barang
- Menghapus barang
- Mengelompokkan barang berdasarkan kategori
- Menampilkan harga sewa per hari
- Menampilkan jumlah stok
- Menampilkan status ketersediaan barang
- Pencarian barang
- Filter berdasarkan kategori

Contoh kategori:

- 🏕️ Tenda
- 🎒 Carrier
- 🛏️ Camping
- 🍳 Peralatan Masak
- 🔦 Elektronik Outdoor

---

### 👤 Manajemen Penyewa

Digunakan untuk menyimpan data pelanggan yang melakukan penyewaan.

Data yang dapat dikelola antara lain:

- Nama penyewa
- Nomor telepon
- Alamat
- Data penyewa lainnya

Fitur:

- Menampilkan data penyewa
- Menambahkan penyewa
- Mengubah data penyewa
- Menghapus penyewa
- Mencari data penyewa

---

### 📝 Manajemen Rental

Digunakan untuk mencatat transaksi penyewaan perlengkapan.

Informasi transaksi meliputi:

- Penyewa
- Barang yang disewa
- Tanggal peminjaman
- Tanggal pengembalian
- Lama penyewaan
- Harga sewa
- Total biaya
- Status transaksi

Status transaksi:

- 🟢 Dipinjam
- 🔵 Dikembalikan
- 🔴 Terlambat

---

### 📊 Dashboard

Dashboard digunakan untuk memberikan gambaran singkat mengenai kondisi rental.

Informasi yang dapat ditampilkan:

- Total barang
- Barang tersedia
- Barang sedang disewa
- Total penyewa
- Transaksi aktif
- Transaksi terlambat
- Ringkasan aktivitas rental

---

## 🎯 Tujuan Aplikasi

TendaKu dikembangkan dengan tujuan:

1. Membantu pemilik rental outdoor mengelola data perlengkapan.
2. Mempermudah pencatatan data penyewa.
3. Mempermudah proses pencatatan transaksi rental.
4. Mengurangi kesalahan dalam pencatatan manual.
5. Mempermudah pemantauan ketersediaan barang.
6. Menerapkan konsep CRUD pada aplikasi mobile.
7. Menerapkan pengelolaan data menggunakan database.

---

## 🛠️ Teknologi yang Digunakan

TendaKu dikembangkan menggunakan teknologi berikut:

| Teknologi | Keterangan |
|---|---|
| React Native | Framework untuk membangun aplikasi mobile |
| Expo | Development platform untuk React Native |
| TypeScript | Bahasa pemrograman utama |
| Expo Router | Sistem navigasi aplikasi |
| Git | Version control |
| GitHub | Repository dan kolaborasi |
| Database | Penyimpanan data aplikasi |

---

## 📂 Struktur Project

Struktur project TendaKu secara umum:

```text
TendaKu/
├── assets/
│   └── barang/
│       ├── carrier-60-liter.jpeg
│       ├── headlamp-outdoor.jpeg
│       ├── kompor-portable.jpeg
│       ├── matras-camping.jpeg
│       ├── sleeping-bag.jpeg
│       └── tenda-dome-4-person.jpeg
│
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   │
│   ├── components/
│   │   └── BarangCard.tsx
│   │
│   ├── constants/
│   │   └── styles.ts
│   │
│   ├── data/
│   │   └── barang.ts
│   │
│   └── types/
│       └── barang.ts
│
├── package.json
├── tsconfig.json
└── README.md
