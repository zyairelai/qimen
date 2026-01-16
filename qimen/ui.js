/**
 * 辅助渲染函数 - 放在顶部确保可见性
 */
function renderSpan(parent, className, text, callback = null) {
    let el = parent.querySelector(className);
    if (!el) {
        el = document.createElement('span');
        el.className = className.replace('.', '');
        parent.appendChild(el);
    }
    el.textContent = text || "";
    if (callback) callback(el);
}

function updateQimen() {
    if (typeof selectedDate === 'undefined') return;
    
    const lunar = Lunar.fromDate(selectedDate);
    const jushu = JieQiCalculator.calculateJuShu(selectedDate);
    const shiGanZhi = lunar.getTimeInGanZhi();
    const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
    
    if (!xunResult) return;
    
    const diPanGans = getDiPan(jushu) || {};
    const shiGan = shiGanZhi.charAt(0);

    // 计算逻辑保持与你的 QimenAI 一致
    let searchGan = (shiGan === "甲") ? xunResult.liuYi : shiGan;
    let targetPalace = 1; 
    for (let i = 1; i <= 9; i++) {
        if (diPanGans[i] === searchGan) {
            targetPalace = i;
            break;
        }
    }

    const tianPanGans = TianPanCalculator.calculateTianPan(jushu, shiGan, xunResult.liuYi) || {};
    const zhiFuInfo = ZhiFuCalculator.getZhiFu(jushu, xunResult.liuYi, shiGan) || {};
    const zhiShiInfo = ZhiShiCalculator.getZhiShi(jushu, xunResult.name, xunResult.liuYi, shiGanZhi.charAt(1)) || {};

    const stars = StarsCalculator.calculateStars(zhiFuInfo.star, targetPalace) || {};
    const shens = BashenCalculator.calculateShen(jushu, targetPalace) || {};
    const doors = BamenCalculator.calculateDoors(zhiShiInfo.door, zhiShiInfo.targetPalace) || {};

    const gongToIdx = { 4: 0, 9: 1, 2: 2, 3: 3, 5: 4, 7: 5, 8: 6, 1: 7, 6: 8 };
    const gridItems = document.querySelectorAll('.grid-item');

    for (let gong = 1; gong <= 9; gong++) {
        const idx = gongToIdx[gong];
        const item = gridItems[idx];
        if (!item) continue;

        // --- 核心修复：如果是中五宫，清空不需要的内容 ---
        if (gong === 5) {
            renderSpan(item, '.shen', "");
            renderSpan(item, '.star', "");
            renderSpan(item, '.door', "");
            renderSpan(item, '.tianpan-gan', ""); // 清除中五宫的天盘癸
            // 地盘干保留（通常中五宫只留底部的“戊”）
            const diGan = diPanGans[gong] || "戊";
            renderSpan(item, '.dipan-gan', diGan, (el) => {
                el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diGan) : "#795548";
            });
            continue; // 跳过本次循环，不执行下方的通用渲染
        }

        // --- 通用宫位渲染 (1-4, 6-9宫) ---
        // 渲染八神
        const shenText = shens[gong] || "";
        renderSpan(item, '.shen', shenText, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(shenText) : "#000"; 
        });

        // 渲染九星
        let starText = stars[gong] || "";
        if (starText.includes("芮")) starText = "禽芮"; 
        renderSpan(item, '.star', starText, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(starText) : "#000";
        });

        // 渲染八门
        const doorText = doors[gong] || "";
        renderSpan(item, '.door', doorText, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(doorText) : "#000"; 
        });

        // 渲染天干/地盘
        const tianGan = tianPanGans[gong] || "";
        const diGan = diPanGans[gong] || "";
        
        renderSpan(item, '.tianpan-gan', tianGan, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(tianGan) : "#000";
        });
        
        renderSpan(item, '.dipan-gan', diGan, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diGan) : "#000";
        });
    }
}

window.updateQimen = updateQimen;