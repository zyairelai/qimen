const WUXING_COLORS = {
    "金": "#d97706", // 琥珀金，比纯黄更易读
    "木": "#16a34a", // 森林绿
    "水": "#2563eb", // 蓝宝石色
    "火": "#dc2626", // 鲜红色
    "土": "#78350f"  // 褐色
};

const ELEMENT_MAPPING = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
    "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水",
    "天蓬": "水", "天芮": "土", "天冲": "木", "天辅": "木", "天禽": "土",
    "天心": "金", "天柱": "金", "天任": "土", "天英": "火", "禽芮": "土",
    "休门": "水", "生门": "土", "伤门": "木", "杜门": "木",
    "景门": "火", "死门": "土", "惊门": "金", "开门": "金",
    "值符": "木", "腾蛇": "火", "太阴": "金", "六合": "木", "白虎": "金",
    "玄武": "水", "九地": "土", "九天": "金", "勾陈": "土", "朱雀": "火"
};

function getColor(name) {
    if (!name) return "#64748b";
    
    // 移除可能的空格和特殊字符（如“芮/禽”中的斜杠）
    const cleanName = name.trim().split('/')[0]; 
    
    // 直接从映射表找
    const wuxing = ELEMENT_MAPPING[cleanName];
    
    // 如果直接找不到（比如“天芮/禽”只取前两个字尝试）
    if (!wuxing) {
        const shortName = cleanName.substring(0, 2);
        const altWuxing = ELEMENT_MAPPING[shortName];
        return WUXING_COLORS[altWuxing] || "#64748b";
    }

    return WUXING_COLORS[wuxing] || "#64748b";
}