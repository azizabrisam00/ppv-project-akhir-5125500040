// src/storage.js — penyimpanan aman TASK DO (tidak pernah melempar galat)
export const KUNCI = 'taskdo.tasks.v1';

let cadanganMemori = [];
let pesanStatus = '';

export function ambilPesan() {
  return pesanStatus;
}

// Rapikan satu tugas; kembalikan null bila tidak sah
function bersihkan(t) {
  if (t === null || typeof t !== 'object') return null;
  if (typeof t.id !== 'string' && typeof t.id !== 'number') return null;
  if (String(t.id).startsWith('s')) return null; // data contoh lama dibuang
  if (typeof t.title !== 'string' || t.title.trim() === '') return null;
  return {
    id: String(t.id),
    title: t.title,
    details: typeof t.details === 'string' ? t.details : '',
    due: typeof t.due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.due) ? t.due : '',
    done: t.done === true,
    createdAt: Number.isFinite(t.createdAt) ? t.createdAt : Date.now(),
    completedAt: Number.isFinite(t.completedAt) ? t.completedAt : null
  };
}

export function muat() {
  pesanStatus = '';
  let mentah;
  try {
    mentah = localStorage.getItem(KUNCI);
  } catch (err) {
    pesanStatus = 'Penyimpanan browser tidak tersedia. Tugas hanya bertahan selama halaman terbuka.';
    return [...cadanganMemori];
  }
  if (mentah === null) return [];
  try {
    const data = JSON.parse(mentah);
    if (!Array.isArray(data)) throw new Error('bukan array');
    const bersih = data.map(bersihkan).filter(Boolean);
    if (bersih.length < data.filter((t) => !String(t?.id).startsWith('s')).length) {
      pesanStatus = 'Sebagian data tugas rusak dan sudah dibuang.';
    }
    return bersih;
  } catch (err) {
    console.warn('Data TASK DO rusak:', err.message);
    pesanStatus = 'Data tersimpan rusak. TASK DO dimulai dari daftar kosong.';
    return [];
  }
}

export function simpan(data) {
  cadanganMemori = Array.isArray(data) ? [...data] : [];
  try {
    localStorage.setItem(KUNCI, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn('Gagal menyimpan:', err.name);
    pesanStatus = 'Tugas belum tersimpan permanen (penyimpanan penuh atau diblokir).';
    return false;
  }
}