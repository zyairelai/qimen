// --- Clipboard Copy Handler ---

window.addEventListener('load', () => {
    const copyBtn = document.getElementById('copyBtn');
    if (!copyBtn) return;

    let timer = null;
    const originalIcon = '📋'; 

    copyBtn.onclick = function() {
        if (timer) clearTimeout(timer);

        const lunarShow = document.getElementById('lunarShow');
        const fullText = lunarShow.textContent; // 只复制三行内容

        navigator.clipboard.writeText(fullText);
        this.textContent = '✅';
        
        timer = setTimeout(() => {
            this.textContent = originalIcon;
            timer = null;
        }, 200);
    };
});
