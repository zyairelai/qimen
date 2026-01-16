const YiMaCalculator = {
    zhiToGong: {
        '亥': '乾六宫', '子': '坎一宫', '丑': '艮八宫', '寅': '艮八宫',
        '卯': '震三宫', '辰': '巽四宫', '巳': '巽四宫', '午': '离九宫',
        '未': '坤二宫', '申': '坤二宫', '酉': '兑七宫', '戌': '乾六宫'
    },
    getYiMa: function(dayZhi) {
        let horseZhi = "";
        if (['申', '子', '辰'].includes(dayZhi)) horseZhi = "寅";
        else if (['寅', '午', '戌'].includes(dayZhi)) horseZhi = "申";
        else if (['巳', '酉', '丑'].includes(dayZhi)) horseZhi = "亥";
        else if (['亥', '卯', '未'].includes(dayZhi)) horseZhi = "巳";
        return { zhi: horseZhi, gong: this.zhiToGong[horseZhi] || "未知" };
    }
};

const KongWangCalculator = {
    zhiToGong: {
        '子': '坎一宫', '丑': '艮八宫', '寅': '艮八宫', '卯': '震三宫',
        '辰': '巽四宫', '巳': '巽四宫', '午': '离九宫', '未': '坤二宫',
        '申': '坤二宫', '酉': '兑七宫', '戌': '乾六宫', '亥': '乾六宫'
    },
    getKongWang: function(xunName) {
        const xunToEmpty = {
            '甲子': ['戌', '亥'], '甲戌': ['申', '酉'], '甲申': ['午', '未'],
            '甲午': ['辰', '巳'], '甲辰': ['寅', '卯'], '甲寅': ['子', '丑']
        };
        const emptyZhis = xunToEmpty[xunName] || [];
        return emptyZhis.map(zhi => ({ zhi: zhi, gong: this.zhiToGong[zhi] }));
    }
};