/**
 * ui.js - 适配 CSS 布局重写版
 */

// 1. 颜色配置 (保持不变)
const WUXING_COLORS = {
    "金": "#d97706", "木": "#16a34a", "水": "#2563eb", "火": "#dc2626", "土": "#78350f"
};

const ELEMENT_MAPPING = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
    "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水",
    "天蓬": "水", "天芮": "土", "天冲": "木", "天辅": "木", "天禽": "土",
    "天心": "金", "天柱": "金", "天任": "土", "天英": "火", "禽芮": "土",
    "休门": "水", "生门": "土", "伤门": "木", "杜门": "木",
    "景门": "火", "死门": "土", "惊门": "金", "开门": "金",
    "值符": "木", "腾蛇": "火", "太阴": "金", "六合": "木", "白虎": "金",
    "玄武": "水", "九地": "土", "九天": "金", "勾陈": "土", "朱雀": "火"
};

/**
 * 核心渲染函数
 */
function updateQimen() {
    if (typeof selectedDate === 'undefined') return;
    
    const lunar = Lunar.fromDate(selectedDate);
    const jushu = JieQiCalculator.calculateJuShu(selectedDate);
    const shiGanZhi = lunar.getTimeInGanZhi();
    const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
    
    if (!xunResult) return;
    
    const diPanGans = getDiPan(jushu);
    const tianPanGans = TianPanCalculator.calculateTianPan(jushu, shiGanZhi.charAt(0), xunResult.liuYi);
    const zhiFuInfo = ZhiFuCalculator.getZhiFu(jushu, xunResult.liuYi, shiGanZhi.charAt(0));
    const zhiShiInfo = ZhiShiCalculator.getZhiShi(jushu, xunResult.name, xunResult.liuYi, shiGanZhi.charAt(1));

    // 计算星、门、神分布
    const stars = StarsCalculator.calculateStars(zhiFuInfo.star, zhiFuInfo.palaceNum);
    const doors = BamenCalculator.calculateDoors(zhiShiInfo.door, zhiShiInfo.targetPalace);
    const shens = BashenCalculator.calculateShen(jushu, zhiFuInfo.palaceNum);

    const gongToIdx = { 4: 0, 9: 1, 2: 2, 3: 3, 5: 4, 7: 5, 8: 6, 1: 7, 6: 8 };
    const gridItems = document.querySelectorAll('.grid-item');

    for (let gong = 1; gong <= 9; gong++) {
        const idx = gongToIdx[gong];
        const item = gridItems[idx];
        if (!item) continue;

        // --- 1. 渲染八神 (居上) ---
        const shenText = shens[gong] || "";
        renderSpan(item, '.shen', shenText, (el) => {
            el.style.color = getCommonColor(shenText); 
        });

        // --- 2. 渲染九星 (居中) ---
        let starText = stars[gong] || "";
        if (starText.includes("芮")) starText = "禽芮";
        renderSpan(item, '.star', starText, (el) => {
            el.style.color = getCommonColor(starText);
        });

        // --- 3. 渲染八门 (居下) ---
        let doorText = doors[gong] || "";
        // 中五宫处理：如果是寄宫，去掉“门”字缩短长度，防止重叠
        if (gong === 5 && doorText.includes("寄")) {
            doorText = doorText.replace("门", "");
        }
        
        renderSpan(item, '.door', doorText, (el) => {
            // 寄宫颜色跟随门的名字（如寄死，取死的颜色）
            const colorKey = doorText.replace("寄", "").replace("门", "") + "门";
            el.style.color = getCommonColor(colorKey); 
        });

        // --- 4. 渲染天干地盘 (居右) ---
        // 天盘干：中五宫不显示（或特殊处理）
        const tianGan = (gong === 5) ? "" : (tianPanGans[gong] || "");
        const diGan = diPanGans[gong] || "";
        
        renderSpan(item, '.tianpan-gan', tianGan, (el) => {
            el.style.color = getCommonColor(tianGan);
        });
        
        renderSpan(item, '.dipan-gan', diGan, (el) => {
            el.style.color = getCommonColor(diGan);
        });
    }
}

/**
 * 辅助渲染函数
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
 * 获取五行颜色
 */
function getCommonColor(name) {
    if (!name || name === "寄") return "#64748b";
    // 过滤掉“寄”字再取色
    const cleanName = name.replace("寄", "").trim().split('/')[0]; 
    const wuxing = ELEMENT_MAPPING[cleanName];
    if (!wuxing) {
        const shortName = cleanName.substring(0, 2);
        const altWuxing = ELEMENT_MAPPING[shortName];
        return WUXING_COLORS[altWuxing] || "#64748b";
    }
    return WUXING_COLORS[wuxing] || "#64748b";
}

window.updateQimen = updateQimen;