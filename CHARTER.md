Project Charter — Task DO
Masalah yang diselesaikan

Mahasiswa yang menjalani tugas akademik dan kegiatan non-akademik sekaligus sulit mengingat tugas mana yang belum selesai dan kapan tenggatnya. Akibatnya tugas sering baru dikerjakan mendadak menjelang batas waktu atau terlambat dikumpulkan.

Pengguna sasaran dan persona

Rani, 20 tahun, mahasiswa semester 3. Ia kuliah penuh, aktif di dua organisasi, dan menerima proyek desain lepas. Jadwal kuliah ia taruh di kalender, tugas ia catat acak di chat dan catatan ponsel. Kalender hanya menunjukkan jadwal, tidak menunjukkan mana tugas yang sudah selesai, sehingga ia sering baru sadar ada tugas saat H-1 dan tidak tahu seberapa produktif minggunya.

Fitur MVP dengan prioritas MoSCoW
No	Fitur	MoSCoW	Alasan prioritas
1	Catat tugas beserta deadline	Must	Inti masalah: tanpa pencatatan, tidak ada yang bisa diingat.
2	Rekap tugas belum selesai / sudah selesai (centang)	Must	Menjawab langsung kebutuhan "mana yang belum dan sudah".
3	Statistik batang pengerjaan tugas 7 hari terakhir	Should	Memotivasi, tetapi aplikasi tetap berguna tanpanya.
4	Lengkapi data diri (profil)	Could	Hanya personalisasi, tidak memengaruhi alur utama.
5	Sinkron dengan Google Calendar	Won't	Perlu login dan API pihak ketiga; sengaja tidak dibuat sebelum nilai utama teruji.
Kriteria sukses (terukur)
Pengguna baru mencatat satu tugas beserta deadline ≤ 30 detik tanpa bantuan.
Daftar tugas belum selesai dan sudah selesai dapat dilihat dalam ≤ 2 klik dari halaman utama.
Data tetap ada setelah halaman dimuat ulang pada 10 dari 10 percobaan.
Grafik 7 hari terakhir cocok dengan jumlah tugas selesai yang dicatat pada 5 dari 5 uji manual.
Risiko dan antisipasi
Risiko	Antisipasi
Data hilang saat cache dibersihkan atau ganti peramban	Penyimpanan aman dan berversi di Sprint P12; ekspor JSON bila waktu cukup.
Perhitungan tanggal/deadline dan statistik 7 hari keliru (zona waktu, pergantian hari)	Uji manual dengan tanggal batas dan perbaiki di Sprint P10 (debug).
Cakupan melebar (misalnya sinkron kalender) sehingga MVP tidak selesai	Won't dikunci di charter; fitur Could dikerjakan hanya bila Must dan Should selesai (Sprint P12).
Tampilan pustaka UI rusak di ponsel	Uji di ± 400 px setiap sprint; gaya sendiri dimuat sesudah pustaka (Sprint P09–P11).
Perubahan arah dari Tugas 4

Tidak ada perubahan arah. 