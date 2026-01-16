// bamen.js
const BamenCalculator = {
    // 严格的地盘原始八门顺序（环形顺序）
    doorCircle: ["休门", "生门", "伤门", "杜门", "景门", "死门", "惊门", "开门"],
    // 对应的地盘宫位路径
    palacePath: [1, 8, 3, 4, 9, 2, 7, 6],

    calculateDoors: function(zhiShiDoorName, targetPalaceNum) {
        // 初始化空结果，防止报错导致弹窗不显示
        let result = { 1:"", 2:"", 3:"", 4:"", 5:"", 6:"", 7:"", 8:"", 9:"" };
        
        try {
            // 1. 处理门名称：确保是“惊门”这种格式
            let doorName = (zhiShiDoorName || "");
            if (doorName.length > 2) doorName = doorName.substring(0, 2);
            if (!doorName.endsWith("门")) doorName += "门";

            // 2. 处理落宫：处理中五寄二
            let targetPalace = parseInt(targetPalaceNum);
            if (targetPalace === 5) targetPalace = 2;

            if (isNaN(targetPalace)) {
                console.error("八门落宫参数错误:", targetPalaceNum);
                return result; 
            }

            // 3. 核心计算：找到起始索引
            let doorIdx = this.doorCircle.indexOf(doorName);
            let pathIdx = this.palacePath.indexOf(targetPalace);

            // 如果找不到对应的门，说明传入的值使门名称不对（比如传成了“天柱”）
            if (doorIdx === -1) {
                console.error("未找到该门名称:", doorName);
                return result;
            }

            // 4. 循环分布
            for (let i = 0; i < 8; i++) {
                let currentDoor = this.doorCircle[(doorIdx + i) % 8];
                let currentPalace = this.palacePath[(pathIdx + i) % 8];
                result[currentPalace] = currentDoor;
            }

            // 5. 中五寄宫
            result[5] = "寄" + (result[2] || "");

            return result;
        } catch (e) {
            console.error("BamenCalculator 运行崩溃:", e);
            return result;
        }
    }
};

window.BamenCalculator = BamenCalculator;