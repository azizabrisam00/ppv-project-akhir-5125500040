# Task DO

Aplikasi pencatat tugas untuk mahasiswa yang tugas akademik dan non-akademiknya menumpuk.

**Masalah:** mahasiswa sulit mengingat tugas mana yang belum selesai dan kapan tenggatnya, sehingga sering terlambat atau mengerjakan mendadak.

Project Akhir Praktikum Pemrograman Visual (TB033109), PENS — Kaysan Aziz Abrisam, NRP 5125500040, kelas 3 D3 MM B.

## Cara menjalankan
1. Unduh atau clone repositori ini:
   ```
   git clone https://github.com/azizabrisam00/ppv-project-akhir-5125500040.git
   ```
2. Buka `index.html` di Chrome atau Firefox (klik dua kali sudah cukup). Butuh koneksi internet bila pustaka UI dimuat dari CDN.

## Struktur folder
- `index.html` — halaman utama
- `src/` — kode JavaScript aplikasi
- `css/` — stylesheet aplikasi
- `assets/` — ikon dan gambar
- Berkas Markdown di root — dokumen proyek

## Dokumen
- [Project charter](CHARTER.md)
- [Roadmap sprint P10–P14](ROADMAP.md)
- [Dependensi pustaka UI](DEPENDENCIES.md)
- [Peta modul](MODULE_MAP.md)

## Sumber kode dan bantuan AI
- Kode dasar aplikasi: Tugas 4 milik sendiri (commit awal `1cf08f6`).
- Bantuan AI (Claude, Anthropic): membantu menyusun draf `CHARTER.md` dan `ROADMAP.md` berdasarkan penjelasan saya tentang aplikasi, lalu saya periksa dan sesuaikan. Claude juga membantu menjelaskan penyebab masalah P1–P4 pada latihan Bagian A (repositori latihan terpisah).
- Bagian lain akan dicatat di sini setiap kali memakai bantuan AI atau sumber luar, lengkap dengan tautan atau prompt-nya.
- Pemasangan Bootstrap 5.3.3 dibantu Claude (Anthropic): markup Modal, Toast, dan Card, berkas `src/ui-pustaka.js`, blok tema variabel CSS di `css/style.css`, serta perbaikan path aset. Kode aplikasi Task DO (Tugas 4) adalah milik sendiri.