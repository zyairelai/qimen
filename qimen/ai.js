const QimenAI = {
    palaceNames: {
        4: "巽四", 9: "離九", 2: "坤二",
        3: "震三", 5: "中五", 7: "兌七",
        8: "艮八", 1: "坎一", 6: "乾六"
    },

    getFormattedPan: function() {
        if (typeof selectedDate === 'undefined') return "请先选择日期";

        const lunar = Lunar.fromDate(selectedDate);
        const jushu = JieQiCalculator.calculateJuShu(selectedDate);
        const shiGanZhi = lunar.getTimeInGanZhi();
        const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
        if (!xunResult) return "旬首计算失败";
        
        // 1. 获取地盘，这是获取中五原始天干的关键
        const diPanGans = getDiPan(jushu) || {}; 
        const shiGan = shiGanZhi.charAt(0);

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

        let zhiShiPalaceNum = zhiShiInfo.targetPalace || 1;
        const stars = StarsCalculator.calculateStars(zhiFuInfo.star, targetPalace) || {};
        const shens = BashenCalculator.calculateShen(jushu, targetPalace) || {};
        const doors = BamenCalculator.calculateDoors(zhiShiInfo.door, zhiShiPalaceNum) || {};

        // --- 核心逻辑：动态定位寄宫与天禽 ---
        
        // 获取中五宫的地盘天干（寄干）
        const zhongWuGan = diPanGans[5] || "戊"; 

        // 找到天芮星所在的宫位
        let ruiPalace = 2; // 默认坤二
        for (let i = 1; i <= 9; i++) {
            if ((stars[i] || "").includes("芮")) {
                ruiPalace = i;
                break;
            }
        }

        let lines = [];
        // 渲染顺序：九宫格排布通常按：巽-离-坤 / 震-兑 / 艮-坎-乾
        const sortOrder = [4, 9, 2, 3, 7, 8, 1, 6]; 

        sortOrder.forEach(gong => {
            const name = this.palaceNames[gong];
            const diGan = diPanGans[gong] || "";
            const tianGan = tianPanGans[gong] || "";
            const shen = shens[gong] || "";
            const door = doors[gong] || "";
            
            // 处理星体显示
            const rawStar = stars[gong] || "";
            const isRui = rawStar.includes("芮");
            const starDisplay = isRui ? "天芮" : rawStar;

            // 基础组合：天干+地干
            const ganCombined = (tianGan && diGan) ? `${tianGan}+${diGan}` : (tianGan || diGan);
            
            let details = [ganCombined, door, starDisplay, shen];

            // 动态判断：如果是天芮星所在的宫位，拉取中五寄宫信息
            if (gong === ruiPalace) {
                // 将寄干和天禽星合并显示
                details.push(`（寄${zhongWuGan}、天禽）`);
            }

            // 过滤空值并合并
            const lineText = `${name}：${details.filter(Boolean).join('，')}`
                .replace('，（', '（'); 
                
            lines.push(lineText);
        });

        return lines.join('\n');
    }
};