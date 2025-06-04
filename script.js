// -------------------- Utilities ----------------------
const $ = (sel) => document.querySelector(sel);
const local = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
};

// ------------------ PIN LOCK ------------------------
const pinInput = $('#pin-input');
const unlockBtn = $('#unlock-btn');
const pinStatus = $('#pin-status');
const dashboard = document.querySelector('.dashboard');
const lockScreen = $('#lock-screen');

unlockBtn.onclick = () => {
  const storedPin = local.get('pin') || '1234';
  if (pinInput.value === storedPin) {
    lockScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
  } else {
    pinStatus.textContent = '❌ Incorrect PIN';
  }
};

// ------------------ SAVE NAME + PIN ------------------
$('#save-name').onclick = () => {
  const name = $('#name-input').value.trim();
  const pin = $('#set-pin').value.trim();
  if (name) {
    $('#username').textContent = name;
    local.set('name', name);
    if (pin.length === 4) local.set('pin', pin);
    loadAvatar(name);
  }
};

// ------------------ AVATAR ---------------------------
function loadAvatar(name) {
  $('#avatar').src = `https://avatars.dicebear.com/api/identicon/${name}.svg`;
}

// ------------------ THEME TOGGLE ---------------------
$('#theme-toggle').onclick = () => {
  document.body.classList.toggle('dark');
  local.set('theme', document.body.classList.contains('dark'));
};

if (local.get('theme')) document.body.classList.add('dark');

// ------------------ LOAD SAVED DATA ------------------
const savedName = local.get('name');
if (savedName) {
  $('#username').textContent = savedName;
  loadAvatar(savedName);
}
$('#note-area').value = local.get('note') || '';

// ------------------ CLOCK ----------------------------
setInterval(() => {
  const now = new Date();
  $('#clock').textContent = now.toLocaleTimeString();
}, 1000);

// ------------------ WEATHER API ----------------------
fetch('https://wttr.in/?format=%C+%t')
  .then(res => res.text())
  .then(data => $('#weather').textContent = data)
  .catch(() => $('#weather').textContent = '🌤️ N/A');

// ------------------ QUOTE API ------------------------
fetch('https://api.quotable.io/random')
  .then(res => res.json())
  .then(data => $('#quote-text').textContent = data.content)
  .catch(() => $('#quote-text').textContent = 'Error loading quote');

// ------------------ TO-DO LIST -----------------------
const todoForm = $('#todo-form');
const todoInput = $('#todo-input');
const todoList = $('#todo-list');
let todos = local.get('todos') || [];

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${item} <button onclick="deleteTodo(${i})">❌</button>`;
    todoList.appendChild(li);
  });
  local.set('todos', todos);
}
function deleteTodo(i) {
  todos.splice(i, 1);
  renderTodos();
}
todoForm.onsubmit = (e) => {
  e.preventDefault();
  todos.push(todoInput.value);
  todoInput.value = '';
  renderTodos();
};
renderTodos();

// ------------------ NOTES ----------------------------
$('#note-area').oninput = (e) => {
  local.set('note', e.target.value);
};

// ------------------ CALENDAR -------------------------
function renderCalendar() {
  const grid = $('#calendar-grid');
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth(), 1);
  const days = [];
  const startDay = date.getDay();

  for (let i = 0; i < startDay; i++) days.push('');
  while (date.getMonth() === today.getMonth()) {
    days.push(new Date(date).getDate());
    date.setDate(date.getDate() + 1);
  }

  grid.innerHTML = '';
  days.forEach(d => {
    const cell = document.createElement('div');
    cell.textContent = d;
    if (d === today.getDate()) cell.classList.add('today');
    grid.appendChild(cell);
  });
}
renderCalendar();

// ------------------ TIPS -----------------------------
const tips = [
  'Take short breaks every 25 mins.',
  'Avoid multitasking. Focus on one task.',
  'Use keyboard shortcuts to save time.',
  'Stay hydrated while working.',
  'Write down your daily goals.'
];
$('#tip').textContent = tips[Math.floor(Math.random() * tips.length)];
