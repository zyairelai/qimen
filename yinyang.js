// yinyang.js - 奇门遁甲阴阳遁、局数计算（拆补法 + 转盘 + 自动选局）
class YinYangCalculator {
    // 1. 计算指定公历时间的节气信息
    static getSolarTerm(year, month, day, hour) {
        // 简化版：返回节气名称和日期（实际应使用精确天文计算）
        // 这里仅作示例，真实项目需接入完整节气库
        const solarTerms = {
            '立春': [2, 3, 4], '雨水': [2, 18, 19], '惊蛰': [3, 5, 6], '春分': [3, 20, 21],
            '清明': [4, 4, 5], '谷雨': [4, 19, 20], '立夏': [5, 5, 6], '小满': [5, 20, 21],
            '芒种': [6, 5, 6], '夏至': [6, 21, 22], '小暑': [7, 6, 7], '大暑': [7, 22, 23],
            '立秋': [8, 7, 8], '处暑': [8, 22, 23], '白露': [9, 7, 8], '秋分': [9, 22, 23],
            '寒露': [10, 8, 9], '霜降': [10, 23, 24], '立冬': [11, 7, 8], '小雪': [11, 22, 23],
            '大雪': [12, 7, 8], '冬至': [12, 21, 22], '小寒': [1, 5, 6], '大寒': [1, 20, 21]
        };
        
        const date = new Date(year, month - 1, day);
        const dayOfYear = Math.floor((date - new Date(year, 0, 0)) / 86400000);
        
        for (const [term, [termMonth, startDay, endDay]] of Object.entries(solarTerms)) {
            if (month === termMonth && day >= startDay && day <= endDay) {
                return {
                    name: term,
                    date: new Date(year, termMonth - 1, startDay),
                    isMajor: this.isMajorSolarTerm(term) // 区分节和气
                };
            }
        }
        return null;
    }

