// Theme toggle
const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};

// Apply saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Username saving
const usernameDisplay = document.getElementById('username');
document.getElementById('save-name').onclick = () => {
  const name = document.getElementById('name-input').value.trim();
  if (name) {
    localStorage.setItem('name', name);
    usernameDisplay.textContent = name;
  }
};
if (localStorage.getItem('name')) {
  usernameDisplay.textContent = localStorage.getItem('name');
}

// Weather using Open-Meteo API (free, no key needed)
fetch('https://api.open-meteo.com/v1/forecast?latitude=10.8505&longitude=76.2711&current_weather=true')
  .then(res => res.json())
  .then(data => {
    const weather = data.current_weather;
    document.getElementById('weather').textContent =
      `🌡️ ${weather.temperature}°C, Wind: ${weather.windspeed}km/h`;
  })
  .catch(() => {
    document.getElementById('weather').textContent = '⚠️ Weather not available';
  });

// To-do functionality
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todoList.innerHTML = '';
  todos.forEach(todo => addTodoToDOM(todo));
}

function addTodoToDOM(text) {
  const li = document.createElement('li');
  li.innerHTML = `${text} <button onclick="removeTodo('${text}')">❌</button>`;
  todoList.appendChild(li);
}

function removeTodo(text) {
  let todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos = todos.filter(t => t !== text);
  localStorage.setItem('todos', JSON.stringify(todos));
  loadTodos();
}

todoForm.onsubmit = (e) => {
  e.preventDefault();
  const task = document.getElementById('todo-input').value.trim();
  if (task) {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.push(task);
    localStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
    todoForm.reset();
  }
};
loadTodos();

// Notes
const noteArea = document.getElementById('note-area');
noteArea.value = localStorage.getItem('notes') || '';
noteArea.oninput = () => {
  localStorage.setItem('notes', noteArea.value);
};
