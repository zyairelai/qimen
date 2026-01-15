// yinyang.js - 奇门遁甲拆补法：阴阳遁判断

const YinYangCalculator = (function() {
    
    // 简化的节气计算逻辑（计算冬至和夏至的近似天文时间）
    // 拆补法的核心：
    // 冬至后（含冬至当天）到夏至前 -> 阳遁
    // 夏至后（含夏至当天）到冬至前 -> 阴遁
    
    function getSolarTerm(year, termIndex) {
        // termIndex: 0 为冬至(上一年的), 12 为夏至, 24 为冬至(当年的)
        // 使用简化的儒略日算法计算 24 节气
        const termNames = ["冬至", "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪"];
        
        // 核心参数：1900年1月0日12:00:00的JD
        const baseDate = new Date(Date.UTC(1900, 0, 0, 6, 2, 5));
        const baseJD = baseDate.getTime();
        
        // 节气公式常数
        const period = 365.2422 * 24 * 60 * 60 * 1000; // 回归年长度
        const offset = [
            0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 
            263431, 286282, 309283, 332410, 355654, 378997, 402454, 426006, 449659, 473384, 497193, 521081
        ];

        // 计算目标年份的节气时间（以毫秒为单位）
        const yearOffset = (year - 1900) * period;
        const termTime = baseJD + yearOffset + offset[termIndex] * 60 * 1000;
        
        return new Date(termTime);
    }

    return {
        /**
         * 核心逻辑：拆补法自动选遁
         * @param {Date} date - 输入的日期对象
         * @returns {string} - "阳遁" 或 "阴遁"
         */
        calculateYinYang: function(date) {
            const year = date.getFullYear();
            
            // 1. 获取当年的夏至 (termIndex 12)
            const summerSolstice = getSolarTerm(year, 12);
            
            // 2. 获取当年的冬至 (termIndex 0)
            const winterSolstice = getSolarTerm(year, 0);
            
            // 3. 获取明年的冬至 (用于下半年判断)
            const nextWinterSolstice = getSolarTerm(year + 1, 0);

            // 拆补法判断逻辑：
            // 如果在今年冬至之后 且 在今年夏至之前 -> 阳遁
            // 如果在今年夏至之后 且 在明年冬至之前 -> 阴遁
            
            if (date >= winterSolstice && date < summerSolstice) {
                return "阳遁";
            } else if (date >= summerSolstice && date < nextWinterSolstice) {
                return "阴遁";
            } else {
                // 处理极年初（即未到今年冬至，属于去年冬至管辖的情况）
                return "阳遁";
            }
        }
    };
})();
