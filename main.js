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
  const xunshou = xunResult ? `${xunResult.name}（${xunResult.liuYi}）` : "未知";

  // 计算值符
  const xunLiuYi = xunResult ? xunResult.liuYi : "";
  const shiGan = shiGanZhi.substring(0, 1); // 获取时干
  const zhiFuResult = ZhiFuCalculator.getZhiFu(jushu, xunLiuYi, shiGan);
  const zhifu = zhiFuResult ? zhiFuResult.fullTitle : "未知";

  // 计算值使
  const shiZhi = shiGanZhi.substring(1, 2); 
  const xunName = xunResult ? xunResult.name : ""; 
  const zhishi = ZhiShiCalculator.getZhiShi(jushu, xunName, xunLiuYi, shiZhi);

  // 时家驿马
  const yimaInfo = YiMaCalculator.getYiMa(shiZhi);

  // 时家空亡
  const xunNameOnly = xunResult ? xunResult.name : ""; 
  const kwInfos = KongWangCalculator.getKongWang(xunNameOnly);

  // 日家驿马
  // const dayZhi = dayLunar.getDayInGanZhi().substring(1, 2); 
  // const yimaInfo = YiMaCalculator.getYiMa(dayZhi);

  // 日家空亡
  // const dayGanZhi = dayLunar.getDayInGanZhi();
  // const dayXun = XunShouCalculator.getShiXun(dayGanZhi);
  // const dayXunName = dayXun ? dayXun.name : "";
  // const kwInfos = KongWangCalculator.getKongWang(dayXunName);

  const output = [
    // `${QimenAI.getFormattedPan()}`,
    `西历：${y}-${m}-${d} ${h}:${min} ${weekDay}`,
    `农历：${selectedDate.getFullYear()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    `干支：${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${dayLunar.getDayInGanZhi()}日 ${lunar.getTimeInGanZhi()}时`,
    `局数：${jushu}\u3000旬首：${xunshou}`, // \u3000 is a full-width space
    `值符：${zhifu}`,
    `值使：${zhishi.fullTitle}`,
    `驿马：${yimaInfo.gong}`,
    `空亡：${[...new Set(kwInfos.map(k => k.gong))].join(' / ')}`
  ].join('\n');

  lunarShow.textContent = output;

  if (typeof renderCalendar === 'function') renderCalendar();
  if (typeof updateQimen === 'function') updateQimen();
}

renderUI();
