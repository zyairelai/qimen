const BashenCalculator = {
    godsBaseYin: ["值符", "腾蛇", "太阴", "六合", "白虎", "玄武", "九地", "九天"],
    godsBaseYang: ["值符", "腾蛇", "太阴", "六合", "勾陈", "朱雀", "九地", "九天"],
    
    // 宫位转动路径（顺时针）：坎1-艮8-震3-巽4-离9-坤2-兑7-乾6
    path: [1, 8, 3, 4, 9, 2, 7, 6],

    calculateShen: function(jushu, zhiFuPalaceNum) {
        let result = { 1:"", 2:"", 3:"", 4:"", 5:"", 6:"", 7:"", 8:"", 9:"" };

        const isYang = jushu.includes("阳");
        const currentGods = isYang ? this.godsBaseYang : this.godsBaseYin;

        // 处理中五宫：八神也是随值符（星）走的，如果值符在5，则从2宫起
        let startPalace = parseInt(zhiFuPalaceNum);
        if (startPalace === 5) startPalace = 2;
        
        let pathIdx = this.path.indexOf(startPalace);
        if (pathIdx === -1) return result;

        // 布神逻辑
        for (let i = 0; i < 8; i++) {
            let godName = currentGods[i];
            let currentPalace;
            
            if (isYang) {
                // 阳遁顺行：路径索引递增
                currentPalace = this.path[(pathIdx + i) % 8];
            } else {
                // 阴遁逆行：路径索引递减
                currentPalace = this.path[(pathIdx - i + 8) % 8];
            }
            
            result[currentPalace] = godName;
        }
        return result;
    }
};