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
    
    // 1. 处理日干：如果是甲日，自动遁至六仪
    const riGanZhi = lunar.getDayInGanZhi(); // 如 "甲午"
    const riGan = riGanZhi.charAt(0);        // 如 "甲"
    
    let riGanReal = riGan;
    if (riGan === "甲") {
        const liuYiMap = {
            "甲子": "戊", "甲戌": "己", "甲申": "庚", 
            "甲午": "辛", "甲辰": "壬", "甲寅": "癸"
        };
        // 取得日柱对应的六仪，例如“甲午”对应“辛”
        riGanReal = liuYiMap[riGanZhi] || riGan;
    }

    // 2. 处理时干与旬首（用于确定值符值使）
    const shiGanZhi = lunar.getTimeInGanZhi();
    const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
    if (!xunResult) return;
    
    const shiGan = shiGanZhi.charAt(0);
    const diPanGans = getDiPan(jushu) || {};

    // 3. 计算天盘、值符、值使等基础数据
    const tianPanGans = TianPanCalculator.calculateTianPan(jushu, shiGan, xunResult.liuYi) || {};
    const zhiFuInfo = ZhiFuCalculator.getZhiFu(jushu, xunResult.liuYi, shiGan) || {};
    const zhiShiInfo = ZhiShiCalculator.getZhiShi(jushu, xunResult.name, xunResult.liuYi, shiGanZhi.charAt(1)) || {};

    // 4. 定位目标宫位（以时干为参考计算星神，这是你原有的 targetPalace 逻辑）
    let searchGan = (shiGan === "甲") ? xunResult.liuYi : shiGan;
    let targetPalace = 1; 
    for (let i = 1; i <= 9; i++) {
        if (diPanGans[i] === searchGan) {
            targetPalace = i;
            break;
        }
    }

    const stars = StarsCalculator.calculateStars(zhiFuInfo.star, targetPalace) || {};
    const shens = BashenCalculator.calculateShen(jushu, targetPalace) || {};
    const doors = BamenCalculator.calculateDoors(zhiShiInfo.door, zhiShiInfo.targetPalace) || {};

    // 5. 渲染九宫格
    const gongToIdx = { 4: 0, 9: 1, 2: 2, 3: 3, 5: 4, 7: 5, 8: 6, 1: 7, 6: 8 };
    const gridItems = document.querySelectorAll('.grid-item');

    for (let gong = 1; gong <= 9; gong++) {
        const idx = gongToIdx[gong];
        const item = gridItems[idx];
        if (!item) continue;

        const tianGan = tianPanGans[gong] || "";
        const diGan = diPanGans[gong] || "";

        // --- 核心高亮逻辑重写 ---
        // 只要天盘干等于我们算出的“真日干”，且不是中宫，就高亮
        if (tianGan === riGanReal && gong !== 5) {
            item.style.backgroundColor = "#FEF3C7"; // 琥珀金
            item.style.border = "2px solid #F59E0B"; // 增加边框强调
        } else {
            item.style.backgroundColor = ""; 
            item.style.border = "";
        }

        // --- 中五宫特殊处理 ---
        if (gong === 5) {
            item.style.backgroundColor = ""; 
            renderSpan(item, '.shen', "");
            renderSpan(item, '.star', "");
            renderSpan(item, '.door', "");
            renderSpan(item, '.tianpan-gan', "");
            renderSpan(item, '.dipan-gan', diGan, (el) => {
                el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diGan) : "#795548";
            });
            continue;
        }

        // --- 通用内容渲染 ---
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