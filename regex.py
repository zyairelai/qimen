#!/usr/bin/python3

raw = r"""

【易兌 - 論藏甲】 奇門排盤
時家轉盤奇門 拆補起局
西曆：2026-01-07 21:43 星期三
農曆：二〇二五年 冬月十九 亥時
干支：乙巳年 己丑月 辛巳日 己亥時
空亡：寅卯　 午未　 申酉　 辰巳
驛馬：　亥　 　亥　 　亥　 　巳
局數：陽遁二局 旬首：甲午辛
值符：天禽落震三宮 值使：死門落坎一宮

巽四宮：天干：癸,暗干：乙,地干：庚,星：柱,門：休,神：蛇 吉局：|門生宮| 凶局：|六儀擊刑|門入墓| 
離九宮：天干：壬,暗干：丁,地干：丙,星：心,門：生,神：陰 吉局：|宮生門|  
坤二宮：天干：乙,暗干：己,地干：戊,星：蓬,門：傷,神：合  凶局：|乙奇入墓|門入墓|門迫宮| 
震三宮：天干：戊,暗干：壬,地干：己,星：芮,門：開,神：符  凶局：|六儀擊刑|門迫宮| 
中五宮：天干：辛寄震三宮,暗干：辛寄坤二宮,地干：辛,星：禽寄震三宮,
兌七宮：天干：丁,暗干：庚,地干：癸,星：任,門：杜,神：陳 吉局：|三奇升殿| 凶局：|朱雀投江|宮迫門|三奇受制| 
艮八宮：天干：丙,暗干：癸,地干：丁,星：英,門：驚,神：天 吉局：|宮生門| 凶局：|門入墓| 
坎一宮：天干：庚,暗干：戊,地干：乙,星：輔,門：死,神：地 吉局：|奇儀相合| 凶局：|奇格|歲格|門迫宮| 
乾六宮：天干：己,暗干：丙,地干：壬,星：沖,門：景,神：雀  凶局：|門入墓|門迫宮| 

事由：
Alexis IG换照片了

"""

import re

# 神将替换表
shen_map = {
    "玄": "玄武", "虎": "白虎", "陳": "勾陈", "合": "六合", "地": "九地",
    "天": "九天", "陰": "太阴", "符": "值符", "蛇": "腾蛇", "雀": "朱雀" 
}

# 宫位顺序
order = ["巽四宮", "離九宮", "坤二宮", "震三宮", "兌七宮", "艮八宮", "坎一宮", "乾六宮"]
palace_pattern = re.compile(r"(巽四宮|離九宮|坤二宮|震三宮|中五宮|兌七宮|艮八宮|坎一宮|乾六宮)：([^\n]*)")

blocks = dict(palace_pattern.findall(raw))
parsed = {}

# --- 逻辑处理：提取中五宫的寄宫信息 ---
ji_palace = ""
ji_stem = ""
if "中五宮" in blocks:
    target_p = re.search(r"天干：([^寄]+)寄([^,，\s]+)", blocks["中五宮"])
    if target_p:
        ji_stem = target_p.group(1)   # 辛
        ji_palace = target_p.group(2) # 震三宮

for palace, text in blocks.items():
    if palace == "中五宮": continue

    stem = re.search(r"天干：([^,，\s]+)", text)
    stem = stem.group(1) if stem else ""
    earth = re.search(r"地干：([^,，\s]+)", text)
    earth = earth.group(1) if earth else ""
    star = re.search(r"星：([^,，\s]+)", text)
    door = re.search(r"門：([^,，\s]+)", text)
    god  = re.search(r"神：([^,，\s]+)", text)

    star = star.group(1) if star else ""
    door = door.group(1) if door else ""
    god  = god.group(1) if god else ""
    god = shen_map.get(god, god)
    
    parsed[palace] = (stem, earth, door, star, god)

# --- 提取头部基本信息 ---
gz = re.search(r"干支：\s*(.+)", raw).group(1).strip() if re.search(r"干支：\s*(.+)", raw) else ""
kw = re.search(r"空亡：\s*(.+)", raw).group(1).strip() if re.search(r"空亡：\s*(.+)", raw) else ""
ym = re.search(r"驛馬：\s*(.+)", raw).group(1).strip() if re.search(r"驛馬：\s*(.+)", raw) else ""
js_xs = re.search(r"局數：\s*(.+)", raw).group(1).strip() if re.search(r"局數：\s*(.+)", raw) else ""
vf = re.search(r"值符：\s*(.+?)(?=\s*值使：|\n|$)", raw).group(1)
vs = re.search(r"值使：\s*(.+?)(?=\n|$)", raw).group(1)
thing = re.search(r"事由：\s*([\s\S]+)", raw).group(1).strip().replace("\n", " ") if re.search(r"事由：\s*([\s\S]+)", raw) else ""

# 格式化处理：压缩空亡和驿马中的多余空格
kw = " ".join(kw.split())
ym = " ".join(ym.split())

# ---- 输出 ----
print(f"干支：{gz}")
print(f"局数：{js_xs}") # 这一行包含了局数和旬首
print(f"驿马：{ym}")
print(f"空亡：{kw}")
print(f"值符：{vf}")
print(f"值使：{vs}\n")

for p in order:
    stem, earth, door, star, god = parsed.get(p, ("", "", "", "", ""))
    display_p = p.replace("宮", "") # 修正繁体匹配问题
    
    parts = []
    stems_combined = []
    if stem: stems_combined.append(stem)
    if earth: stems_combined.append(earth)
    if stems_combined: parts.append("+".join(stems_combined))

    if star:
        star_name = "禽芮" if star in ("芮", "禽") else f"天{star}"
        parts.append(star_name)
    
    if door: parts.append(f"{door}门")
    
    god_str = god
    if p == ji_palace: god_str += f"（寄{ji_stem}）"
    if god_str: parts.append(god_str)

    if parts: print(f"{display_p}：" + "，".join(parts))

print(f"\n事由：{thing}")