    // 2. 判断是否为"节"（奇门以节为准）
    static isMajorSolarTerm(term) {
        const majorTerms = ['立春', '惊蛰', '清明', '立夏', '芒种', 
                          '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
        return majorTerms.includes(term);
    }

    // 3. 计算干支（简化版，实际需完整干支计算）
    static calculateGanZhi(year, month, day, hour) {
        // 干支计算简化为示例，真实项目需完整算法
        const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        
        const yearIndex = (year - 4) % 60;
        const gzYear = gan[yearIndex % 10] + zhi[yearIndex % 12];
        
        // 月干支（按节气月）
        const monthGan = gan[(yearIndex % 10 * 2 + month) % 10];
        const gzMonth = monthGan + zhi[(month + 1) % 12];
        
        // 日干支（简化计算）
        const baseDate = new Date(1900, 0, 1);
        const targetDate = new Date(year, month - 1, day);
        const daysDiff = Math.floor((targetDate - baseDate) / 86400000);
        const dayIndex = (daysDiff + 10) % 60;
        const gzDay = gan[dayIndex % 10] + zhi[dayIndex % 12];
        
        // 时干支
        const hourZhi = Math.floor((hour + 1) / 2) % 12;
        const dayGanIndex = dayIndex % 10;
        const hourGanIndex = (dayGanIndex % 5 * 2 + hourZhi) % 10;
        const gzTime = gan[hourGanIndex] + zhi[hourZhi];
        
        return { gzYear, gzMonth, gzDay, gzTime };
    }

    // 4. 拆补法自动选局（核心算法）
    static calculateJuNumber(year, month, day, hour) {
        const date = new Date(year, month - 1, day, hour);
        const dayOfYear = Math.floor((date - new Date(year, 0, 0)) / 86400000);
        
        // 1) 确定阴阳遁
        const solarTerm = this.getSolarTerm(year, month, day, hour);
        let yinYang = '阳遁';
        
        if (solarTerm) {
            const termName = solarTerm.name;
            const yangTerms = ['冬至', '小寒', '大寒', '立春', '雨水', '惊蛰',
                             '清明', '谷雨', '立夏', '小满', '芒种'];
            const yinTerms = ['夏至', '小暑', '大暑', '立秋', '处暑', '白露',
                            '寒露', '霜降', '立冬', '小雪', '大雪'];
            
            if (yinTerms.includes(termName)) {
                yinYang = '阴遁';
            }
            
            // 2) 拆补法：每个节气分为上、中、下三元
            const termsOrder = [
                '冬至', '小寒', '大寒', '立春', '雨水', '惊蛰',
                '春分', '清明', '谷雨', '立夏', '小满', '芒种',
                '夏至', '小暑', '大暑', '立秋', '处暑', '白露',
                '秋分', '寒露', '霜降', '立冬', '小雪', '大雪'
            ];
            
            const termIndex = termsOrder.indexOf(termName);
            if (termIndex !== -1) {
                // 计算该节气中的位置（拆补法）
                const termStart = solarTerm.date;
                const daysInTerm = 15; // 每个节气约15天
                const daysFromTerm = Math.floor((date - termStart) / 86400000);
                
                let yuan; // 上中下三元
                if (daysFromTerm < 5) yuan = '上元';
                else if (daysFromTerm < 10) yuan = '中元';
                else yuan = '下元';
                
                // 3) 计算局数（1-9局）
                let juNumber;
                if (yinYang === '阳遁') {
                    const baseJu = [1, 7, 4, 2, 8, 5, 3, 9, 6];
                    juNumber = baseJu[termIndex % 9];
                    if (yuan === '中元') juNumber = (juNumber % 9) + 1;
                    if (yuan === '下元') juNumber = ((juNumber + 1) % 9) + 1;
                } else {
                    const baseJu = [9, 3, 6, 8, 2, 5, 7, 1, 4];
                    juNumber = baseJu[termIndex % 9];
                    if (yuan === '中元') juNumber = (juNumber % 9) + 1;
                    if (yuan === '下元') juNumber = ((juNumber + 1) % 9) + 1;
                }
                
                return {
                    yinYang,
                    juNumber,
                    solarTerm: termName,
                    yuan,
                    method: '拆补法'
                };
            }
        }
        
        // 默认值（实际不会执行到这里）
        return {
            yinYang,
            juNumber: 1,
            solarTerm: '未知',
            yuan: '上元',
            method: '拆补法'
        };
    }

    // 5. 主计算方法
    static calculateYinYang(gzYear, gzMonth, gzDay, gzTime) {
        // 从干支反推公历时间（简化示例）
        // 实际应用中应直接传入公历时间
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hour = now.getHours();
        
        // 计算阴阳遁和局数
        const result = this.calculateJuNumber(year, month, day, hour);
        
        // 返回格式化的阴阳遁信息
        return `${result.yinYang} ${result.juNumber}局 (${result.solarTerm}${result.yuan})`;
    }

    // 6. 转盘奇门排盘（基础框架）
    static createZhuanPan(result) {
        const { yinYang, juNumber } = result;
        
        // 九宫基础
        const palaceNumbers = [
            [4, 9, 2],
            [3, 5, 7],
            [8, 1, 6]
        ];
        
        // 根据阴阳遁和局数排盘
        let pan = [];
        if (yinYang === '阳遁') {
            // 阳遁顺排
            let start = juNumber;
            for (let i = 0; i < 9; i++) {
                pan.push((start + i - 1) % 9 + 1);
            }
        } else {
            // 阴遁逆排
            let start = juNumber;
            for (let i = 0; i < 9; i++) {
                pan.push((start - i + 8) % 9 + 1);
            }
        }
        
        return {
            yinYang,
            juNumber,
            pan: this.arrangeToPalace(pan),
            method: '转盘奇门'
        };
    }

    // 7. 将局数排列到九宫
    static arrangeToPalace(numbers) {
        return {
            坎一宫: numbers[0],
            坤二宫: numbers[1],
            震三宫: numbers[2],
            巽四宫: numbers[3],
            中五宫: numbers[4],
            乾六宫: numbers[5],
            兑七宫: numbers[6],
            艮八宫: numbers[7],
            离九宫: numbers[8]
        };
    }
}

// 使用示例
if (typeof module !== 'undefined') {
    module.exports = YinYangCalculator;
}