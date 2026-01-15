## 因命风后演成文，遁甲奇门从此始。

### TO-DO
- 阴遁阳遁
- 局数
- 旬首
- 值符
- 值使
- 地盘干
- 天盘干
- 八门
- 九星
- 八神

```
  lunarShow.textContent = [
      `西历：${y}-${m}-${d} ${h}:${min} ${weekDay}`,
      `农历：${selectedDate.getFullYear()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      `干支：${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${dayLunar.getDayInGanZhi()}日 ${lunar.getTimeInGanZhi()}时`,
      `局数：${yinyang}`,
      `旬首：`,
      `值符：`,
      `值使：`
  ].join('\n');
```
