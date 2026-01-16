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
    
    // 1. 提取日干：例如“己亥日”提取“己”
    const riGanZhi = lunar.getDayInGanZhi(); 
    const riGan = riGanZhi.charAt(0);        
    
    const shiGanZhi = lunar.getTimeInGanZhi();
    const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
    
    if (!xunResult) return;
    
    const diPanGans = getDiPan(jushu) || {};
    const shiGan = shiGanZhi.charAt(0);

    // 计算逻辑
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

        const tianGan = tianPanGans[gong] || "";
        const diGan = diPanGans[gong] || "";

        // --- 核心修改：判断天盘干是否为日干 ---
        // 排除中五宫（通常不直接在高亮逻辑中处理，或者根据你的习惯而定）
        if (tianGan === riGan && gong !== 5) {
            item.style.backgroundColor = "#FEF3C7"; // 琥珀金
        } else {
            item.style.backgroundColor = ""; // 恢复默认
        }

        // --- 中五宫特殊清空逻辑 ---
        if (gong === 5) {
            item.style.backgroundColor = ""; // 中宫一般保持原样
            renderSpan(item, '.shen', "");
            renderSpan(item, '.star', "");
            renderSpan(item, '.door', "");
            renderSpan(item, '.tianpan-gan', "");
            renderSpan(item, '.dipan-gan', diGan, (el) => {
                el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diGan) : "#795548";
            });
            continue;
        }

        // --- 通用渲染 ---
        renderSpan(item, '.shen', shens[gong] || "", (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(shens[gong]) : ""; 
        });
        
        let starText = stars[gong] || "";
        if (starText.includes("芮")) starText = "禽芮"; 
        renderSpan(item, '.star', starText, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(starText) : "";
        });

        renderSpan(item, '.door', doors[gong] || "", (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(doors[gong]) : ""; 
        });

        renderSpan(item, '.tianpan-gan', tianGan, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(tianGan) : "";
        });
        
        renderSpan(item, '.dipan-gan', diGan, (el) => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diGan) : "";
        });
    }
}

window.updateQimen = updateQimen;