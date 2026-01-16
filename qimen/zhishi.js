// qimen/zhishi.js

const ZhiShiCalculator = {
    palaceDoors: {
        1: "休门", 2: "死门", 3: "伤门", 4: "杜门",
        5: "死门", 6: "开门", 7: "惊门", 8: "生门", 9: "景门"
    },

    shichenOrder: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],

    getZhiShi: function(jushuStr, xunShouName, xunShouLiuYi, shiZhi) {
        if (!jushuStr || !xunShouName || !xunShouLiuYi) return { door: "未知", fullTitle: "数据不足" };

        const isYang = jushuStr.includes("阳");
        const juNum = parseInt(jushuStr.replace(/[^0-9]/g, ""));
        const palaceNames = ["", "坎一", "坤二", "震三", "巽四", "中五", "乾六", "兑七", "艮八", "离九"];
        const liuYiMap = { "戊": 0, "己": 1, "庚": 2, "辛": 3, "壬": 4, "癸": 5 };

        // 1. 确定值使门（旬首落宫的原始门）
        const xunOffset = liuYiMap[xunShouLiuYi];
        let startPalace = isYang ? 
            (juNum + xunOffset - 1) % 9 + 1 : 
            (juNum - xunOffset - 1 + 9) % 9 + 1;
        
        const doorName = this.palaceDoors[startPalace];

        // 2. 计算时辰偏移量
        const xunZhi = xunShouName.substring(1, 2); 
        const startIndex = this.shichenOrder.indexOf(xunZhi);
        const endIndex = this.shichenOrder.indexOf(shiZhi);
        
        let steps = endIndex - startIndex;
        if (steps < 0) steps += 12;

        // 3. 值使门飞宫
        let targetPalace;
        if (isYang) {
            targetPalace = (startPalace + steps - 1) % 9 + 1;
        } else {
            targetPalace = (startPalace - steps - 1 + 90) % 9 + 1;
        }

        // 4. 格式化
        let fullTitle = "";
        if (targetPalace === 5) {
            fullTitle = `${doorName}落中五宫（寄）坤二宫`;
        } else {
            fullTitle = `${doorName}落${palaceNames[targetPalace]}宫`;
        }

        return { door: doorName, fullTitle: fullTitle };
    }
};

// 关键：确保挂载到全局
window.ZhiShiCalculator = ZhiShiCalculator;