import { buatKartuTugas, buatPesanKosong } from './komponen.js';
import { muat, simpan, ambilPesan } from './storage.js';

(() => {
  'use strict';

  const PROFILE_KEY = 'taskdo.profile.v1';
  const NS = 'http://www.w3.org/2000/svg';
  const CROP_RATIO = 16 / 9;
  const CROP_CANVAS_WIDTH = 720;
  const CROP_CANVAS_HEIGHT = 405;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function animate(el, keyframes, options) {
    if (!el || !el.animate || reduceMotion.matches) return null;
    return el.animate(keyframes, options);
  }

  // Penanganan media yang gagal dimuat: beri pengganti agar tampilan tidak rusak
  function handleMediaError(img) {
    if (!img || img.dataset.failed) return;
    img.dataset.failed = '1';
    if (img.classList.contains('welcome-logo') || img.classList.contains('topbar-logo')) {
      const fb = document.createElement('span');
      fb.className = 'logo-fallback';
      fb.textContent = 'Task*Do';
      fb.setAttribute('role', 'img');
      fb.setAttribute('aria-label', img.alt || 'Task Do');
      img.replaceWith(fb);
    } else if (img.closest('.del-btn')) {
      img.replaceWith(document.createTextNode('Hapus'));
    } else {
      img.hidden = true;
    }
  }
  document.addEventListener('error', (e) => {
    if (e.target instanceof HTMLImageElement) handleMediaError(e.target);
  }, true);

  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  let tasks = [];
  let soundOn = true;
  let lastAddedId = null;
  let profile = null;
  let profilePhotoDraft = '';
  let profilePhotoProcessing = false;
  let cropImage = null;
  let cropBaseWidth = 0;
  let cropBaseHeight = 0;
  let cropX = 0;
  let cropY = 0;
  let cropDragStart = null;

  function loadProfile() {
    const raw = safeGet(PROFILE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed && parsed.name && parsed.age && parsed.status && parsed.institution ? parsed : null;
    } catch (e) { return null; }
  }

    function tampilInfoPenyimpanan(pesan) {
    const el = $('#infoPenyimpanan');
    el.textContent = pesan || '';
    el.hidden = !pesan;
  }

  function loadTasks() { return muat(); }
  function saveTasks() {
    if (!simpan(tasks)) tampilInfoPenyimpanan(ambilPesan());
  }

  let audioCtx = null;
  function playTones(freqs, step = 0.12, type = 'sine', volume = 0.08) {
    if (!soundOn) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const start = audioCtx.currentTime;
      freqs.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t0 = start + i * step;
        osc.type = type;
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + step);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t0);
        osc.stop(t0 + step + 0.03);
      });
    } catch (e) {}
  }
  const sfx = {
    add: () => playTones([523, 659]),
    check: () => playTones([659, 880, 1047]),
    uncheck: () => playTones([440]),
    error: () => playTones([196, 165], 0.13, 'square', 0.04),
    remove: () => playTones([330, 247])
  };

  function showPage(name, push = true) {
    const pages = { tasks: $('#page-tasks'), stats: $('#page-stats'), profile: $('#page-profile') };
    if (!pages[name]) name = 'tasks';
    $('#app').dataset.page = name;
    Object.entries(pages).forEach(([key, el]) => { el.hidden = key !== name; });
    $$('.nav-btn').forEach((btn) => {
      const active = btn.dataset.page === name;
      btn.classList.toggle('is-active', active);
      if (active) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    $('#content').scrollTop = 0;
    animate(pages[name], [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 300, easing: 'ease-out' });
    if (name === 'stats') renderStats();
    if (push) { try { history.replaceState(null, '', '#' + name); } catch (e) {} }
  }

  function renderList() {
    const list = $('#taskList');
    list.textContent = '';
    const sorted = tasks.slice().sort((a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt);
    const activeTasks = sorted.filter((task) => !task.done);
    const completedTasks = sorted.filter((task) => task.done);

    const appendGroup = (label, groupTasks, emptyMessage, groupName) => {
      const group = document.createElement('li');
      group.className = 'task-group' + (groupName === 'completed' ? ' is-completed-group' : '');
      const panel = document.createElement('section');
      panel.className = 'card task-group-panel';
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      panel.setAttribute('aria-label', `${label}, ${groupTasks.length} tugas`);
      const heading = document.createElement('div');
      heading.className = 'task-group-label';
      const title = document.createElement('h2');
      title.textContent = label;
      const count = document.createElement('span');
      count.textContent = groupTasks.length;
      heading.append(title, count);
      const items = document.createElement('ul');
      items.className = 'task-group-items';

      if (groupTasks.length === 0) {
        items.appendChild(buatPesanKosong(emptyMessage));
      } else {
        groupTasks.forEach((task) => {
          const card = buatKartuTugas(task, {
            onToggle: (tugas, checked, kartu) => toggleTask(tugas.id, checked, kartu),
            onHapus: (tugas, kartu) => bukaKonfirmasiHapus(
              tugas.title,
              () => removeTask(tugas.id, kartu)
            )
          });
          items.appendChild(card);
          if (task.id === lastAddedId) animate(card, [
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], { duration: 250, easing: 'ease-out' });
        });
      }

      cardBody.append(heading, items);
      panel.appendChild(cardBody);
      group.appendChild(panel);
      list.appendChild(group);
    };

    appendGroup('Sedang dikerjakan', activeTasks, 'Belum ada To Do List yang sedang dikerjakan.', 'active');
    appendGroup('Selesai', completedTasks, 'Belum ada To Do List yang selesai.', 'completed');
    lastAddedId = null;
    $('#emptyState').hidden = sorted.length > 0;
  }

  function toggleTask(id, checked, card) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.done = checked;
    task.completedAt = checked ? Date.now() : null;
    saveTasks();
    if (checked) {
      sfx.check();
      tampilToast('To Do List selesai. Kerja bagus!');
    } else {
      sfx.uncheck();
    }
    renderList();
  }

  function removeTask(id, card) {
    const finish = () => {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      renderList();
      tampilToast('To Do List dihapus');
    };
    sfx.remove();
    const anim = animate(card, [
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: 0, transform: 'translateX(40px)' }
    ], { duration: 250, easing: 'ease-in', fill: 'forwards' });
    if (anim) anim.onfinish = finish; else finish();
  }

  function showError(message) {
    const input = $('#taskTitle');
    const err = $('#titleError');
    err.textContent = message;
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    sfx.error();
    animate($('#taskForm'), [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-7px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(3px)' },
      { transform: 'translateX(0)' }
    ], { duration: 400, easing: 'ease-in-out' });
    input.focus();
  }

  function clearError() {
    const input = $('#taskTitle');
    $('#titleError').textContent = '';
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }

  function limitWords(value, maxWords) {
    const words = value.trim().split(/\s+/);
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') : value;
  }

  function setTaskDue(daysFromToday) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    $('#taskDue').value = dayKey(date);
    renderDateShortcuts();
  }

  function renderDateShortcuts() {
    const due = $('#taskDue').value;
    const today = dayKey(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $('#todayBtn').setAttribute('aria-pressed', String(due === today));
    $('#tomorrowBtn').setAttribute('aria-pressed', String(due === dayKey(tomorrow)));
  }

  function renderProfile() {
    const hasProfile = Boolean(profile);
    $('#profileEmpty').hidden = hasProfile;
    $('#profileForm').hidden = true;
    $('#profileView').hidden = !hasProfile;
    if (!hasProfile) return;
    $('#profileViewName').textContent = profile.name;
    $('#profileViewAge').textContent = `${profile.age} tahun`;
    $('#profileViewStatus').textContent = profile.status;
    $('#profileViewMajor').textContent = profile.major || 'Belum diisi';
    $('#profileViewInstitution').textContent = profile.institution;
    $('#profileViewPhoto').hidden = !profile.photo;
    if (profile.photo) $('#profileViewPhoto').src = profile.photo;
  }

  function editProfile() {
    $('#profileEmpty').hidden = true;
    $('#profileView').hidden = true;
    $('#profileForm').hidden = false;
    $('#profileName').value = profile?.name || '';
    $('#profileAge').value = profile?.age || '';
    $('#profileStatus').value = profile?.status || '';
    $('#profileMajor').value = profile?.major || '';
    $('#profileInstitution').value = profile?.institution || '';
    profilePhotoDraft = profile?.photo || '';
    $('#profilePhoto').value = '';
    $('#profilePhotoPreview').hidden = !profilePhotoDraft;
    if (profilePhotoDraft) $('#profilePhotoPreview').src = profilePhotoDraft;
    $('#profileError').textContent = '';
    $('#profileName').focus();
  }

  function loadProfilePhoto(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('File foto tidak dapat dibuka.'));
      };
      image.src = objectUrl;
    });
  }

  function currentCropSize() {
    const zoom = Number($('#photoCropZoom').value);
    const width = cropBaseWidth / zoom;
    return { width, height: width / CROP_RATIO };
  }

  function drawPhotoCrop() {
    if (!cropImage) return;
    const canvas = $('#photoCropCanvas');
    const context = canvas.getContext('2d');
    const crop = currentCropSize();
    cropX = Math.max(0, Math.min(cropX, cropImage.width - crop.width));
    cropY = Math.max(0, Math.min(cropY, cropImage.height - crop.height));
    context.clearRect(0, 0, CROP_CANVAS_WIDTH, CROP_CANVAS_HEIGHT);
    context.drawImage(
      cropImage,
      cropX, cropY, crop.width, crop.height,
      0, 0, CROP_CANVAS_WIDTH, CROP_CANVAS_HEIGHT
    );
  }

  function initializePhotoCrop(image) {
    cropImage = image;
    if (image.width / image.height >= CROP_RATIO) {
      cropBaseHeight = image.height;
      cropBaseWidth = cropBaseHeight * CROP_RATIO;
    } else {
      cropBaseWidth = image.width;
      cropBaseHeight = cropBaseWidth / CROP_RATIO;
    }
    cropX = (image.width - cropBaseWidth) / 2;
    cropY = (image.height - cropBaseHeight) / 2;
    $('#photoCropZoom').value = '1';
    drawPhotoCrop();
    $('#photoCropDialog').showModal();
  }

  function changePhotoCropZoom() {
    const oldCrop = currentCropSize();
    const centerX = cropX + oldCrop.width / 2;
    const centerY = cropY + oldCrop.height / 2;
    const newCrop = currentCropSize();
    cropX = centerX - newCrop.width / 2;
    cropY = centerY - newCrop.height / 2;
    drawPhotoCrop();
  }

  function startPhotoCropDrag(e) {
    if (!cropImage || e.button !== 0) return;
    const crop = currentCropSize();
    const rect = e.currentTarget.getBoundingClientRect();
    cropDragStart = { pointerX: e.clientX, pointerY: e.clientY, x: cropX, y: cropY, crop, rect };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function movePhotoCrop(e) {
    if (!cropDragStart) return;
    const drag = cropDragStart;
    cropX = drag.x - (e.clientX - drag.pointerX) * drag.crop.width / drag.rect.width;
    cropY = drag.y - (e.clientY - drag.pointerY) * drag.crop.height / drag.rect.height;
    drawPhotoCrop();
  }

  function endPhotoCropDrag() { cropDragStart = null; }

  function applyPhotoCrop() {
    if (!cropImage) return;
    const crop = currentCropSize();
    const scale = Math.min(1, 1200 / Math.max(crop.width, crop.height));
    const output = document.createElement('canvas');
    output.width = Math.round(crop.width * scale);
    output.height = Math.round(crop.height * scale);
    const context = output.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, output.width, output.height);
    context.drawImage(cropImage, cropX, cropY, crop.width, crop.height, 0, 0, output.width, output.height);
    profilePhotoDraft = output.toDataURL('image/jpeg', 0.82);
    $('#profilePhotoPreview').src = profilePhotoDraft;
    $('#profilePhotoPreview').hidden = false;
    $('#profileError').textContent = '';
    $('#photoCropDialog').close();
  }

  function cancelPhotoCrop() {
    cropImage = null;
    cropDragStart = null;
    $('#profilePhoto').value = '';
    $('#photoCropDialog').close();
  }

  async function onProfilePhotoChange() {
    const file = $('#profilePhoto').files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      $('#profileError').textContent = 'Pilih file gambar untuk foto profil.';
      $('#profilePhoto').value = '';
      return;
    }
    profilePhotoProcessing = true;
    $('#profileError').textContent = 'Membuka foto...';
    try {
      const image = await loadProfilePhoto(file);
      initializePhotoCrop(image);
    } catch (error) {
      $('#profileError').textContent = error.message;
    } finally {
      profilePhotoProcessing = false;
    }
  }

  function saveProfile(e) {
    e.preventDefault();
    const form = $('#profileForm');
    if (profilePhotoProcessing) return;
    if (!form.reportValidity()) return;
    const profileValues = {
      name: $('#profileName').value.trim(),
      age: Number($('#profileAge').value),
      status: $('#profileStatus').value.trim(),
      major: $('#profileMajor').value.trim(),
      institution: $('#profileInstitution').value.trim(),
      photo: profilePhotoDraft
    };
    if (!profileValues.name || !profileValues.status || !profileValues.major || !profileValues.institution) {
      $('#profileError').textContent = 'Lengkapi semua data profil.';
      return;
    }
    if (!safeSet(PROFILE_KEY, JSON.stringify(profileValues))) {
      $('#profileError').textContent = 'Profil tidak dapat disimpan. Ruang penyimpanan browser mungkin penuh.';
      return;
    }
    $('#profileError').textContent = '';
    profile = profileValues;
    renderProfile();
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = $('#taskTitle');
    input.value = limitWords(input.value, 10);
    $('#taskDetails').value = limitWords($('#taskDetails').value, 100);
    const title = input.value.trim();
    if (title.length === 0) return showError('Nama tugas tidak boleh kosong.');
    if (title.length < 3) return showError('Tulis nama tugas minimal 3 karakter.');
    clearError();

    const task = {
      id: 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      title,
        details: $('#taskDetails').value.trim(),
      due: $('#taskDue').value,
      done: false,
      createdAt: Date.now(),
      completedAt: null
    };
    tasks.push(task);
    saveTasks();
    lastAddedId = task.id;
      $('#taskForm').reset();
      renderDateShortcuts();
    sfx.add();
    tampilToast('To Do List ditambahkan');
    renderList();
    input.focus();
  }

  function svgEl(name, attrs = {}) {
    const el = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function renderStats() {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    $('#statTotal').textContent = total;
    $('#statDone').textContent = done;
    $('#statActive').textContent = total - done;
    $('#donutText').textContent = pct + '%';

    const arc = $('#donutArc');
    const C = 2 * Math.PI * 46;
    arc.setAttribute('stroke-dasharray', C.toFixed(2));
    const target = C * (1 - pct / 100);
    animate(arc, [{ strokeDashoffset: C }, { strokeDashoffset: target }], { duration: 400, easing: 'ease-out' });
    arc.setAttribute('stroke-dashoffset', target.toFixed(2));
    arc.style.display = pct === 0 ? 'none' : '';

    const chart = $('#barChart');
    chart.textContent = '';
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i);
      days.push({ key: dayKey(d), label: d.toLocaleDateString('id-ID', { weekday: 'short' }), today: i === 0, count: 0 });
    }
    tasks.forEach((t) => {
      if (t.done && t.completedAt) {
        const slot = days.find((d) => d.key === dayKey(new Date(t.completedAt)));
        if (slot) slot.count += 1;
      }
    });
    const max = Math.max(3, ...days.map((d) => d.count));
    const baseY = 128, topY = 20, slotW = 300 / 7, barW = 26;
    chart.appendChild(svgEl('line', { x1: 8, x2: 292, y1: baseY, y2: baseY, stroke: '#d9d6df', 'stroke-width': 1.5 }));
    days.forEach((d, i) => {
      const cx = slotW * i + slotW / 2;
      const h = Math.max(d.count ? 6 : 0, (d.count / max) * (baseY - topY));
      const rect = svgEl('rect', {
        x: cx - barW / 2, y: baseY - h, width: barW, height: h, rx: 7,
        fill: d.today ? '#7e6d9a' : '#ffb763'
      });
      rect.style.transformBox = 'fill-box';
      rect.style.transformOrigin = 'bottom';
      chart.appendChild(rect);
      animate(rect, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
        duration: 350, delay: i * 25, easing: 'ease-out', fill: 'backwards'
      });
      const label = svgEl('text', { x: cx, y: 148, 'text-anchor': 'middle', 'font-size': 9, fill: '#7a7385' });
      label.textContent = d.label;
      chart.appendChild(label);
      if (d.count) {
        const val = svgEl('text', { x: cx, y: baseY - h - 6, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#5a4a76' });
        val.textContent = d.count;
        chart.appendChild(val);
      }
    });

    let msg = 'Mulai dari satu To Do List kecil, kamu pasti bisa!';
    if (total === 0) msg = 'Belum ada To Do List. Tambahkan To Do List pertamamu.';
    else if (pct === 100) msg = 'Semua To Do List selesai. Kerja bagus!';
    else if (pct >= 60) msg = 'Sedikit lagi! Terus pertahankan ritmemu.';
    else if (pct >= 30) msg = 'Progres bagus, lanjutkan satu per satu.';
    $('#insight').textContent = msg;
  }

  function enterApp() {
    $('#welcome').hidden = true;
    showPage('tasks');
    sfx.add();
  }

  function init() {
    $$('img').forEach((img) => {
      if (img.getAttribute('src') && img.complete && img.naturalWidth === 0) handleMediaError(img);
    });
    tasks = loadTasks();
    tampilInfoPenyimpanan(ambilPesan());
    saveTasks();

    $('#enterBtn').addEventListener('click', enterApp);

    $$('.nav-btn').forEach((btn) => btn.addEventListener('click', () => showPage(btn.dataset.page)));
    $('#taskForm').addEventListener('submit', onSubmit);
    $('#taskTitle').addEventListener('input', () => {
      const input = $('#taskTitle');
      input.value = limitWords(input.value, 10);
      clearError();
    });
    $('#taskDetails').addEventListener('input', () => {
      const input = $('#taskDetails');
      input.value = limitWords(input.value, 100);
    });
    $('#showProfileBtn').addEventListener('click', editProfile);
    $('#profileForm').addEventListener('submit', saveProfile);
    $('#profilePhoto').addEventListener('change', onProfilePhotoChange);
    $('#photoCropZoom').addEventListener('input', changePhotoCropZoom);
    $('#photoCropCanvas').addEventListener('pointerdown', startPhotoCropDrag);
    $('#photoCropCanvas').addEventListener('pointermove', movePhotoCrop);
    $('#photoCropCanvas').addEventListener('pointerup', endPhotoCropDrag);
    $('#photoCropCanvas').addEventListener('pointercancel', endPhotoCropDrag);
    $('#cancelPhotoCrop').addEventListener('click', cancelPhotoCrop);
    $('#applyPhotoCrop').addEventListener('click', applyPhotoCrop);
    $('#photoCropDialog').addEventListener('cancel', () => {
      cropImage = null;
      cropDragStart = null;
      $('#profilePhoto').value = '';
    });
    $('#editProfileBtn').addEventListener('click', editProfile);
    $('#cancelProfileBtn').addEventListener('click', () => {
      profilePhotoProcessing = false;
      profilePhotoDraft = profile?.photo || '';
      renderProfile();
    });
      $('#todayBtn').addEventListener('click', () => setTaskDue(0));
      $('#tomorrowBtn').addEventListener('click', () => setTaskDue(1));
      $('#taskDue').addEventListener('change', renderDateShortcuts);

    renderList();
    renderProfile();
    const start = (location.hash || '#tasks').slice(1);
    showPage(['tasks', 'stats', 'profile'].includes(start) ? start : 'tasks', false);
  }

  init();
})();