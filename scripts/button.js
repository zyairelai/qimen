// --- Button Event Handlers ---

document.getElementById('dateShow').onclick = () => {
  document.getElementById('overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
};

document.getElementById('overlay').onclick = (e) => {
  if (e.target.id === 'overlay') {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
};

document.getElementById('confirmTimeBtn').onclick = () => {
  const timeVal = document.getElementById('timeInput').value;
  const [h, m] = timeVal.split(':');
  selectedDate.setHours(parseInt(h));
  selectedDate.setMinutes(parseInt(m));
  currentViewDate = new Date(selectedDate);
  renderUI();
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = '';
};

document.getElementById('prevBtn').onclick = () => {
  selectedDate.setHours(selectedDate.getHours() - 2);
  currentViewDate = new Date(selectedDate);
  renderUI();
};

document.getElementById('nextBtn').onclick = () => {
  selectedDate.setHours(selectedDate.getHours() + 2);
  currentViewDate = new Date(selectedDate);
  renderUI();
};

document.getElementById('nowBtn').onclick = () => {
  selectedDate = getGmt8Date();
  currentViewDate = new Date(selectedDate);
  renderUI();
};

// --- PWA / Standalone Detection ---
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (isStandalone) {
  document.querySelectorAll('.pwa-only').forEach(el => el.style.display = 'flex');
}

// --- Save & History Logic ---
const SAVE_KEY = 'qimen_saved_states';

function getSavedStates() {
  const data = localStorage.getItem(SAVE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveStates(states) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(states));
}

document.getElementById('saveBtn').onclick = () => {
  const name = prompt("Enter a name for this state:", "New State");
  if (!name) return;

  const states = getSavedStates();
  const newState = {
    id: Date.now(),
    name: name,
    timestamp: selectedDate.getTime(),
    displayTime: document.getElementById('dateShow').textContent
  };
  states.unshift(newState);
  saveStates(states);
  alert("State saved!");
};

document.getElementById('historyBtn').onclick = () => {
  renderHistory();
  document.getElementById('historyOverlay').classList.add('active');
};

document.getElementById('closeHistory').onclick = () => {
  document.getElementById('historyOverlay').classList.remove('active');
};

function renderHistory() {
  const listEl = document.getElementById('historyList');
  const states = getSavedStates();
  listEl.innerHTML = '';

  if (states.length === 0) {
    listEl.innerHTML = '<div style="text-align:center; padding:20px; color:#666;">No history yet.</div>';
    return;
  }

  states.forEach(state => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="item-name">${state.name}</div>
      <div class="item-time">${state.displayTime}</div>
    `;

    // Long press logic
    let pressTimer;
    const startPress = () => {
      item.classList.add('long-pressed');
      pressTimer = setTimeout(() => handleLongPress(state), 800);
    };
    const cancelPress = () => {
      clearTimeout(pressTimer);
      item.classList.remove('long-pressed');
    };

    item.addEventListener('touchstart', startPress);
    item.addEventListener('touchend', cancelPress);
    item.addEventListener('mousedown', startPress);
    item.addEventListener('mouseup', cancelPress);
    item.addEventListener('mouseleave', cancelPress);

    item.onclick = (e) => {
      if (item.classList.contains('long-pressed')) {
        // Prevent click if it was a potential long press start
      }
      selectedDate = new Date(state.timestamp);
      currentViewDate = new Date(selectedDate);
      renderUI();
      document.getElementById('historyOverlay').classList.remove('active');
    };

    listEl.appendChild(item);
  });
}

function handleLongPress(state) {
  const action = confirm(`Manage "${state.name}":\n\nOK: Edit Name\nCancel: Delete?`);
  if (action) {
    const newName = prompt("Enter new name:", state.name);
    if (newName) {
      const states = getSavedStates();
      const idx = states.findIndex(s => s.id === state.id);
      if (idx !== -1) {
        states[idx].name = newName;
        saveStates(states);
        renderHistory();
      }
    }
  } else {
    if (confirm(`Are you sure you want to delete "${state.name}"?`)) {
      const states = getSavedStates();
      const filtered = states.filter(s => s.id !== state.id);
      saveStates(filtered);
      renderHistory();
    }
  }
}
