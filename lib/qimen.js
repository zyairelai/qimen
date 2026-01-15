const QimenEngine = (function() {
    const yangJu = { "冬至": [1, 7, 4], "小寒": [2, 8, 5], "大寒": [3, 9, 6], "立春": [8, 5, 2], "雨水": [9, 6, 3], "惊蛰": [1, 7, 4], "春分": [3, 9, 6], "清明": [4, 1, 7], "谷雨": [5, 2, 8], "立夏": [4, 1, 7], "小满": [5, 2, 8], "芒种": [6, 3, 9] };
    const yinJu = { "夏至": [9, 3, 6], "小暑": [8, 2, 5], "大暑": [7, 1, 4], "立秋": [2, 5, 8], "处暑": [1, 4, 7], "白露": [9, 3, 6], "秋分": [7, 1, 4], "寒露": [6, 9, 3], "霜降": [5, 8, 2], "立冬": [6, 9, 3], "小雪": [5, 8, 2], "大雪": [4, 7, 1] };

    function getJieQiInfo(date) {
        const lunar = Lunar.fromDate(date);
        // 找到当前时间点之前的最近一个节气
        const prevJieQi = lunar.getPrevJieQi(true); 
        const name = prevJieQi.getName();
        const startTime = prevJieQi.getSolar().toDate();
        
        // 精确计算相差天数 (毫秒转天数)
        const diffMs = date.getTime() - startTime.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        // 拆补法：每5天换一元
        let yuanIndex = 0;
        if (diffDays >= 10) {
            yuanIndex = 2; // 下元
        } else if (diffDays >= 5) {
            yuanIndex = 1; // 中元
        } else {
            yuanIndex = 0; // 上元
        }
        
        return { name, yuan: yuanIndex };
    }

    function createDunJu(juNum, isYang) {
        const palace = {};
        const base = {
            1: { star: "天蓬", gate: "休门" }, 2: { star: "天芮", gate: "死门" },
            3: { star: "天冲", gate: "伤门" }, 4: { star: "天辅", gate: "杜门" },
            5: { star: "天禽", gate: "死门" }, 6: { star: "天心", gate: "开门" },
            7: { star: "天柱", gate: "惊门" }, 8: { star: "天任", gate: "生门" },
            9: { star: "天英", gate: "景门" }
        };
        const yiQi = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"];
        for (let i = 1; i <= 9; i++) palace[i] = { ...base[i], qiyi: "" };
        for (let i = 0; i < 9; i++) {
            let pos = isYang ? ((juNum + i - 1) % 9 + 1) : ((juNum - i + 8) % 9 + 1);
            palace[pos].qiyi = yiQi[i];
        }
        return palace;
    }

    return {
        getFullPan: function(date) {
            const dun = YinYangCalculator.calculateYinYang(date);
            const isYang = dun === "阳遁";
            const jq = getJieQiInfo(date);
            
            // 容错处理：如果库返回的节气不在表里，默认冬至
            const juArray = isYang ? (yangJu[jq.name] || yangJu["冬至"]) : (yinJu[jq.name] || yinJu["夏至"]);
            const juNum = juArray[jq.yuan];
            
            return {
                yinyang: dun,
                jieqi: jq.name,
                yuan: ["上元", "中元", "下元"][jq.yuan],
                ju: juNum,
                palace: createDunJu(juNum, isYang)
            };
        },
        getXunShou: function(lunar) {
            const xun = lunar.getTimeXun();
            const map = { "甲子": "戊", "甲戌": "己", "甲申": "庚", "甲午": "辛", "甲辰": "壬", "甲寅": "癸" };
            return map[xun] || "";
        }
    };
})();