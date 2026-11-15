function formatDue(due) {
  const [year, month, day] = due.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysFromToday = Math.round((date - today) / 86400000);
  if (daysFromToday === -1) return 'Kemarin';
  if (daysFromToday === 0) return 'Hari ini';
  if (daysFromToday === 1) return 'Besok';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export function buatKartuTugas(tugas, { onToggle = () => {}, onHapus = () => {} } = {}) {
  const kartu = document.createElement('li');
  kartu.className = 'task-card' + (tugas.done ? ' is-done' : '');
  kartu.dataset.id = tugas.id;

  const body = document.createElement('div');
  body.className = 'task-body';
  const title = document.createElement('p');
  title.className = 'task-title';
  title.textContent = tugas.title;
  if (tugas.details) {
    const details = document.createElement('p');
    details.className = 'task-card-details';
    details.textContent = tugas.details;
    body.append(title, details);
  } else {
    body.appendChild(title);
  }
  if (tugas.due) {
    const due = document.createElement('span');
    due.className = 'task-due';
    due.textContent = formatDue(tugas.due);
    body.appendChild(due);
  }

  const actions = document.createElement('div');
  actions.className = 'task-actions';
  if (!tugas.done) {
    const label = document.createElement('label');
    label.className = 'check';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('aria-label', 'Tandai selesai: ' + tugas.title);
    checkbox.addEventListener('change', () => onToggle(tugas, checkbox.checked, kartu));
    label.appendChild(checkbox);
    actions.appendChild(label);
  }

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'del-btn';
  deleteButton.setAttribute('aria-label', 'Hapus tugas: ' + tugas.title);
  const icon = document.createElement('img');
  icon.src = 'assets/icons/trash.svg';
  icon.alt = '';
  deleteButton.appendChild(icon);
  deleteButton.addEventListener('click', () => onHapus(tugas, kartu));

  actions.appendChild(deleteButton);
  kartu.append(body, actions);
  return kartu;
}

export function buatPesanKosong(pesan) {
  const item = document.createElement('li');
  item.className = 'task-group-empty';
  item.textContent = pesan;
  return item;
}