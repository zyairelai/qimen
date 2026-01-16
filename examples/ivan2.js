/**
 * 奇门遁甲 - 拆补法定局计算器 (YinYangCalculator)
 * 依赖: lunar.js
 * 逻辑: 严格遵循拆补法，根据节气和日柱符头定局
 */
(function(global) {
    // 1. 阳遁歌诀：冬至、小寒...芒种
    // 格式：[上元局数, 中元局数, 下元局数]
    const YANG_DUN = {
        "冬至": [1, 7, 4], "小寒": [2, 8, 5], "大寒": [3, 9, 6],
        "立春": [8, 5, 2], "雨水": [9, 6, 3], "惊蛰": [1, 7, 4],
        "春分": [3, 9, 6], "清明": [4, 1, 7], "谷雨": [5, 2, 8],
        "立夏": [4, 1, 7], "小满": [5, 2, 8], "芒种": [6, 3, 9]
    };

    // 2. 阴遁歌诀：夏至、小暑...大雪
    const YIN_DUN = {
        "夏至": [9, 3, 6], "小暑": [8, 2, 5], "大暑": [7, 1, 4],
        "立秋": [2, 5, 8], "处暑": [1, 4, 7], "白露": [9, 3, 6],
        "秋分": [7, 1, 4], "寒露": [6, 9, 3], "霜降": [5, 8, 2],
        "立冬": [6, 9, 3], "小雪": [5, 8, 2], "大雪": [4, 7, 1]
    };

    // 中文数字映射
    const CN_NUM = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

    const YinYangCalculator = {
        /**
         * 计算当前日期的上中下元
         * 原理：寻找日干支的符头 (甲或己)
         * 子午卯酉为上元，寅申巳亥为中元，辰戌丑未为下元
         */
        getSanYuan: function(lunarDate) {
            // lunar.js: getDayGanIndex() 0=甲, 1=乙... 
            // lunar.js: getDayZhiIndex() 0=子, 1=丑...
            var ganIdx = lunarDate.getDayGanIndex();
            var zhiIdx = lunarDate.getDayZhiIndex();

            // 计算日干距离最近符头(甲0/己5)的偏移量
            // 甲(0)-己(5) 为一轮，故取模5
            var offset = ganIdx % 5;

            // 倒推符头的地支索引
            // +12 防止负数
            var fuTouZhiIdx = (zhiIdx - offset + 12) % 12;

            // 判断元
            // 上元：子(0) 午(6) 卯(3) 酉(9)
            if ([0, 3, 6, 9].includes(fuTouZhiIdx)) return 0;
            // 中元：寅(2) 申(8) 巳(5) 亥(11)
            if ([2, 5, 8, 11].includes(fuTouZhiIdx)) return 1;
            // 下元：辰(4) 戌(10) 丑(1) 未(7)
            return 2;
        },

        /**
         * 主计算函数
         * @param {Date} date - 标准JS Date对象
         * @returns {String} 如 "阴遁五局"
         */
        calculateYinYang: function(date) {
            // 步骤1：获取用于计算“元”的Lunar对象
            // 奇门排盘中，23:00即进入下一天的子时，日柱需按第二天算
            // 我们不改变传入的date对象，而是复制一份时间戳
            var checkTime = date.getTime();
            if (date.getHours() >= 23) {
                checkTime += 60 * 60 * 1000; // 加1小时进入第二天
            }
            var dayLunar = Lunar.fromDate(new Date(checkTime));

            // 步骤2：获取用于计算“节气”的Lunar对象
            // 拆补法：严格按物理时间落入的节气计算，不换日
            // 比如 23:30 还没到下个节气，就按当前节气算
            var currentLunar = Lunar.fromDate(date); 
            // getPrevJieQi(true) 获取当前时刻所属的节气 (true表示包含当天/当分秒)
            var jieQi = currentLunar.getPrevJieQi(true); 
            var jieQiName = jieQi.getName();

            // 步骤3：计算三元 (0=上, 1=中, 2=下)
            var yuanIdx = this.getSanYuan(dayLunar);

            // 步骤4：查表
            var dunType = ""; // 阴/阳
            var juNum = 0;    // 局数

            if (YANG_DUN.hasOwnProperty(jieQiName)) {
                dunType = "阳遁";
                juNum = YANG_DUN[jieQiName][yuanIdx];
            } else if (YIN_DUN.hasOwnProperty(jieQiName)) {
                dunType = "阴遁";
                juNum = YIN_DUN[jieQiName][yuanIdx];
            } else {
                return "未知局"; // 理论上不会发生，除非lunar.js节气名变了
            }

            return dunType + CN_NUM[juNum] + "局";
        }
    };

    // 暴露给全局
    global.YinYangCalculator = YinYangCalculator;

})(this);