// src/ui-pustaka.js — SATU-SATUNYA berkas yang memanggil API JavaScript Bootstrap 5.3.3.
// Bila pustaka diganti suatu hari nanti, cukup berkas ini yang diubah; main.js tidak perlu disentuh.

// Toast: kabar singkat setelah tindakan berhasil (tambah, selesai, hapus).
function tampilToast(pesan) {
  const el = document.querySelector('#toastInfo');
  if (!el || typeof bootstrap === 'undefined') return; // pustaka gagal dimuat: aplikasi tetap jalan
  el.querySelector('.toast-body').textContent = pesan;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 2500 }).show();
}

// Modal: konfirmasi sebelum menghapus. onYa dijalankan hanya bila pengguna menekan "Ya, hapus".
function bukaKonfirmasiHapus(judul, onYa) {
  const el = document.querySelector('#modalHapus');
  if (!el || typeof bootstrap === 'undefined') {
    if (window.confirm('Hapus "' + judul + '"?')) onYa();
    return;
  }
  const modal = bootstrap.Modal.getOrCreateInstance(el);
  const pemicu = document.activeElement; // tombol hapus yang membuka modal
  el.querySelector('[data-judul]').textContent = judul;
  el.querySelector('[data-aksi-ya]').onclick = () => {
    modal.hide();
    onYa();
  };
  // Modal yang dibuka lewat JavaScript tidak mengembalikan fokus sendiri; kembalikan ke tombol pemicu.
  el.addEventListener('hidden.bs.modal', () => {
    if (pemicu && pemicu.isConnected) pemicu.focus();
  }, { once: true });
  modal.show();
}