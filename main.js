// --- Main Logic ---
 
let currentViewDate = getGmt8Date();
let selectedDate = getGmt8Date();

function getGmt8Date() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 8));
}

function renderUI() {
  const dateShow = document.getElementById('dateShow');
  const lunarShow = document.getElementById('lunarShow');
  const timeInput = document.getElementById('timeInput');

  const y = selectedDate.getFullYear();
  const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const d = String(selectedDate.getDate()).padStart(2, '0');
  const h = String(selectedDate.getHours()).padStart(2, '0');
  const min = String(selectedDate.getMinutes()).padStart(2, '0');

  dateShow.textContent = `${y}-${m}-${d} ${h}:${min}`;
  timeInput.value = `${h}:${min}`;

  // Get Lunar Date
  const lunar = Lunar.fromDate(selectedDate);
  let dayLunar = lunar;
  if (selectedDate.getHours() === 23) {
    const nextDay = new Date(selectedDate.getTime() + 3600000);
    dayLunar = Lunar.fromDate(nextDay);
  }

  // 计算局数
  const weekDay = selectedDate.toLocaleDateString('zh-CN', { weekday: 'long' });
  const jushu = JieQiCalculator.calculateJuShu(selectedDate);

  // 计算旬首
  const shiGanZhi = lunar.getTimeInGanZhi();
  const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
  const xunshou = xunResult ? `${xunResult.name}(${xunResult.liuYi})` : "未知";

  lunarShow.textContent = [
      `西历：${y}-${m}-${d} ${h}:${min} ${weekDay}`,
      `农历：${selectedDate.getFullYear()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      `干支：${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${dayLunar.getDayInGanZhi()}日 ${lunar.getTimeInGanZhi()}时`,
      `局数：${jushu}\u3000旬首：${xunshou}`,
  ].join('\n');

  if (typeof renderCalendar === 'function') renderCalendar();
  if (typeof updateQimen === 'function') updateQimen();
}

renderUI();
