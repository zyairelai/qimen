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
