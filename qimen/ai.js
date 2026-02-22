const QimenAI = {
    palaceNames: {
        4: "巽四", 9: "離九", 2: "坤二",
        3: "震三", 5: "中五", 7: "兌七",
        8: "艮八", 1: "坎一", 6: "乾六"
    },

    getMiddleIndicators: function (data) {
        if (!data || typeof data === 'string') return [];
        const indicators = [];

        // 1. 干反吟/伏吟
        const palaceMap = {};
        data.forEach(p => { palaceMap[p.palaceId] = p; });

        // 干伏吟
        let isGanFuYin = true;
        for (const p of data) {
            const g = p.ganCombined.split('+');
            if (g[0] !== g[1]) { isGanFuYin = false; break; }
        }
        if (isGanFuYin) indicators.push("干伏吟");

        // 干反吟 (如果不是伏吟才检测反吟)
        if (!isGanFuYin) {
            const pairs = [[4, 6], [9, 1], [3, 7], [8, 2]];
            let isGanFanYin = true;
            for (const [id1, id2] of pairs) {
                const p1 = palaceMap[id1];
                const p2 = palaceMap[id2];
                if (!p1 || !p2) { isGanFanYin = false; break; }
                const g1 = p1.ganCombined.split('+');
                const g2 = p2.ganCombined.split('+');
                if (!(g1[0] === g2[1] && g1[1] === g2[0])) { isGanFanYin = false; break; }
            }
            if (isGanFanYin) indicators.push("干反吟");
        }

        // 2. 门反吟/伏吟
        const kaiDoor = data.find(p => p.door === "开门");
        if (kaiDoor) {
            if (kaiDoor.palaceId === 4) indicators.push("门反吟");
            else if (kaiDoor.palaceId === 6) indicators.push("门伏吟");
        }

        // 3. 星反吟/伏吟
        const tianPeng = data.find(p => p.star === "天蓬");
        if (tianPeng) {
            if (tianPeng.palaceId === 9) indicators.push("星反吟");
            else if (tianPeng.palaceId === 1) indicators.push("星伏吟");
        }

        return indicators;
    },

    getFormattedPan: function () {
        const data = this.getPanObject();
        if (typeof data === 'string') return data;

        const indicators = this.getMiddleIndicators(data);
        const indicatorsLine = indicators.length > 0 ? "局象：" + indicators.join(' + ') + '\n\n' : "";

        const palaceLines = data.map(p => {
            // New Format: Palace: Gan, Star, Door, Shen
            let line = `${p.palaceName}：${p.ganCombined}，${p.star}，${p.door}，${p.shen}`;

            // Append JiGan (Hidden Stem) for the Rui/Qin palace if it exists
            if (p.isRuiPalace && p.jiGan) {
                line += `（寄${p.jiGan}）`;
            }

            // --- New: Check for Geng + Gui ---
            const gans = p.ganCombined.split('+');
            const tianGan = gans[0] || "";
            const diGan = gans[1] || "";
            const jiGan = p.jiGan || "";
            const hasGengGui = (tianGan === "癸" || diGan === "癸" || jiGan === "癸") &&
                (tianGan === "庚" || diGan === "庚" || jiGan === "庚");
            if (hasGengGui) {
                line += "【庚癸同宫】";
            }

            return line;
        }).join('\n');

        return indicatorsLine + palaceLines;
    },

    getPanObject: function () {
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