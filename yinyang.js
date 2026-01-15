class YinYangCalculator {
    // 天干地支数组
    static TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    static DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 阴阳遁表（根据节气确定）
    static YINYANG_TABLE = {
        // 阳遁：冬至后到夏至前
        'yang': ['冬至', '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种'],
        // 阴遁：夏至后到冬至前
        'yin': ['夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪']
    };

    /**
     * 计算日干支的阴阳属性
     * @param {string} gzYear 年干支
     * @param {string} gzMonth 月干支
     * @param {string} gzDay 日干支
     * @param {string} gzTime 时干支
     * @returns {string} 阴遁 或 阳遁
     */
    static calculateYinYang(gzYear, gzMonth, gzDay, gzTime) {
        // 提取日柱的天干
        const dayGan = gzDay.charAt(0);
        
        // 方法1：根据日干计算阴阳遁（简化算法）
        // 甲、丙、戊、庚、壬 为阳干，乙、丁、己、辛、癸 为阴干
        const yangGan = ['甲', '丙', '戊', '庚', '壬'];
        const yinGan = ['乙', '丁', '己', '辛', '癸'];
        
        if (yangGan.includes(dayGan)) {
            return '阳遁';
        } else if (yinGan.includes(dayGan)) {
            return '阴遁';
        }
        
        // 如果无法确定，使用备用算法
        return this.calculateBySeason(gzMonth);
    }

    /**
     * 根据月份判断季节（简化版，实际应根据节气精确计算）
     * @param {string} gzMonth 月干支
     * @returns {string} 阴遁 或 阳遁
     */
    static calculateBySeason(gzMonth) {
        // 提取地支判断季节
        const dz = gzMonth.charAt(1);
        const dizhiIndex = this.DI_ZHI.indexOf(dz);
        
        // 地支对应的月份（农历正月为寅月）
        // 寅月（2月）到未月（7月）为阳遁
        // 申月（8月）到丑月（1月）为阴遁
        if (dizhiIndex >= 2 && dizhiIndex <= 7) { // 寅到未
            return '阳遁';
        } else {
            return '阴遁';
        }
    }

    /**
     * 综合计算阴阳遁（考虑节气和日干）
     * @param {Date} date 公历日期
     * @param {Object} lunarData 农历数据
     * @param {Object} ganzhiData 干支数据
     * @returns {string} 完整的阴阳遁信息
     */
    static getYinYangDun(date, lunarData, ganzhiData) {
        const { gzYear, gzMonth, gzDay, gzTime } = ganzhiData;
        
        // 1. 先根据日干判断
        const dayGanResult = this.calculateYinYang(gzYear, gzMonth, gzDay, gzTime);
        
        // 2. 根据节气判断（需要节气数据，这里用月份近似）
        const month = date.getMonth() + 1;
        let seasonResult = '';
        
        // 简化节气判断：11月到4月为阳遁，5月到10月为阴遁
        if (month >= 11 || month <= 4) {
            seasonResult = '阳遁';
        } else {
            seasonResult = '阴遁';
        }
        
        // 3. 综合判断（优先使用日干法，如果有冲突可以调整）
        // 这里为了简单，直接使用日干法
        return dayGanResult;
        
        // 如果需要更精确，可以结合节气：
        // return seasonResult;
    }

    /**
     * 获取局数（简化版，根据阴阳遁和日干计算）
     * @param {string} yinyang 阴阳遁
     * @param {string} gzDay 日干支
     * @returns {string} 局数（暂时返回空）
     */
    static getJuShu(yinyang, gzDay) {
        // 这里先不实现完整的局数计算
        // 只返回阴阳遁信息
        return `${yinyang}`;
    }
}

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YinYangCalculator;
}