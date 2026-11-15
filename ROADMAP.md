# Roadmap Sprint — Task DO

Fitur MVP mengacu pada charter: F1 Catat tugas + deadline, F2 Rekap belum/selesai, F3 Statistik 7 hari, F4 Data diri. Roadmap diperbarui setiap minggu.

## P09
- Deliverable: charter, repositori proyek, pustaka UI terpasang (≥ 3 komponen), berkas pembungkus, DEPENDENCIES.md
- Fitur MVP: tampilan F1 dan F2 memakai komponen pustaka
- Bukti: commit docs: charter/roadmap, DEPENDENCIES.md, screenshot 400 px dan laptop

## P10
- Deliverable: debug ≥ 2 bug nyata + cabang/merge
- Fitur MVP: F1, F2 (bug tanggal/deadline dan status centang)
- Status Sprint 2: Selesai
- Alasan: dua bug nyata diperbaiki (foto profil tidak persisten dan teks meluber); cabang perbaikan telah digabung dan dipush ke main.
- Bukti: perbaikan persistensi foto profil, wrapping teks tugas/modal, serta merge cabang perbaikan

## P11
- Deliverable: kode dipecah menjadi ≥ 3 modul ES
- Fitur MVP: F1, F2, F3
- Status Sprint 3: Selesai (dilengkapi pada Sprint 4)
- Alasan: kode dipecah menjadi modul ES (src/main.js, src/komponen.js, src/storage.js) dengan src/ui-pustaka.js sebagai skrip pendukung.
- Bukti: src/main.js mengimpor src/komponen.js dan src/storage.js

## P12
- Deliverable: komponen reusable + penyimpanan aman + README/CHANGELOG + tag v0.x
- Fitur MVP: F1, F2, F3, F4 (bila waktu cukup)
- Status Sprint 4: Selesai (15/11/2026)
- Alasan: komponen buatKartuTugas dipakai untuk semua item di daftar aktif dan selesai; penyimpanan aman memakai KUNCI berversi taskdo.tasks.v1 dan tahan data rusak maupun penyimpanan diblokir.
- Bukti: src/komponen.js, src/storage.js, uji manual data rusak (S2) dan penyimpanan gagal (S6), README.md, CHANGELOG.md, tag v0.4.0

## P13
- Deliverable: konsep produk (Tugas 7)
- Fitur MVP: —
- Bukti: dokumen konsep produk

## P14
- Deliverable: Demo Akhir
- Fitur MVP: —
- Bukti: demo + tautan