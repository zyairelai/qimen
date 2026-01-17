// --- Clipboard Copy Handler ---

window.addEventListener('load', () => {
    const copyBtn = document.getElementById('copyBtn');
    if (!copyBtn) return;

    let timer = null;
    const originalIcon = '📋'; 

    copyBtn.onclick = function() {
        if (timer) clearTimeout(timer);

        // 1. 获取农历基础信息 (lunarShow 里的三行内容)
        const lunarShow = document.getElementById('lunarShow');
        let baseText = lunarShow ? lunarShow.textContent.trim() : "";
        baseText = baseText.replace(/^(西历|农历)：.*$/gm, "").trim();

        // 2. 获取 QimenAI 的排盘内容
        let aiText = "";
        if (typeof QimenAI !== 'undefined' && QimenAI.getFormattedPan) {
            aiText = QimenAI.getFormattedPan();
        }

        // 3. 拼接最终文本：基础内容 + 两个换行 + AI排盘内容
        const fullContent = [baseText, aiText].filter(Boolean).join('\n\n');

        // 执行复制
        navigator.clipboard.writeText(fullContent).then(() => {
            this.textContent = '✅';
            
            timer = setTimeout(() => {
                this.textContent = originalIcon;
                timer = null;
            }, 1000); // 建议反馈时间稍微长一点点，200ms 太快了
        }).catch(err => {
            console.error('复制失败:', err);
        });
    };
});