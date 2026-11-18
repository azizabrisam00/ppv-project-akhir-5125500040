// konsep.js — konsep produk TASK DO (Tugas 7 PPV), memperbarui CHARTER.md Sprint 1.
const KONSEP = {
  nama: 'TASK DO',
  tagline: 'Semua tugas dan tenggatnya di satu tempat, supaya tidak baru sadar saat H-1.',
  persona: {
    nama: 'Rani, 20 tahun',
    siapa: 'Mahasiswa semester 3 yang kuliah penuh, aktif di dua organisasi, dan menerima proyek desain lepas.',
    keseharian: 'Jadwal kuliah ia taruh di kalender, sedangkan tugas dicatat acak di chat dan catatan ponsel. Waktu luangnya terbatas dan terbagi antara kuliah, organisasi, dan proyek lepas.',
    masalah: 'Kalender hanya menunjukkan jadwal, bukan tugas mana yang sudah selesai, sehingga ia sering baru sadar ada tugas saat H-1 dan tidak tahu seberapa produktif minggunya.',
  },
  masalah: 'Mahasiswa yang menjalani kuliah, organisasi, dan proyek lepas sekaligus sulit mengingat tugas mana yang belum selesai dan kapan tenggatnya. Tugas dicatat acak di chat dan catatan ponsel, sedangkan kalender hanya menunjukkan jadwal. Akibatnya tugas sering baru dikerjakan menjelang tenggat atau terlambat dikumpulkan.',
  solusi: 'TASK DO adalah web pencatat tugas yang menyimpan setiap tugas beserta deadline-nya di satu tempat. Tugas bisa dicentang selesai, dan halaman statistik menampilkan persentase serta diagram batang 7 hari terakhir. Data tersimpan di peramban dengan penyimpanan berversi yang tahan data rusak.',
  fitur: [
    { nama: 'Catat tugas + deskripsi + deadline', prioritas: 'wajib', alasan: 'Inti masalah: tanpa pencatatan, tidak ada yang bisa diingat. Sudah jadi (commit 1cf08f6, v0.4.0).' },
    { nama: 'Centang selesai dan rekap belum/sudah selesai', prioritas: 'wajib', alasan: 'Menjawab langsung kebutuhan "mana yang belum dan sudah". Sudah jadi (commit 1cf08f6, v0.4.0).' },
    { nama: 'Penyimpanan aman berversi', prioritas: 'wajib', alasan: 'Kriteria sukses: data tetap ada setelah dimuat ulang. Sudah jadi (commit 5414cf3, v0.4.0).' },
    { nama: 'Statistik persentase dan diagram batang 7 hari', prioritas: 'sebaiknya', alasan: 'Memotivasi, tetapi aplikasi tetap berguna tanpanya. Sudah jadi (commit 1cf08f6).' },
    { nama: 'Profil pengguna (data diri dan foto)', prioritas: 'sebaiknya', alasan: 'Hanya personalisasi, tidak memengaruhi alur utama. Sudah jadi (commit 1cf08f6, perbaikan foto 7c3b965).' },
    { nama: 'Sinkron dengan Google Calendar', prioritas: 'belum', alasan: 'Perlu login dan API pihak ketiga; sengaja tidak dibuat sebelum nilai utama teruji.' },
    { nama: 'Ekspor data ke JSON', prioritas: 'belum', alasan: 'Berguna sebagai cadangan, tetapi bukan nilai utama; menunggu waktu cukup.' },
  ],
  pembanding: [
    { nama: 'Todoist', kelebihan: 'Fitur lengkap: label, pengingat, dan kolaborasi.', kekurangan: 'Perlu akun, dan sebagian fitur lanjutan berbayar.' },
    { nama: 'Google Tasks', kelebihan: 'Sederhana dan terhubung dengan Gmail dan Kalender.', kekurangan: 'Tidak ada ringkasan progres 7 hari dan tidak ada profil pengguna.' },
  ],
  pembeda: 'Langsung dipakai tanpa akun, dan menggabungkan pencatatan tugas dengan statistik progres 7 hari di satu aplikasi ringan.',
};
