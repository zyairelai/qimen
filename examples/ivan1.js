/**
 * 奇门遁甲 - 拆补法定局计算器
 * 依赖: lunar.js (Lunar, SolarUtil)
 */
const YinYangCalculator = (function() {

    // 奇门排盘歌诀数据结构
    // 格式：[上元局数, 中元局数, 下元局数]
    // 阳遁：冬至 ~ 芒种
    const YANG_DUN_MAP = {
        "冬至": [1, 7, 4], "小寒": [2, 8, 5], "大寒": [3, 9, 6],
        "立春": [8, 5, 2], "雨水": [9, 6, 3], "惊蛰": [1, 7, 4],
        "春分": [3, 9, 6], "清明": [4, 1, 7], "谷雨": [5, 2, 8],
        "立夏": [4, 1, 7], "小满": [5, 2, 8], "芒种": [6, 3, 9]
    };

    // 阴遁：夏至 ~ 大雪
    const YIN_DUN_MAP = {
        "夏至": [9, 3, 6], "小暑": [8, 2, 5], "大暑": [7, 1, 4],
        "立秋": [2, 5, 8], "处暑": [1, 4, 7], "白露": [9, 3, 6],
        "秋分": [7, 1, 4], "寒露": [6, 9, 3], "霜降": [5, 8, 2],
        "立冬": [6, 9, 3], "小雪": [5, 8, 2], "大雪": [4, 7, 1]
    };

    /**
     * 获取三元 (上元/中元/下元)
     * 逻辑：寻找当前日期的“符头”
     * 符头：日干为甲(0)或己(5)的日子
     */
    function getSanYuan(lunar) {
        // 获取日柱的干支偏移量 (0-59, 甲子为0)
        // lunar.js 中: getDayGanIndex() 0=甲...9=癸
        // lunar.js 中: getDayZhiIndex() 0=子...11=亥
        
        // 我们需要找到最近的一个“甲”或“己”日
        // 甲(0)到己(5)相差5天，己(5)到甲(0)也是5天循环
        const dayGanIndex = lunar.getDayGanIndex(); 
        const dayZhiIndex = lunar.getDayZhiIndex();

        // 计算当前日干 距离 最近符头(甲/己) 的天数差
        // 如果日干是 0(甲), 1(乙), 2(丙), 3(丁), 4(戊) -> 符头是甲，差值为 index
        // 如果日干是 5(己), 6(庚), 7(辛), 8(壬), 9(癸) -> 符头是己，差值为 index - 5
        const offset = dayGanIndex % 5;

        // 符头的地支索引 = (当前地支索引 - 差值 + 12) % 12
        const fuTouZhiIndex = (dayZhiIndex - offset + 12) % 12;

        // 根据符头地支判断元
        // 子午卯酉(0,6,3,9) -> 上元 (索引0)
        // 寅申巳亥(2,8,5,11) -> 中元 (索引1)
        // 辰戌丑未(4,10,1,7) -> 下元 (索引2)
        if ([0, 6, 3, 9].includes(fuTouZhiIndex)) {
            return 0; // 上元
        } else if ([2, 8, 5, 11].includes(fuTouZhiIndex)) {
            return 1; // 中元
        } else {
            return 2; // 下元
        }
    }

    /**
     * 计算阴阳局
     * @param {Date} date - Javascript Date对象
     * @returns {String} 例如 "阴遁五局"
     */
    function calculateYinYang(date) {
        // 1. 处理晚子时 (23:00 - 23:59)
        // 奇门遁甲中，23点算作第二天的子时，日干支需要按第二天算
        let adjustDate = new Date(date.getTime());
        if (date.getHours() >= 23) {
            adjustDate.setTime(date.getTime() + 60 * 60 * 1000);
        }

        // 2. 获取 Lunar 对象
        const lunar = Lunar.fromDate(adjustDate);

        // 3. 获取当前包含的节气 (拆补法的核心：严格按节气时间走)
        // getPrevJieQi(true) 获取当前时刻所属的节气（如果当前就是节气交接日，true表示包含今天）
        const currentJieQi = lunar.getPrevJieQi(true); 
        const jieQiName = currentJieQi.getName();

        // 4. 计算三元 (0=上, 1=中, 2=下)
        const yuanIndex = getSanYuan(lunar);
        const yuanName = ["上元", "中元", "下元"][yuanIndex]; // 仅作调试或显示用

        // 5. 查表定局
        let dunType = ""; // 阴遁/阳遁
        let juArr = [];   // 局数数组

        if (YANG_DUN_MAP[jieQiName]) {
            dunType = "阳遁";
            juArr = YANG_DUN_MAP[jieQiName];
        } else if (YIN_DUN_MAP[jieQiName]) {
            dunType = "阴遁";
            juArr = YIN_DUN_MAP[jieQiName];
        } else {
            // 理论上不会走到这里，除非节气名不对
            return "未知局";
        }

        // 6. 获取局数
        const juNum = juArr[yuanIndex];
        
        // 转换数字为中文
        const cnNums = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        
        return `${dunType}${cnNums[juNum]}局`;
    }

    return {
        calculateYinYang: calculateYinYang
    };

})();