// --- 全局状态管理 ---
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

  // 获取农历与干支
  const lunar = Lunar.fromDate(selectedDate);
  let dayLunar = lunar;
  if (selectedDate.getHours() === 23) {
    const nextDay = new Date(selectedDate.getTime() + 3600000);
    dayLunar = Lunar.fromDate(nextDay);
  }

  const gzYear = lunar.getYearInGanZhi();
  const gzMonth = lunar.getMonthInGanZhi();
  const gzDay = dayLunar.getDayInGanZhi(); 
  const gzTime = lunar.getTimeInGanZhi();
  const lunarMonth = lunar.getMonthInChinese();
  const lunarDay = lunar.getDayInChinese();

  // 输出格式修改 COPY TO CLIPBOARD
  const weekDay = selectedDate.toLocaleDateString('zh-CN', { weekday: 'long' });
  const yinyang = YinYangCalculator.calculateYinYang(gzYear, gzMonth, gzDay, gzTime);
  
  lunarShow.textContent = [
      `西历：${y}-${m}-${d} ${h}:${min} ${weekDay}`,
      `农历：${selectedDate.getFullYear()}年${lunarMonth}月${lunarDay}`,
      `干支：${gzYear}年 ${gzMonth}月 ${gzDay}日 ${gzTime}时`,
      `局数：${yinyang} 旬首：`,
      `值符：`,
      `值使：`
  ].join('\n');
  
  // 调用外部方法
  if (typeof renderCalendar === 'function') renderCalendar();
  if (typeof updateQimen === 'function') updateQimen();
}

// 初始化
renderUI();
