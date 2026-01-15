// --- Yin Yang Base ---

const JIEQI_ORDER = [
  "小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨",
  "立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑",
  "白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"
];

const GANZHI_60 = [
  "甲子","乙丑","丙寅","丁卯","戊辰","己巳","庚午","辛未","壬申","癸酉",
  "甲戌","乙亥","丙子","丁丑","戊寅","己卯","庚辰","辛巳","壬午","癸未",
  "甲申","乙酉","丙戌","丁亥","戊子","己丑","庚寅","辛卯","壬辰","癸巳",
  "甲午","乙未","丙申","丁酉","戊戌","己亥","庚子","辛丑","壬寅","癸卯",
  "甲辰","乙巳","丙午","丁未","戊申","己酉","庚戌","辛亥","壬子","癸丑",
  "甲寅","乙卯","丙辰","丁巳","戊午","己未","庚申","辛酉","壬戌","癸亥"
];

function getGanzhiIndex(gz) {
  return GANZHI_60.indexOf(gz);
}

function isYangDun(lunar) {
  try {
    // Get the solar term name
    let term = "";
    try {
      term = lunar.getJieQi();
    } catch (e) {
      term = lunar.getPrevJie().getName();
    }
    
    const idx = JIEQI_ORDER.indexOf(term);
    const dongzhi = JIEQI_ORDER.indexOf("冬至");
    const xiazhi = JIEQI_ORDER.indexOf("夏至");

    // 冬至→夏至 为阳遁
    if (dongzhi < xiazhi) {
      return idx >= dongzhi || idx < xiazhi;
    } else {
      return idx >= dongzhi && idx < xiazhi;
    }
  } catch (e) {
    console.error("isYangDun error:", e);
    return true;
  }
}

function getJieQiStartDay(lunar) {
  try {
    return lunar.getPrevJie();
  } catch (e) {
    console.error("getJieQiStartDay error:", e);
    return lunar;
  }
}

function calcJu(lunar) {
  try {
    const isYang = isYangDun(lunar);

    const dayGZ = lunar.getDayInGanZhi();
    const dayIndex = getGanzhiIndex(dayGZ);

    const jieQiStart = getJieQiStartDay(lunar);
    const jieQiDayGZ = jieQiStart.getDayInGanZhi();
    const jieQiIndex = getGanzhiIndex(jieQiDayGZ);

    let diff = dayIndex - jieQiIndex;
    if (diff < 0) diff += 60;

    let ju = (diff % 9) + 1;

    // 阴遁要倒序
    if (!isYang) {
      ju = 10 - ju;
    }

    return { isYang, ju };
  } catch (e) {
    console.error("calcJu error:", e);
    return { isYang: true, ju: 1 };
  }
}

const YinYangCalculator = {
  calculateYinYang: function(date) {
    try {
      const lunar = Lunar.fromDate(date);
      const { isYang, ju } = calcJu(lunar);
      return `${isYang ? "阳遁" : "阴遁"}${ju}局`;
    } catch (e) {
      console.error("calculateYinYang error:", e);
      return "计算出错";
    }
  }
};

if (typeof window !== 'undefined') {
  window.YinYangCalculator = YinYangCalculator;
}
