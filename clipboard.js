window.addEventListener('load', () => {
    const copyBtn = document.getElementById('copyBtn');
    if (!copyBtn) return;

    let timer = null;
    const originalIcon = '📋'; 

    copyBtn.onclick = function() {
        if (timer) clearTimeout(timer);

        const dateShow = document.getElementById('dateShow');
        const lunarShow = document.getElementById('lunarShow');
        const fullText = `${dateShow.textContent} (${lunarShow.textContent.replace(/\n/g, ' ')})`;
        
        navigator.clipboard.writeText(fullText);
        this.textContent = '✅';
        
        timer = setTimeout(() => {
            this.textContent = originalIcon;
            timer = null;
        }, 200);
    };
});