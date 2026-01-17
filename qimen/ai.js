const QimenAI = {
    palaceNames: {
        4: "巽四", 9: "離九", 2: "坤二",
        3: "震三", 5: "中五", 7: "兌七",
        8: "艮八", 1: "坎一", 6: "乾六"
    },

    getFormattedPan: function() {
        const data = this.getPanObject();
        if (typeof data === 'string') return data;

        return data.map(p => {
            // New Format: Palace: Gan, Star, Door, Shen
            let line = `${p.palaceName}：${p.ganCombined}，${p.star}，${p.door}，${p.shen}`;
            
            // Append JiGan (Hidden Stem) for the Rui/Qin palace if it exists
            if (p.isRuiPalace && p.jiGan) {
                line += `（寄${p.jiGan}）`;
            }
            return line;
        }).join('\n');
    },

    getPanObject: function() {
        if (typeof selectedDate === 'undefined') return "请先选择日期";

        const lunar = Lunar.fromDate(selectedDate);
        const jushu = JieQiCalculator.calculateJuShu(selectedDate);
        const shiGanZhi = lunar.getTimeInGanZhi();
        const xunResult = XunShouCalculator.getShiXun(shiGanZhi);
        if (!xunResult) return "旬首计算失败";
        
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

        const zhongWuGan = diPanGans[5] || "戊"; 

        let ruiPalace = 2; 
        for (let i = 1; i <= 9; i++) {
            if ((stars[i] || "").includes("芮")) {
                ruiPalace = i;
                break;
            }
        }

        const sortOrder = [4, 9, 2, 3, 7, 8, 1, 6]; 
        
        return sortOrder.map(gong => {
            const rawStar = stars[gong] || "";
            const isRui = rawStar.includes("芮");
            const tianGan = tianPanGans[gong] || "";
            const diGan = diPanGans[gong] || "";

            return {
                palaceId: gong,
                palaceName: this.palaceNames[gong],
                ganCombined: (tianGan && diGan) ? `${tianGan}+${diGan}` : (tianGan || diGan),
                shen: shens[gong] || "",
                star: isRui ? "禽芮" : rawStar, 
                door: doors[gong] || "",
                isRuiPalace: gong === ruiPalace,
                jiGan: (gong === ruiPalace) ? zhongWuGan : null
            };
        });
    }
};