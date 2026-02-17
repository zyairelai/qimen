const JieQiCalculator = (function () {
    const JIEQI_ORDER = [
        '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
        '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
        '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
        '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
    ];

    const JU_DATA = {
        '冬至': { type: '阳', ju: [1, 7, 4] }, '小寒': { type: '阳', ju: [2, 8, 5] }, '大寒': { type: '阳', ju: [3, 9, 6] },
        '立春': { type: '阳', ju: [8, 5, 2] }, '雨水': { type: '阳', ju: [9, 6, 3] }, '惊蛰': { type: '阳', ju: [1, 7, 4] },
        '春分': { type: '阳', ju: [3, 9, 6] }, '清明': { type: '阳', ju: [4, 1, 7] }, '谷雨': { type: '阳', ju: [5, 2, 8] },
        '立夏': { type: '阳', ju: [4, 1, 7] }, '小满': { type: '阳', ju: [5, 2, 8] }, '芒种': { type: '阳', ju: [6, 3, 9] },
        '夏至': { type: '阴', ju: [9, 3, 6] }, '小暑': { type: '阴', ju: [8, 2, 5] }, '大暑': { type: '阴', ju: [7, 1, 4] },
        '立秋': { type: '阴', ju: [2, 5, 8] }, '处暑': { type: '阴', ju: [1, 4, 7] }, '白露': { type: '阴', ju: [9, 3, 6] },
        '秋分': { type: '阴', ju: [7, 1, 4] }, '寒露': { type: '阴', ju: [6, 9, 3] }, '霜降': { type: '阴', ju: [5, 8, 2] },
        '立冬': { type: '阴', ju: [6, 9, 3] }, '小雪': { type: '阴', ju: [5, 8, 2] }, '大雪': { type: '阴', ju: [4, 7, 1] }
    };

    const GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const JIA_ZI = Array.from({ length: 60 }, (_, i) => GAN[i % 10] + ZHI[i % 12]);

    return {
        /**
         * 计算奇门遁甲局数（拆补法）
         * @param {Date} date 标准 JS Date 对象
         */
        calculateJuShu: function (date) {
            if (typeof Lunar === 'undefined') {
                console.error("未检测到 lunar-javascript 库，请先引入。");
                return "需加载Lunar库";
            }

            // 处理 23点（子时）换日逻辑
            let calcDate = date;
            if (date.getHours() === 23) {
                calcDate = new Date(date.getTime() + 3600000);
            }

            const lunarObj = Lunar.fromDate(calcDate);

            // 1. 获取当前节气（拆补法核心：当前时间所在的节气）
            // getPrevJieQi(true) 表示包含当天，确保能拿到当前所属节气
            let jieQi = lunarObj.getPrevJieQi(true);
            const jqSolar = jieQi.getSolar();
            const jqDate = new Date(jqSolar.getYear(), jqSolar.getMonth() - 1, jqSolar.getDay(), jqSolar.getHour(), jqSolar.getMinute(), jqSolar.getSecond());

            // 如果获取到的节气开始时间还没到，则取上一个节气
            if (jqDate.getTime() > calcDate.getTime()) {
                jieQi = lunarObj.getPrevJieQi(false);
            }

            const jqName = jieQi.getName();
            const data = JU_DATA[jqName];

            if (!data) return "未知局数";

            // 2. 获取日干支
            const dayGanZhi = lunarObj.getDayInGanZhi();
            const idx = JIA_ZI.indexOf(dayGanZhi);

            // 3. 计算元：(干支序号 % 15) / 5 -> 0:上元, 1:中元, 2:下元
            // 奇门拆补法中，甲子/甲午/己卯/己酉是符头，刚好对应 15 天一个循环
            const yuanIndex = Math.floor((idx % 15) / 5);
            const num = data.ju[yuanIndex];

            const yuanNames = ["上元", "中元", "下元"];
            return `${data.type}遁${num}局（${jqName}${yuanNames[yuanIndex]}）`;
        }
    };
})();