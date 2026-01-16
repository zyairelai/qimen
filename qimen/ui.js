function updateQimen() {
    // 1. 获取当前必要的日期和干支数据
    // 假设 selectedDate 是全局变量，重新生成 lunar 对象以防作用域报错
    const lunar = Lunar.fromDate(selectedDate); 
    const jushu = JieQiCalculator.calculateJuShu(selectedDate);
    const shiGanZhi = lunar.getTimeInGanZhi();
    const shiGan = shiGanZhi.charAt(0); // 提取时干，如 "丙"
    
    // 2. 获取旬首信息
    const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
    if (!xunResult) {
        console.error("无法获取旬首数据");
        return;
    }
    const xunShouLiuYi = xunResult.liuYi; // 提取六仪，如 "庚"

    // 3. 计算地盘和天盘数据
    const diPanGans = getDiPan(jushu);
    // 调用我们之前在 tianpan.js 定义的计算工具
    const tianPanGans = TianPanCalculator.calculateTianPan(jushu, shiGan, xunShouLiuYi);

    // 4. 定义宫位对应关系
    const gongToIdx = {
        4: 0, 9: 1, 2: 2,
        3: 3, 5: 4, 7: 5,
        8: 6, 1: 7, 6: 8
    };

    const gridItems = document.querySelectorAll('.grid-item');

    // 5. 循环渲染每一个宫位
    for (let gong = 1; gong <= 9; gong++) {
        const idx = gongToIdx[gong];
        const item = gridItems[idx];
        if (!item) continue;

        // --- 渲染地盘天干 ---
        const diGan = diPanGans[gong];
        let diPanSpan = item.querySelector('.dipan-gan');
        if (!diPanSpan) {
            diPanSpan = document.createElement('span');
            diPanSpan.className = 'dipan-gan';
            item.appendChild(diPanSpan);
        }
        diPanSpan.textContent = diGan;
        diPanSpan.style.color = typeof getGanColor === 'function' ? getGanColor(diGan) : '#333';

        // --- 渲染天盘天干 ---
        const tianGan = tianPanGans[gong];
        let tianPanSpan = item.querySelector('.tianpan-gan');
        if (!tianPanSpan) {
            tianPanSpan = document.createElement('span');
            tianPanSpan.className = 'tianpan-gan';
            item.appendChild(tianPanSpan);
        }
        
        // 渲染逻辑：如果是中5宫，通常不显示天盘干（已寄往2宫）
        if (gong === 5) {
            tianPanSpan.textContent = "";
        } else {
            tianPanSpan.textContent = tianGan;
            tianPanSpan.style.color = typeof getGanColor === 'function' ? getGanColor(tianGan) : '#ff4444';
        }
    }
}