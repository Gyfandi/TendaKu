# TendaKu Authentication & Role Update

## Akun Admin demo
- Username: admin
- Password: tendaku123

## User
- User membuat akun sendiri melalui halaman Register.
- Setelah registrasi berhasil, User otomatis login.
- Data akun dan sesi disimpan secara lokal menggunakan AsyncStorage.

## Hak akses
- Guest: melihat katalog/detail; harus login untuk menyewa.
- User: melihat katalog, profil, dan melakukan penyewaan.
- Admin: dashboard, data penyewa, dan pengelolaan barang; tidak dapat menyewa.

## Catatan
Autentikasi ini untuk demo/proyek pembelajaran. Data akun disimpan lokal di perangkat dan password belum di-hash. Untuk aplikasi produksi, gunakan backend/authentication service dan penyimpanan password yang aman.
