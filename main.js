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

const WUXING_COLORS = {
    "金": "#d97706", // 琥珀金，比纯黄更易读
    "木": "#16a34a", // 森林绿
    "水": "#2563eb", // 蓝宝石色
    "火": "#dc2626", // 鲜红色
    "土": "#78350f"  // 褐色
};

function getGanColor(gan) {
    // 强制转换为字符串并过滤掉假值
    if (!gan || typeof gan !== 'string') return "#64748b"; 
    
    const mapping = {
        "甲": "木", "乙": "木",
        "丙": "火", "丁": "火",
        "戊": "土", "己": "土",
        "庚": "金", "辛": "金",
        "壬": "水", "癸": "水"
    };
    
    // 确保取到了对应的五行，如果没有，返回默认色
    const wuxing = mapping[gan.trim()]; 
    return WUXING_COLORS[wuxing] || "#64748b";
}

function updateQimen() {
    const jushu = JieQiCalculator.calculateJuShu(selectedDate);
    const diPanGans = getDiPan(jushu);

    const gongToIdx = {
        4: 0, 9: 1, 2: 2,
        3: 3, 5: 4, 7: 5,
        8: 6, 1: 7, 6: 8
    };

    const gridItems = document.querySelectorAll('.grid-item');

    for (let gong = 1; gong <= 9; gong++) {
        const idx = gongToIdx[gong];
        const item = gridItems[idx];
        const gan = diPanGans[gong];

        let diPanSpan = item.querySelector('.dipan-gan');
        if (!diPanSpan) {
            diPanSpan = document.createElement('span');
            diPanSpan.className = 'dipan-gan';
            item.appendChild(diPanSpan);
        }

        diPanSpan.textContent = gan;
        diPanSpan.style.color = getGanColor(gan);
    }
}

renderUI();