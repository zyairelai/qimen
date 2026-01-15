// --- Calendar Picker ---

function renderCalendar(view = 'days') {
    const daysGrid = document.getElementById('daysGrid');
    const monthText = document.getElementById('selectMonthText');
    const yearText = document.getElementById('selectYearText');
    
    if (!daysGrid || !monthText || !yearText || typeof currentViewDate === 'undefined') return;

    daysGrid.innerHTML = '';
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    monthText.textContent = monthNames[month];
    yearText.textContent = year;

    if (view === 'years') {
        daysGrid.style.gridTemplateColumns = 'repeat(4, 1fr)'; 
        daysGrid.style.maxHeight = '250px';
        daysGrid.style.overflowY = 'auto';

        for (let y = 1949; y <= 2060; y++) {
            const yearEl = document.createElement('div');
            yearEl.className = 'picker-day' + (y === year ? ' selected' : '');
            yearEl.textContent = y;
            yearEl.onclick = (e) => {
                e.stopPropagation();
                currentViewDate.setFullYear(y);
                renderCalendar('months'); 
            };
            daysGrid.appendChild(yearEl);
            if (y === year) {
                setTimeout(() => yearEl.scrollIntoView({ block: 'center', behavior: 'smooth' }), 10);
            }
        }
    } else if (view === 'months') {
        daysGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        daysGrid.style.overflowY = 'hidden';
        monthNames.forEach((name, index) => {
            const monEl = document.createElement('div');
            monEl.className = 'picker-day' + (index === month ? ' selected' : '');
            monEl.textContent = name;
            monEl.onclick = (e) => {
                e.stopPropagation();
                currentViewDate.setMonth(index);
                renderCalendar('days'); 
            };
            daysGrid.appendChild(monEl);
        });
    } else {
        daysGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        daysGrid.style.overflowY = 'hidden';
        
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekDays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'weekday-header';
            dayHeader.style.fontWeight = 'bold';
            dayHeader.textContent = day;
            daysGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) daysGrid.appendChild(document.createElement('div'));

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
}

window.addEventListener('load', () => {
    const titleEl = document.getElementById('monthYearTitle');
    if (titleEl) {
        titleEl.onclick = (e) => {
            e.stopPropagation();
            renderCalendar('years');
        };
    }

    const prevMonth = document.getElementById('prevMonth');
    if (prevMonth) {
        prevMonth.onclick = (e) => {
            e.stopPropagation();
            currentViewDate.setMonth(currentViewDate.getMonth() - 1);
            renderCalendar('days');
        };
    }

    const nextMonth = document.getElementById('nextMonth');
    if (nextMonth) {
        nextMonth.onclick = (e) => {
            e.stopPropagation();
            currentViewDate.setMonth(currentViewDate.getMonth() + 1);
            renderCalendar('days');
        };
    }

    const prevDayBtn = document.getElementById('prevDayBtn');
    if (prevDayBtn) {
        prevDayBtn.onclick = (e) => {
            e.stopPropagation();
            selectedDate.setDate(selectedDate.getDate() - 1);
            if (typeof currentViewDate !== 'undefined') currentViewDate = new Date(selectedDate);
            if (typeof renderUI === 'function') renderUI();
        };
    }

    const nextDayBtn = document.getElementById('nextDayBtn');
    if (nextDayBtn) {
        nextDayBtn.onclick = (e) => {
            e.stopPropagation();
            selectedDate.setDate(selectedDate.getDate() + 1);
            if (typeof currentViewDate !== 'undefined') currentViewDate = new Date(selectedDate);
            if (typeof renderUI === 'function') renderUI();
        };
    }
    
    renderCalendar();
});