const StarsCalculator = {
    // 顺时针旋转序列
    starSequence: [
        { name: "天蓬", palace: 1 }, { name: "天任", palace: 8 },
        { name: "天冲", palace: 3 }, { name: "天辅", palace: 4 },
        { name: "天英", palace: 9 }, { name: "天芮", palace: 2 }, 
        { name: "天柱", palace: 7 }, { name: "天心", palace: 6 }
    ],
    palacePath: [1, 8, 3, 4, 9, 2, 7, 6],

    calculateStars: function(zhiFuStarName, targetPalaceNum) {
        let result = { 1:"", 2:"", 3:"", 4:"", 5:"", 6:"", 7:"", 8:"", 9:"" };
        
        let targetPalace = parseInt(targetPalaceNum);
        // 若时干在地盘中五宫，则转到坤二宫
        if (targetPalace === 5) targetPalace = 2;

        let cleanStarName = (zhiFuStarName || "天蓬").substring(0, 2);
        // 天禽跟随天芮
        if (cleanStarName === "天禽") cleanStarName = "天芮";

        let startIndex = this.starSequence.findIndex(s => s.name === cleanStarName);
        let targetPathIndex = this.palacePath.indexOf(targetPalace);

        if (startIndex === -1 || targetPathIndex === -1) return result;

        for (let i = 0; i < 8; i++) {
            let sIdx = (startIndex + i) % 8;
            let pIdx = (targetPathIndex + i) % 8;
            let starName = this.starSequence[sIdx].name;
            let palaceNum = this.palacePath[pIdx];
            result[palaceNum] = starName;
        }

        return result;
    }
};