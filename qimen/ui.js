/**
 * 辅助渲染函数 - 负责创建或更新 DOM 元素
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

/**
 * 核心渲染函数：更新奇门遁甲九宫格界面
 */
function updateQimen() {
    if (typeof selectedDate === 'undefined') return;
    
    const lunar = Lunar.fromDate(selectedDate);
    const jushu = JieQiCalculator.calculateJuShu(selectedDate);
    
    // --- 1. 日干处理 ---
    const riGanZhi = lunar.getDayInGanZhi(); 
    const riGan = riGanZhi.charAt(0);        
    let riGanReal = riGan;
    if (riGan === "甲") {
        const liuYiMap = { "甲子": "戊", "甲戌": "己", "甲申": "庚", "甲午": "辛", "甲辰": "壬", "甲寅": "癸" };
        riGanReal = liuYiMap[riGanZhi] || riGan;
    }

    // --- 2. 时干处理 ---
    const shiGanZhi = lunar.getTimeInGanZhi();
    const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
    if (!xunResult) return;
    
    const shiGan = shiGanZhi.charAt(0);
    const searchShiGan = (shiGan === "甲") ? xunResult.liuYi : shiGan;

    const diPanGans = getDiPan(jushu) || {};
    const tianPanGans = TianPanCalculator.calculateTianPan(jushu, shiGan, xunResult.liuYi) || {};
    const zhiFuInfo = ZhiFuCalculator.getZhiFu(jushu, xunResult.liuYi, shiGan) || {};
    const zhiShiInfo = ZhiShiCalculator.getZhiShi(jushu, xunResult.name, xunResult.liuYi, shiGanZhi.charAt(1)) || {};

    let targetPalace = 1; 
    for (let i = 1; i <= 9; i++) {
        if (diPanGans[i] === xunResult.liuYi) {
            targetPalace = i;
            break;
        }
    }

    const stars = StarsCalculator.calculateStars(zhiFuInfo.star, targetPalace) || {};
    const shens = BashenCalculator.calculateShen(jushu, targetPalace) || {};
    const doors = BamenCalculator.calculateDoors(zhiShiInfo.door, zhiShiInfo.targetPalace) || {};

    // --- 3. 渲染九宫格 ---
    const gongToIdx = { 4: 0, 9: 1, 2: 2, 3: 3, 5: 4, 7: 5, 8: 6, 1: 7, 6: 8 };
    const gridItems = document.querySelectorAll('.grid-item');

    for (let gong = 1; gong <= 9; gong++) {
        const idx = gongToIdx[gong];
        const item = gridItems[idx];
        if (!item) continue;

        const tianGan = tianPanGans[gong] || "";
        const diGan = diPanGans[gong] || "";

        // 日干宫位背景高亮
        item.style.backgroundColor = (tianGan === riGanReal && gong !== 5) ? "#FEF3C7" : "";

        // --- 中五宫特殊处理 ---
        if (gong === 5) {
            ['.shen', '.star', '.door', '.tianpan-gan'].forEach(cls => renderSpan(item, cls, ""));
            renderSpan(item, '.dipan-gan', diGan, (el) => {
                el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diGan) : "#795548";
                el.style.fontWeight = "bold"; 
                applyShiGanBox(el, diGan, searchShiGan);
            });
            continue;
        }

        // 渲染神
        renderSpan(item, '.shen', shens[gong] || "", (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(shens[gong]) : ""; 
        });
        
        // 渲染星 (值符加下划线)
        let starText = stars[gong] || "";
        if (starText.includes("芮")) starText = "禽芮"; 
        renderSpan(item, '.star', starText, (el) => {
            const isZhiFu = (starText.includes(zhiFuInfo.star) || (zhiFuInfo.star === "天芮" && starText === "禽芮"));
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(starText) : "";
            el.style.fontWeight = "600";
            applyCustomUnderline(el, isZhiFu);
        });

        // 渲染门 (值使加下划线)
        renderSpan(item, '.door', doors[gong] || "", (el) => {
            const isZhiShi = (doors[gong] === zhiShiInfo.door);
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(doors[gong]) : ""; 
            el.style.fontWeight = "600";
            applyCustomUnderline(el, isZhiShi);
        });

        // 渲染天盘干
        renderSpan(item, '.tianpan-gan', tianGan, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(tianGan) : "";
            el.style.fontWeight = "bold"; 
            applyShiGanBox(el, tianGan, searchShiGan);
        });
        
        // 渲染地盘干
        renderSpan(item, '.dipan-gan', diGan, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diGan) : "";
            el.style.fontWeight = "bold"; 
            applyShiGanBox(el, diGan, searchShiGan);
        });
    }
}

/**
 * 修正后的下划线函数：使用 text-decoration 避免排版位移
 */
function applyCustomUnderline(el, isActive) {
    if (isActive) {
        // 使用现代 CSS 属性，不占位，不跑位置
        el.style.textDecoration = "underline";
        el.style.textDecorationColor = "currentColor";
        el.style.textDecorationThickness = "2.5px";
        el.style.textUnderlineOffset = "3px"; // 线下沉距离，可微调
    } else {
        el.style.textDecoration = "none";
    }
}

/**
 * 时干粗红框逻辑：使用 outline 确保不占位
 */
function applyShiGanBox(el, currentGan, targetGan) {
    if (currentGan === targetGan && currentGan !== "") {
        el.style.outline = "3px solid #EF4444"; 
        el.style.outlineOffset = "1px"; 
        el.style.borderRadius = "1px"; 
        el.style.display = "inline-block";
        el.style.zIndex = "10";
    } else {
        el.style.outline = "none";
        // 还原 display，避免不必要的 inline-block 影响
        el.style.display = "inline"; 
    }
}

window.updateQimen = updateQimen;