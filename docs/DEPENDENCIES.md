# DEPENDENCIES

## Pustaka UI

- **Pustaka:** Bootstrap 5.3.3. Versi dikunci di URL CDN; tidak menggunakan `@latest`.
- **CSS:** https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
- **JavaScript:** https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
- **Urutan CSS:** Bootstrap dimuat lebih dahulu, lalu `src/style.css` untuk tema dan penyesuaian aplikasi.
- **Ukuran transfer terukur:** CSS 30.860 byte (sekitar 30,1 KiB) dan JavaScript 23.731 byte (sekitar 23,2 KiB), diukur dari respons CDN dengan kompresi aktif. Nilai di tab Network dapat sedikit berbeda bergantung pada kompresi, cache, dan browser.
- **Alasan memilih:** Bootstrap menyediakan komponen UI umum yang sudah teruji dan responsif, sehingga aplikasi dapat memakai Card, Modal, Toast, dan Button tanpa membuat perilaku dasar semuanya dari nol. CSS kustom tetap mengatur tampilannya agar konsisten dengan identitas Task DO.

## Komponen yang digunakan

- **Card:** wadah grup tugas "Sedang dikerjakan" dan "Selesai" dibuat di `src/main.js`; kartu statistik berada di `index.html`.
- **Modal:** konfirmasi sebelum tugas dihapus, dengan fallback `window.confirm` jika Bootstrap gagal dimuat.
- **Toast:** notifikasi saat tugas ditambahkan, diselesaikan, atau dihapus.
- **Button:** tombol aksi memakai kelas Bootstrap `btn` beserta varian seperti `btn-primary`, `btn-outline-primary`, dan `btn-danger`.

## Pembungkus JavaScript

`src/ui-pustaka.js` adalah satu-satunya berkas aplikasi yang memanggil API JavaScript Bootstrap (`bootstrap.Toast` dan `bootstrap.Modal`). `src/main.js` memakai fungsi `tampilToast()` dan `bukaKonfirmasiHapus()` tanpa mengakses API Bootstrap secara langsung.

## Pertanyaan dan jawaban materi P09

> Deck P09 tidak disertakan di repositori ini. Empat pertanyaan berikut merangkum topik yang diterapkan pada proyek; cocokkan redaksi dan cakupannya dengan pertanyaan pada deck sebelum dikumpulkan.

1. **Apa fungsi pustaka UI?** Pustaka UI menyediakan komponen antarmuka yang dapat digunakan kembali, sehingga pengembangan lebih konsisten dan tidak perlu membuat semua komponen dasar dari awal.
2. **Mengapa versi pustaka perlu dikunci?** Versi yang dikunci menghindari perubahan tak terduga ketika rilis baru tersedia, sehingga tampilan dan perilaku proyek lebih mudah direproduksi.
3. **Komponen Bootstrap apa yang digunakan Task DO dan untuk apa?** Card mengelompokkan daftar tugas dan statistik, Modal meminta konfirmasi penghapusan, Toast menampilkan notifikasi singkat, dan Button memberi gaya konsisten pada aksi.
4. **Mengapa API JavaScript Bootstrap dikumpulkan dalam wrapper?** Satu pintu akses memisahkan kode aplikasi dari pustaka. Jika pustaka atau cara pemanggilannya berubah, penyesuaian dapat dipusatkan di `src/ui-pustaka.js`.