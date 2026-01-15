window.addEventListener('load', () => {
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.onclick = function() {
            const dateShow = document.getElementById('dateShow');
            const lunarShow = document.getElementById('lunarShow');
            const fullText = `${dateShow.textContent} (${lunarShow.textContent.replace('\n', ' ')})`;
            
            navigator.clipboard.writeText(fullText);
            const originalText = this.textContent;
            this.textContent = '✅';
            setTimeout(() => { this.textContent = originalText; }, 800);
        };
    }
});