function renderCalendar() {
    const daysGrid = document.getElementById('daysGrid');
    const monthYearTitle = document.getElementById('monthYearTitle');
    if (!daysGrid || !monthYearTitle || typeof currentViewDate === 'undefined') return;

    daysGrid.innerHTML = '';
    
    // 添加星期表头
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'weekday-header';
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.color = '#666';
        dayHeader.textContent = day;
        daysGrid.appendChild(dayHeader);
    });

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    monthYearTitle.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) { 
        daysGrid.appendChild(document.createElement('div')); 
    }
    
    for (let day = 1; day <= lastDate; day++) {
        const dayEl = document.createElement('div');
        const isSelected = day === selectedDate.getDate() && 
                          month === selectedDate.getMonth() && 
                          year === selectedDate.getFullYear();
        
        dayEl.className = 'picker-day' + (isSelected ? ' selected' : '');
        dayEl.textContent = day;
        dayEl.onclick = (e) => {
            e.stopPropagation();
            selectedDate.setFullYear(year);
            selectedDate.setMonth(month);
            selectedDate.setDate(day);
            if (typeof renderUI === 'function') renderUI();
        };
        daysGrid.appendChild(dayEl);
    }
}

window.addEventListener('load', () => {
    // 点击标题可切换年份 (弹出输入框)
    document.getElementById('monthYearTitle').onclick = () => {
        const newYear = prompt("Enter Year:", currentViewDate.getFullYear());
        if (newYear && !isNaN(newYear)) {
            currentViewDate.setFullYear(parseInt(newYear));
            renderCalendar();
        }
    };

    document.getElementById('prevMonth').onclick = (e) => {
        e.stopPropagation();
        currentViewDate.setMonth(currentViewDate.getMonth() - 1);
        renderCalendar();
    };

    document.getElementById('nextMonth').onclick = (e) => {
        e.stopPropagation();
        currentViewDate.setMonth(currentViewDate.getMonth() + 1);
        renderCalendar();
    };
    
    renderCalendar();
});