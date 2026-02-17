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

const confirmTime = () => {
  const timeVal = document.getElementById('timeInput').value;
  const [h, m] = timeVal.split(':');
  selectedDate.setHours(parseInt(h));
  selectedDate.setMinutes(parseInt(m));
  currentViewDate = new Date(selectedDate);
  renderUI();
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = '';
};

document.getElementById('confirmTimeBtn').onclick = confirmTime;

const timeInput = document.getElementById('timeInput');
if (timeInput) {
  timeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault();
      e.stopPropagation();
      confirmTime();
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
    const overlay = document.getElementById('overlay');
    if (overlay && overlay.classList.contains('active')) {
      // Don't prevent default here if it's already handled by timeInput
      if (e.target !== timeInput) {
        confirmTime();
      }
    }
  } else if (e.key === 'ArrowRight') {
    selectedDate.setHours(selectedDate.getHours() + 2);
    currentViewDate = new Date(selectedDate);
    renderUI();
  } else if (e.key === 'ArrowLeft') {
    selectedDate.setHours(selectedDate.getHours() - 2);
    currentViewDate = new Date(selectedDate);
    renderUI();
  }
});

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
