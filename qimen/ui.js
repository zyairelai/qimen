function getPalaceId(gongName) {
    if (!gongName) return null;
    const cnToNum = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
    for (let cn in cnToNum) {
        if (gongName.includes(cn)) return cnToNum[cn];
    }
    return null;
}

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
        el.style.textDecorationThickness = "3px";
        el.style.textUnderlineOffset = "5px";
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
    const jushu = JieQiCalculator.calculateJuShu(selectedDate);
    const shiGanZhi = lunar.getTimeInGanZhi();
    const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
    const shiGan = shiGanZhi.charAt(0);
    const searchShiGan = (shiGan === "甲" && xunResult) ? xunResult.liuYi : shiGan;

    // 获取值符和值使信息（用于判定下划线）
    const zhiFuInfo = ZhiFuCalculator.getZhiFu(jushu, xunResult.liuYi, shiGan) || {};
    const zhiShiInfo = ZhiShiCalculator.getZhiShi(jushu, xunResult.name, xunResult.liuYi, shiGanZhi.charAt(1)) || {};

    const riGanZhi = lunar.getDayInGanZhi();
    const riGanOriginal = riGanZhi.charAt(0);
    const riXun = XunShouCalculator.getShiXun(riGanZhi);
    const searchRiGan = (riGanOriginal === "甲" && riXun) ? riXun.liuYi : riGanOriginal;

    const shiZhi = shiGanZhi.charAt(1);
    const yimaInfo = (typeof YiMaCalculator !== 'undefined') ? YiMaCalculator.getYiMa(shiZhi) : null;
    const xunNameOnly = xunResult ? xunResult.name : "";
    const kwInfos = (typeof KongWangCalculator !== 'undefined') ? KongWangCalculator.getKongWang(xunNameOnly) : [];

    const yimaPalaceId = yimaInfo ? getPalaceId(yimaInfo.gong) : null;
    const kwPalaceIds = (kwInfos || []).map(k => getPalaceId(k.gong));

    const gridItems = document.querySelectorAll('.grid-item');
    const gongToUiIdx = { 4: 0, 9: 1, 2: 2, 3: 3, 5: 4, 7: 5, 8: 6, 1: 7, 6: 8 };

    // --- 3. 渲染中五宫 ---
    const midItem = gridItems[4];
    if (midItem) {
        const diPanGans = getDiPan(jushu) || {};
        ['.shen', '.star', '.door', '.tianpan-gan', '.ji-gan', '.yima', '.kongwang'].forEach(cls => renderSpan(midItem, cls, ""));
        renderSpan(midItem, '.dipan-gan', diPanGans[5] || "戊", el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diPanGans[5]) : "#795548";
            applyShiGanBox(el, diPanGans[5], searchShiGan);
            applyCustomUnderline(el, false); // 中宫通常不加下划线
        });
    }

    // --- 4. 渲染其余八宫 ---
    panData.forEach(p => {
        const idx = gongToUiIdx[p.palaceId];
        const item = gridItems[idx];
        if (!item) return;

        const tianGan = p.ganCombined.split('+')[0] || "";
        const isMainMatch = (tianGan === searchRiGan);
        const isJiMatch = (p.isRuiPalace && p.jiGan === searchRiGan);
        item.style.backgroundColor = (isMainMatch || isJiMatch) ? "#FEF3C7" : "";

        // A. 渲染神
        renderSpan(item, '.shen', p.shen, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(p.shen) : "";
        });

        // B. 渲染星 (增加值符下划线)
        let starText = p.isRuiPalace ? "禽芮" : p.star;
        renderSpan(item, '.star', starText, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(starText) : "";
            el.style.fontWeight = "600";
            // 如果是值符星，添加下划线
            const isZhiFu = (starText.includes(zhiFuInfo.star));
            applyCustomUnderline(el, isZhiFu);
        });

        // C. 渲染门 (增加值使下划线)
        renderSpan(item, '.door', p.door, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(p.door) : "";
            el.style.fontWeight = "600";
            // 如果是值使门，添加下划线
            const isZhiShi = (p.door === zhiShiInfo.door);
            applyCustomUnderline(el, isZhiShi);
        });

        // D. 天盘与地盘逻辑
        const gans = p.ganCombined.split('+');
        const diGan = gans[1] || "";

        // E. 渲染驿马与空亡 (🐎, 💀)
        const hasYima = (p.palaceId === yimaPalaceId);
        const hasKw = kwPalaceIds.includes(p.palaceId);

        renderSpan(item, '.yima', hasYima ? "🐎" : "");
        renderSpan(item, '.kongwang', hasKw ? "💀" : "", el => {
            if (hasYima) el.classList.add('stacked');
            else el.classList.remove('stacked');
        });
        renderSpan(item, '.symbol-box', ""); // 清除旧容器以免冲突

        // 1. 渲染 寄天干
        const isShowJi = p.isRuiPalace && p.jiGan && p.jiGan !== tianGan;
        renderSpan(item, '.ji-gan', isShowJi ? p.jiGan : "", el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(p.jiGan) : "#666";
            applyShiGanBox(el, isShowJi ? p.jiGan : "", searchShiGan);
        });

        // 2. 渲染 主天盘干
        renderSpan(item, '.tianpan-gan', tianGan, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(tianGan) : "";
            applyShiGanBox(el, tianGan, searchShiGan);
        });

        // 3. 渲染 地盘干
        renderSpan(item, '.dipan-gan', diGan, el => {
            el.style.color = typeof getCommonColor === 'function' ? getCommonColor(diGan) : "";
            applyShiGanBox(el, diGan, searchShiGan);
        });
    });
}

window.updateQimen = updateQimen;