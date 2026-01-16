/**
 * zhifu.js - 奇门遁甲值符计算器（修正版）
 */

const ZhiFuCalculator = {
    palaceStars: {
        1: "天蓬", 2: "天芮", 3: "天冲", 4: "天辅",
        5: "天禽", 6: "天心", 7: "天柱", 8: "天任", 9: "天英"
    },

    // 六仪映射（用于计算旬首位置）
    liuYiMap: { "戊": 0, "己": 1, "庚": 2, "辛": 3, "壬": 4, "癸": 5 },

    // 地盘三奇六仪排布顺序
    ganOrder: ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"],

    /**
     * 计算值符
     * @param {string} jushuStr - 局数 (如 "阳遁5局")
     * @param {string} xunShouLiuYi - 旬首六仪 (如 "庚")
     * @param {string} shiGan - 时干 (如 "甲" 或 "乙")
     */
    getZhiFu: function(jushuStr, xunShouLiuYi, shiGan) {
        const isYang = jushuStr.includes("阳");
        const juNum = parseInt(jushuStr.replace(/[^0-9]/g, ""));
        const palaceNames = ["", "坎一", "坤二", "震三", "巽四", "中五", "乾六", "兑七", "艮八", "离九"];

        // 1. 确定值符星：旬首地盘落宫对应的原始星
        const xunOffset = this.liuYiMap[xunShouLiuYi];
        let xunShouPalace = isYang ? 
            (juNum + xunOffset - 1) % 9 + 1 : 
            (juNum - xunOffset - 1 + 9) % 9 + 1;
        
        const star = this.palaceStars[xunShouPalace];

        // 2. 确定值符落宫：值符随时干
        // 特殊处理：如果时干是 "甲"，它等同于当前时柱的旬首六仪
        let targetGan = shiGan;
        if (shiGan === "甲") {
            targetGan = xunShouLiuYi;
        }

        const shiGanOffset = this.ganOrder.indexOf(targetGan);
        if (shiGanOffset === -1) return { star, fullTitle: `${star}落宫数据错误` };

        let targetPalace = isYang ?
            (juNum + shiGanOffset - 1) % 9 + 1 :
            (juNum - shiGanOffset - 1 + 9) % 9 + 1;

        // 3. 处理寄宫与格式化
        let displayPalace = palaceNames[targetPalace];
        let fullTitle = "";

        if (targetPalace === 5) {
            // 当落宫在 5 宫时，显示你要求的特殊格式
            displayPalace = "中五宫";
            fullTitle = `${star}落${displayPalace}（寄）坤二宫`;
        } else {
            // 普通宫位显示
            fullTitle = `${star}落${displayPalace}宫`;
        }

        return {
            star: star,
            palace: displayPalace,
            fullTitle: fullTitle
        };
    }
};

window.ZhiFuCalculator = ZhiFuCalculator;