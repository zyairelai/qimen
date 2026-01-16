const QimenAI = {
    palaceNames: {
        4: "巽四宮", 9: "離九宮", 2: "坤二宮",
        3: "震三宮", 5: "中五宮", 7: "兌七宮",
        8: "艮八宮", 1: "坎一宮", 6: "乾六宮"
    },

    getFormattedPan: function() {
        // 1. 基础数据校验
        if (typeof selectedDate === 'undefined') return "请先选择日期";

        const lunar = Lunar.fromDate(selectedDate);
        const jushu = JieQiCalculator.calculateJuShu(selectedDate);
        const shiGanZhi = lunar.getTimeInGanZhi();
        const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
        
        if (!xunResult) return "旬首计算失败";
        
        const diPanGans = getDiPan(jushu) || {}; 
        const shiGan = shiGanZhi.charAt(0);

        // 2. 定位时干落宫 (用于星、神)
        let searchGan = (shiGan === "甲") ? xunResult.liuYi : shiGan;
        let targetPalace = 1; 
        for (let i = 1; i <= 9; i++) {
            if (diPanGans[i] === searchGan) {
                targetPalace = i;
                break;
            }
        }

        // 3. 调用各组件 (增加兜底逻辑)
        const tianPanGans = TianPanCalculator.calculateTianPan(jushu, shiGan, xunResult.liuYi) || {};
        const zhiFuInfo = ZhiFuCalculator.getZhiFu(jushu, xunResult.liuYi, shiGan) || {};
        const zhiShiInfo = ZhiShiCalculator.getZhiShi(jushu, xunResult.name, xunResult.liuYi, shiGanZhi.charAt(1)) || {};

        // 4. 核心：处理值使落宫数字
        // 这里的逻辑必须极其稳健
        let zhiShiPalaceNum = zhiShiInfo.targetPalace;
        if (!zhiShiPalaceNum) {
            // 如果 zhiShi.js 没返回 targetPalace，从 title 字符串里抠数字
            const palaceMatch = (zhiShiInfo.fullTitle || "").match(/[一二三四五六七八九1-9]/);
            if (palaceMatch) {
                const cnMap = { "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9 };
                zhiShiPalaceNum = cnMap[palaceMatch[0]] || parseInt(palaceMatch[0]);
            }
        }
        // 最终兜底
        if (!zhiShiPalaceNum) zhiShiPalaceNum = 1;

        // 5. 计算最终分布
        const stars = StarsCalculator.calculateStars(zhiFuInfo.star, targetPalace) || {};
        const shens = BashenCalculator.calculateShen(jushu, targetPalace) || {};
        const doors = BamenCalculator.calculateDoors(zhiShiInfo.door, zhiShiPalaceNum) || {};

        // 6. 渲染输出
        let lines = [];
        const sortOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6]; 

        sortOrder.forEach(gong => {
            const name = this.palaceNames[gong];
            const diGan = diPanGans[gong] || "";
            const tianGan = tianPanGans[gong] || "";
            const shen = shens[gong] || "";
            const star = (stars[gong] || "").includes("芮") ? "禽芮" : (stars[gong] || "");
            const door = doors[gong] || "";

            if (gong === 5) {
                // 中五宫特殊处理
                const jiGongName = "坤二宮";
                lines.push(`${name}：天干${tianGan || '戊'}寄${jiGongName}，地干${diGan}，天禽寄${jiGongName}`);
            } else {
                const details = [
                    tianGan ? `天干${tianGan}` : "",
                    diGan ? `地干${diGan}` : "",
                    door,
                    star,
                    shen
                ].filter(item => item !== "");

                lines.push(`${name}：${details.join('，')}`);
            }
        });

        const finalResult = lines.join('\n');
        return finalResult || "计算结果为空";
    }
};