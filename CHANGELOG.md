# Changelog

## [0.4.0] - 2026-11-15
### Added
- Modul src/storage.js dengan KUNCI berversi "taskdo.tasks.v1"; muat() dan simpan() tidak pernah melempar galat dan menyaring tugas rusak.
- Banner pemberitahuan di halaman Tugas saat data rusak atau penyimpanan penuh/diblokir.
### Changed
- src/main.js memakai muat() dan simpan() dari storage.js menggantikan loadTasks/saveTasks lama.
### Fixed
- TASK DO tidak lagi diam-diam menimpa data saat penyimpanan gagal; pengguna kini diberi tahu.

## [0.3.0] - 2026-11-08
### Changed
- Kode dipecah menjadi modul ES; komponen buatKartuTugas dan buatPesanKosong di src/komponen.js.

## [0.2.0] - 2026-11-01
### Added
- Pustaka UI Bootstrap: modal konfirmasi hapus dan toast.
### Fixed
- Perbaikan style.css dan tampilan hasil diagnosis Tugas P09.

## [0.1.0] - 2026-10-25
### Added
- Basis kode Tugas 4 dan charter proyek.