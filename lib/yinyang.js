/**
 * 奇门遁甲阴阳局数计算 (标准拆补法)
 * 逻辑：交节时刻起换节气，每5天(120小时)严格切换元
 */
class YinYangCalculator {
  static JIEQI_JU_MAP = {
    '冬至': [1, 7, 4], '小寒': [2, 8, 5], '大寒': [3, 9, 6],
    '立春': [8, 5, 2], '雨水': [9, 6, 3], '惊蛰': [1, 7, 4],
    '春分': [3, 9, 6], '清明': [4, 1, 7], '谷雨': [5, 2, 8],
    '立夏': [4, 1, 7], '小满': [5, 2, 8], '芒种': [6, 3, 9],
    '夏至': [-9, -3, -6], '小暑': [-8, -2, -5], '大暑': [-7, -1, -4],
    '立秋': [-2, -5, -8], '处暑': [-1, -4, -7], '白露': [-9, -3, -6],
    '秋分': [-7, -1, -4], '寒露': [-6, -9, -3], '霜降': [-5, -8, -2],
    '立冬': [-6, -9, -3], '小雪': [-5, -8, -2], '大雪': [-4, -7, -1]
  };

  /**
   * 计算遁局
   * @param {Date} date 包含时分的日期对象
   */
  static calculateYinYang(date) {
    try {
      // 1. 获取当前时间的 Solar 对象
      const solar = Solar.fromDate(date);
      const lunar = solar.getLunar();
      
      // 2. 获取当前时刻所属的节气（精确到秒）
      // getPrevJieQi(true) 返回当前时间点之前最近的一个节气
      const prevJieQi = lunar.getPrevJieQi(true);
      const jieQiName = prevJieQi.getName();
      
      // 3. 计算从交节那一刻到现在过了多少小时
      // 拆补法：5天一元，即 120 小时一换元
      const startTime = prevJieQi.getSolar().getCalendar().getTime();
      const currentTime = date.getTime();
      const diffInHours = (currentTime - startTime) / (1000 * 60 * 60);
      
      // 4. 确定上中下元
      let yuanIndex;
      if (diffInHours < 120) {
        yuanIndex = 0; // 上元 (0-5天)
      } else if (diffInHours < 240) {
        yuanIndex = 1; // 中元 (5-10天)
      } else {
        yuanIndex = 2; // 下元 (10天以后直到下个节气)
      }

      // 5. 获取局数
      const juConfig = this.JIEQI_JU_MAP[jieQiName];
      if (!juConfig) return "节气映射错误";
      
      const juNum = juConfig[yuanIndex];
      const type = juNum > 0 ? '阳' : '阴';

      return `${type}遁${Math.abs(juNum)}局`;
    } catch (e) {
      console.error(e);
      return '计算出错';
    }
  }
}