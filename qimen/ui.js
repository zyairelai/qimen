/**
 * ui.js - 负责奇门遁甲界面的渲染
 */
function updateQimen() {
    // 1. 基础数据获取
    if (typeof selectedDate === 'undefined') return;
    
    const lunar = Lunar.fromDate(selectedDate);
    const jushu = JieQiCalculator.calculateJuShu(selectedDate);
    const shiGanZhi = lunar.getTimeInGanZhi();
    const shiGan = shiGanZhi.charAt(0);
    const shiZhi = shiGanZhi.charAt(1);

    // 2. 获取旬首信息
    const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
    if (!xunResult) return;
    
    // 统一变量名
    const xunName = xunResult.name; 
    const xunLiuYi = xunResult.liuYi; 

    // 3. 计算各层级数据
    const diPanGans = getDiPan(jushu);
    // 修复点：确保这里传入的是 xunLiuYi
    const tianPanGans = TianPanCalculator.calculateTianPan(jushu, shiGan, xunLiuYi);
    
    const zhiFuInfo = ZhiFuCalculator.getZhiFu(jushu, xunLiuYi, shiGan);
    const zhiShiInfo = ZhiShiCalculator.getZhiShi(jushu, xunName, xunLiuYi, shiZhi);

    // 计算星、门、神分布
    // 这里的 palaceNum 是我们在 zhifu.js 和 zhishi.js 中添加的返回属性
    const stars = StarsCalculator.calculateStars(zhiFuInfo.star, zhiFuInfo.palaceNum);
    const doors = BamenCalculator.calculateDoors(zhiShiInfo.door, zhiShiInfo.palaceNum);
    const shens = BashenCalculator.calculateShen(jushu, zhiFuInfo.palaceNum);

    // 4. 宫位对应索引 (HTML Grid 顺序通常是左上到右下)
    const gongToIdx = {
        4: 0, 9: 1, 2: 2,
        3: 3, 5: 4, 7: 5,
        8: 6, 1: 7, 6: 8
    };

    const gridItems = document.querySelectorAll('.grid-item');

    // 5. 渲染每一个宫位
    // 修改 ui.js 中的渲染循环部分
for (let gong = 1; gong <= 9; gong++) {
    const idx = gongToIdx[gong];
    const item = gridItems[idx];
    if (!item) continue;

    // 清空旧内容，或者确保你的 HTML 里已经写好了这些 span
    // 建议直接在 HTML 里写好固定结构，JS 只改 textContent
    
    // 八神
    const shenText = shens[gong] || "";
    renderSpan(item, '.shen', shenText, (el) => {
        el.style.color = getShenColor(shenText); // 建议专门写个八神颜色函数
    });

    // 九星
    const starText = stars[gong] || "";
    renderSpan(item, '.star', starText, (el) => {
        el.style.color = "#333"; 
    });

    // 八门 - 关键修复：确保 doors[gong] 有值
    const doorText = doors[gong] || "";
    renderSpan(item, '.door', doorText, (el) => {
        el.style.color = getDoorColor(doorText); 
    });

    // 天盘与地盘
    const tianGan = (gong === 5) ? "" : (tianPanGans[gong] || "");
    const diGan = diPanGans[gong] || "";
    
    renderSpan(item, '.tianpan-gan', tianGan);
    renderSpan(item, '.dipan-gan', diGan);
    };
    }

/**
 * 辅助渲染函数：确保元素存在并更新内容
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

// 导出到全局
window.updateQimen = updateQimen;