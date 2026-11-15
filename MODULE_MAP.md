# Peta Modul Task DO

- `index.html` — struktur halaman dan pemuatan stylesheet, Bootstrap, serta skrip aplikasi.
- `css/style.css` — tema, tata letak, dan gaya responsif; aset gambar dirujuk relatif dari folder ini melalui `../assets/`.
- `src/main.js` — alur utama aplikasi: tugas, statistik, profil, dan penyimpanan browser.
- `src/komponen.js` — pembentuk kartu tugas dan pesan kosong dengan DOM API.
- `src/ui-pustaka.js` — pembungkus komponen Bootstrap Toast dan Modal yang dipakai oleh `src/main.js`.
- `assets/icons/` dan `assets/images/` — ikon dan logo; path dari HTML serta JavaScript dihitung relatif terhadap root proyek.

`src/state.js` saat ini kosong dan belum dimuat oleh `index.html`, sehingga belum menjadi bagian dari alur aplikasi aktif.
