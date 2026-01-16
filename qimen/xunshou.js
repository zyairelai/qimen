const XunShouCalculator = (function() {
    const GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const JIA_ZI = Array.from({ length: 60 }, (_, i) => GAN[i % 10] + ZHI[i % 12]);

    // 六甲旬首对应的六仪（用于后期地盘定位）
    const XUN_SHOU_LIU_YI = {
        "甲子": "戊", "甲戌": "己", "甲申": "庚", 
        "甲午": "辛", "甲辰": "壬", "甲寅": "癸"
    };

    return {
        /**
         * 获取时辰所属的旬首
         * @param {string} shiGanZhi - 时辰干支，如 "丙寅"
         * @returns {Object} { name: "甲子", liuYi: "戊" }
         */
        getShiXun: function(shiGanZhi) {
            const idx = JIA_ZI.indexOf(shiGanZhi);
            if (idx === -1) return null;

            // 计算该干支在旬中的偏移量（即天干的索引）
            const offset = idx % 10; 
            // 减去偏移量，得到该旬的起始（甲XX）
            const xunShouName = JIA_ZI[idx - offset];
            
            return {
                name: xunShouName,
                liuYi: XUN_SHOU_LIU_YI[xunShouName]
            };
        }
    };
})();