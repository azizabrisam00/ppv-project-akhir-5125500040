TASK DO - Web Pencatat Tugas (Prototipe Tugas 4)
Cara pakai: ekstrak ZIP, lalu buka index.html di browser (tanpa server/instalasi). Tekan "Catat Sekarang" untuk langsung membuka daftar tugas; tidak perlu login.

Struktur:
index.html          -> struktur halaman (Welcome, Tugas, Statistik, Profil)
style.css           -> tampilan, palet warna, responsif, prefers-reduced-motion
main.js             -> logika tugas, animasi, efek suara, statistik
assets/images/      -> logo Task Do
assets/icons/       -> ikon tab, checklist, deadline, panah, dan tempat sampah

Profil dapat dilengkapi pengguna dari tab Profil (nama lengkap, umur, status/pekerjaan, dan instansi); datanya disimpan di localStorage browser.
Efek suara tidak memakai file audio; bunyi dibuat dengan Web Audio API di main.js
(fungsi playTones dan objek sfx).

Palet: ungu #7E6D9A, oranye #FFB763, putih #FFFFFF

SUMBER KODE DAN ASET
- Font "Google Sans Flex" dimuat dari Google Fonts (https://fonts.google.com). Butuh internet; tanpa internet, aplikasi tetap berjalan dengan font cadangan sistem.
- Logo dan ikon: dibuat sendiri.
- Efek suara: dibuat dengan Web Audio API (tanpa file audio).
- Kode yang disalin dari sumber lain: [tulis "Tidak ada." atau daftar beserta tautannya]

PENANGANAN MEDIA GAGAL DIMUAT
Jika gambar atau ikon gagal dimuat, logo diganti teks "Task*Do", ikon hapus diganti teks "Hapus", dan ikon lain disembunyikan (fungsi handleMediaError di main.js).
