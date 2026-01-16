/**
 * tianpan.js
 * 依赖：diPanData (来自你的 dipan.js)
 */

const TianPanCalculator = {
    // 奇门遁甲排盘顺时针转动路径（九宫位置）：坎1 -> 艮8 -> 震3 -> 巽4 -> 离9 -> 坤2 -> 兑7 -> 乾6
    // 注意：排盘通常不计中5宫，中5宫寄坤2宫
    rotationalPath: [1, 8, 3, 4, 9, 2, 7, 6],

    /**
     * 计算天盘分布
     * @param {string} jushuStr - "阳遁5局"
     * @param {string} shiGan - 时干（如 "丙"）
     * @param {string} xunShouLiuYi - 旬首对应的六仪（如甲申旬对应 "庚"）
     * @returns {Object} 1-9宫的天盘天干映射
     */
    calculateTianPan: function(jushuStr, shiGan, xunShouLiuYi) {
        const diPan = getDiPan(jushuStr); // 调用你的地盘函数
        const tianPan = Array(10).fill(null);

        // 1. 确定值符所在的地盘原始宫位 (旬首在地盘哪)
        let fromGong = this.findGongByGan(diPan, xunShouLiuYi);
        
        // 2. 确定天盘值符要落到的目标宫位 (时干在地盘哪)
        // 特殊情况：如果时干是"甲"，则寻找旬首六仪所在宫；如果是中5宫，寄2宫
        let targetGan = (shiGan === '甲') ? xunShouLiuYi : shiGan;
        let toGong = this.findGongByGan(diPan, targetGan);
        
        if (toGong === 5) toGong = 2; // 寄宫处理：中五寄坤二
        if (fromGong === 5) fromGong = 2;

        // 3. 计算转动偏移量
        const path = this.rotationalPath;
        const fromIdx = path.indexOf(fromGong);
        const toIdx = path.indexOf(toGong);
        
        // 偏移步数 (to - from)
        const offset = (toIdx - fromIdx + 8) % 8;

        // 4. 根据偏移量，把地盘干映射到天盘
        // 规则：天盘的干 = 原始地盘路径上偏移后的干
        for (let i = 0; i < 8; i++) {
            const currentGong = path[i];
            const sourceGongIdx = (i - offset + 8) % 8;
            const sourceGong = path[sourceGongIdx];
            
            tianPan[currentGong] = diPan[sourceGong];
        }

        // 5. 中五宫天盘通常处理：跟随寄宫（坤二）
        tianPan[5] = tianPan[2];

        return tianPan;
    },

    /**
     * 辅助函数：根据干找宫位
     */
    findGongByGan: function(diPan, gan) {
        for (let i = 1; i <= 9; i++) {
            if (diPan[i] === gan) return i;
        }
        return 2; // 默认容错
    }
};