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

function applyCustomUnderline(el, isActive) {
    if (isActive) {
        el.style.textDecoration = "underline";
        el.style.textDecorationColor = "currentColor";
        el.style.textDecorationThickness = "2.5px";
        el.style.textUnderlineOffset = "3px";
    } else {
        el.style.textDecoration = "none";
    }
}

function applyShiGanBox(el, currentGan, targetGan) {
    if (currentGan === targetGan && currentGan !== "") {
        el.style.outline = "3px solid #EF4444"; 
        el.style.outlineOffset = "1px"; 
        el.style.display = "inline-block";
        el.style.zIndex = "10";
    } else {
        el.style.outline = "none";
        el.style.display = "inline"; 
    }
}

function updateQimen() {
    if (typeof selectedDate === 'undefined') return;

    // 1. 获取核心数据
    const panData = QimenAI.getPanObject();
    if (typeof panData === 'string' || !panData) return;

    // 2. 获取基础元数据
    const lunar = Lunar.fromDate(selectedDate);
    const shiGanZhi = lunar.getTimeInGanZhi();
    const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
    const shiGan = shiGanZhi.charAt(0);
    const searchShiGan = (shiGan === "甲" && xunResult) ? xunResult.liuYi : shiGan;
    
    const riGanZhi = lunar.getDayInGanZhi();
    const riGanOriginal = riGanZhi.charAt(0);
    
    // --- 核心修复：处理日干为甲的情况 ---
    // 如果日干是甲，寻找日干对应的旬首（六仪）作为高亮目标
    const riXun = XunShouCalculator.getShiXun(riGanZhi); // 获取日柱旬首
    const searchRiGan = (riGanOriginal === "甲" && riXun) ? riXun.liuYi : riGanOriginal;

    const gridItems = document.querySelectorAll('.grid-item');
    const gongToUiIdx = { 4:0, 9:1, 2:2, 3:3, 5:4, 7:5, 8:6, 1:7, 6:8 };

    // --- 3. 渲染中五宫 ---
    const midItem = gridItems[4];
    if (midItem) {
        const jushu = JieQiCalculator.calculateJuShu(selectedDate);
        const diPanGans = getDiPan(jushu) || {};
        ['.shen', '.star', '.door', '.tianpan-gan', '.ji-gan'].forEach(cls => renderSpan(midItem, cls, ""));
        renderSpan(midItem, '.dipan-gan', diPanGans[5] || "戊", el => {
            el.style.color = "#795548";
            applyShiGanBox(el, diPanGans[5], searchShiGan);
        });
    }

    // --- 4. 渲染其余八宫 ---
    panData.forEach(p => {
        const idx = gongToUiIdx[p.palaceId];
        const item = gridItems[idx];
        if (!item) return;

        // 背景：高亮日干所在宫位
        const tianGan = p.ganCombined.split('+')[0] || "";
        
        // 使用转换后的 searchRiGan 进行匹配
        const isMainMatch = (tianGan === searchRiGan);
        const isJiMatch = (p.isRuiPalace && p.jiGan === searchRiGan);
        
        item.style.backgroundColor = (isMainMatch || isJiMatch) ? "#FEF3C7" : "";

        // A. 渲染神
        renderSpan(item, '.shen', p.shen, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(p.shen) : ""; 
        });

        // B. 渲染星
        let starText = p.isRuiPalace ? "禽芮" : p.star;
        renderSpan(item, '.star', starText, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor("天芮") : "";
            el.style.fontWeight = "600";
        });

        // C. 渲染门
        renderSpan(item, '.door', p.door, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(p.door) : ""; 
            el.style.fontWeight = "600";
        });

        // D. 天盘与地盘逻辑拆分
        const gans = p.ganCombined.split('+');
        const diGan = gans[1] || "";

        // 1. 渲染 寄天干 (居左)
        const isShowJi = p.isRuiPalace && p.jiGan && p.jiGan !== tianGan;
        renderSpan(item, '.ji-gan', isShowJi ? p.jiGan : "", el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(p.jiGan) : "#666";
            applyShiGanBox(el, isShowJi ? p.jiGan : "", searchShiGan);
        });

        // 2. 渲染 主天盘干 (居右)
        renderSpan(item, '.tianpan-gan', tianGan, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(tianGan) : "";
            applyShiGanBox(el, tianGan, searchShiGan);
        });

        // 3. 渲染 地盘干 (居右下)
        renderSpan(item, '.dipan-gan', diGan, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diGan) : "";
            applyShiGanBox(el, diGan, searchShiGan);
        });
    });
}

window.updateQimen = updateQimen;