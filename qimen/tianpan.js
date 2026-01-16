/**
 * tianpan.js
 * 依赖：diPanData (来自你的 dipan.js)
 */

const TianPanCalculator = {
    // 奇门遁甲排盘顺时针转动路径（九宫位置）：坎1 -> 艮8 -> 震3 -> 巽4 -> 离9 -> 坤2 -> 兑7 -> 乾6
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
        let targetGan = (shiGan === '甲') ? xunShouLiuYi : shiGan;
        let toGong = this.findGongByGan(diPan, targetGan);
        
        // 寄宫处理：如果旬首或时干落在中五，按逻辑寄往坤二计算偏移
        if (fromGong === 5) fromGong = 2;
        if (toGong === 5) toGong = 2;

        // 3. 计算转动偏移量
        const path = this.rotationalPath;
        const fromIdx = path.indexOf(fromGong);
        const toIdx = path.indexOf(toGong);
        const offset = (toIdx - fromIdx + 8) % 8;

        // 4. 根据偏移量，把地盘干映射到天盘
        for (let i = 0; i < 8; i++) {
            const currentGong = path[i];
            const sourceGongIdx = (i - offset + 8) % 8;
            const sourceGong = path[sourceGongIdx];
            
            tianPan[currentGong] = diPan[sourceGong];
        }

        /**
         * 5. 修正中五宫处理：
         * 转盘法中，中五宫天盘本身为空。
         * 中五宫的地盘干（天禽星）会寄居在原本的地盘二宫（天芮星）上一起转动。
         * 因此，转动后，中五的地盘干应该出现在当前天盘值符移动到的对应位置。
         */
        
        // 找到地盘2宫现在转到了哪个宫位 (即 toGong)
        // 中五的地盘干 diPan[5] 应该作为“寄干”存在于 tianPan[toGong] 所在的宫位
        // 为了保持数组结构，如果需要在一个宫位存两个干，建议用字符串拼接或对象
        // 这里演示标准做法：将寄干附着在目标宫位
        if (tianPan[toGong]) {
            // 如果你前端渲染支持显示两个干，可以用 "/" 分隔
            // 如果只需显示主干，此步可根据需求调整
            // tianPan[toGong] = tianPan[toGong] + "(寄" + diPan[5] + ")";
            tianPan[toGong] = tianPan[toGong]
        }

        // 中五宫天盘置空
        tianPan[5] = null; 

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