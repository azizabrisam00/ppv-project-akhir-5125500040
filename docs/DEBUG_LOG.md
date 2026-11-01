# Debug Log

## Foto profil hilang setelah refresh

- **Gejala (Symptoms):** Foto profil hilang kembali setelah halaman di-refresh usai mengisi data dan menambah foto profil.
- **Langkah Reproduksi:** Buka halaman profil -> Unggah foto profil dan isi data -> Klik simpan -> Lakukan refresh (F5) pada halaman.
- **Hipotesis & Bukti:** Data profil disimpan di `localStorage` dengan foto dalam bentuk data URL/Base64. Namun, fungsi `safeSet` sebelumnya menelan error penulisan secara diam-diam, sementara `saveProfile` tetap menampilkan profil seolah penyimpanan berhasil. Jika browser menolak penulisan (misalnya ruang penyimpanan penuh), data tidak persisten dan state kembali kosong/default setelah reload.
- **Perbaikan (Berkas:Baris):** `src/main.js:48` membuat `safeSet` mengembalikan status berhasil/gagal. `src/main.js:489` memastikan `saveProfile` hanya memperbarui tampilan setelah data profil berhasil ditulis; jika gagal, form tetap terbuka dan pesan error ditampilkan.
- **Uji Ulang:** Unggah foto, simpan profil, lalu refresh halaman. Berhasil: data profil tetap tampil, nilai foto tetap tersimpan sebagai data URL di `localStorage`, dan gambar berhasil dimuat setelah reload.
