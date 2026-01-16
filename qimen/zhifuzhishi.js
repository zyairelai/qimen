/**
 * 奇门遁甲值符值使计算器
 */
const ZhiFuZhiShiCalculator = {
    // 九星
    stars: ["天蓬", "天芮", "天冲", "天辅", "天禽", "天心", "天柱", "天任", "天英"],
    // 八门
    gates: ["休门", "死门", "伤门", "杜门", "", "开门", "惊门", "生门", "景门"],
    // 九宫对应下标 (洛书轨迹)
    gongOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    // 八卦宫名
    gongNames: ["", "坎一宫", "坤二宫", "震三宫", "巽四宫", "中五宫", "乾六宫", "兑七宫", "艮八宫", "离九宫"],

    /**
     * 计算函数
     * @param {string} jushu 局数，如 "阳遁一局" 或 "阴遁九局"
     * @param {string} xunShou 旬首名，如 "甲子"
     * @param {string} liuYi 旬首所带六仪，如 "戊"
     * @param {string} shiGanZhi 时柱干支，如 "丙辛"
     */
    calculate: function(jushu, xunShou, liuYi, shiGanZhi) {
        const isYang = jushu.includes("阳");
        const juNumMatch = jushu.match(/\d+/);
        if (!juNumMatch) {
            throw new Error("无法解析局数: " + jushu);
        }
        const juNum = parseInt(juNumMatch[0]);
        const shiGan = shiGanZhi.substring(0, 1);
        const shiZhi = shiGanZhi.substring(1, 2);

        // 1. 定地盘旬首落宫 (根据局数和六仪推算)
        // 六仪在排盘中的顺序：戊、己、庚、辛、壬、癸
        const liuYiOrder = ["戊", "己", "庚", "辛", "壬", "癸"];
        const liuYiIdx = liuYiOrder.indexOf(liuYi);
        if (liuYiIdx === -1) {
            throw new Error("无效的六仪: " + liuYi);
        }
        
        let xunShouGong; // 旬首地盘落宫
        if (isYang) {
            xunShouGong = ((juNum + liuYiIdx - 1) % 9) + 1;
        } else {
            xunShouGong = ((juNum - liuYiIdx - 1 + 9) % 9);
            if (xunShouGong === 0) xunShouGong = 9;
        }

        // 2. 确定初始星、门
        // 星门对应的原始宫位：1坎, 2坤, 3震, 4巽, 5中, 6乾, 7兑, 8艮, 9离
        const starMap = ["", "天蓬", "天芮", "天冲", "天辅", "天禽", "天心", "天柱", "天任", "天英"];
        const gateMap = ["", "休门", "死门", "伤门", "杜门", "死门", "开门", "惊门", "生门", "景门"];
        
        const originStar = starMap[xunShouGong];
        const originGate = gateMap[xunShouGong];

        // 3. 计算值符落宫 (值符随时干)
        // 找到时干在地盘的宫位
        // 十天干顺序：甲、乙、丙、丁、戊、己、庚、辛、壬、癸
        const ganOrder = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        const shiGanIdx = ganOrder.indexOf(shiGan);
        
        // 如果时干是甲（旬首），值符在原地
        // 如果时干是六仪（戊己庚辛壬癸），按六仪所在宫位
        // 如果时干是乙丙丁，则需要按特殊规则（通常按时干对应宫位）
        let fuGong;
        if (shiGan === "甲") {
            fuGong = xunShouGong; // 甲时（旬首时）星在原地
        } else {
            // 时干在六仪中，按六仪宫位
            const liuYiGanIdx = liuYiOrder.indexOf(shiGan);
            if (liuYiGanIdx >= 0) {
                if (isYang) {
                    fuGong = ((juNum + liuYiGanIdx - 1) % 9) + 1;
                } else {
                    fuGong = ((juNum - liuYiGanIdx - 1 + 9) % 9);
                    if (fuGong === 0) fuGong = 9;
                }
            } else {
                // 时干是乙丙丁，按天干顺序推算
                // 乙丙丁对应2,3,4宫（相对于甲1宫）
                const ganOffset = shiGanIdx;
                if (isYang) {
                    fuGong = ((xunShouGong + ganOffset - 1) % 9) + 1;
                } else {
                    fuGong = ((xunShouGong - ganOffset - 1 + 9) % 9);
                    if (fuGong === 0) fuGong = 9;
                }
            }
        }

        // 4. 计算值使落宫 (值使随时支)
        // 支数：子1, 丑2...亥12
        const zhiOrder = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        const xunShouZhi = xunShou.substring(1, 2);
        const startZhiIdx = zhiOrder.indexOf(xunShouZhi);
        const targetZhiIdx = zhiOrder.indexOf(shiZhi);
        if (startZhiIdx === -1) {
            throw new Error("无效的旬首地支: " + xunShouZhi);
        }
        if (targetZhiIdx === -1) {
            throw new Error("无效的时支: " + shiZhi);
        }
        const step = (targetZhiIdx - startZhiIdx + 12) % 12;

        let shiGong;
        if (isYang) {
            shiGong = ((xunShouGong + step - 1) % 9) + 1;
        } else {
            shiGong = ((xunShouGong - step - 1 + 9) % 9);
            if (shiGong === 0) shiGong = 9;
        }

        return {
            zhifu: `${originStar}落${this.gongNames[fuGong]}`,
            zhishi: `${originGate}落${this.gongNames[shiGong]}`
        };
    }
};

export default ZhiFuZhiShiCalculator;