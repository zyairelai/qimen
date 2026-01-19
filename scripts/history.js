// --- History Management Logic ---

const HISTORY_KEY = 'qimen_history';
let currentEditingId = null;

function isStandalone() {
    const isStandaloneMode = (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');
    console.log('PWA Check - display-mode: standalone:', window.matchMedia('(display-mode: standalone)').matches);
    console.log('PWA Check - navigator.standalone:', window.navigator.standalone);
    console.log('PWA Check - referrer:', document.referrer);
    return isStandaloneMode;
}

function checkPWA() {
    const controls = document.getElementById('bottomControls');
    if (!controls) return;

    if (isStandalone()) {
        console.log('PWA detected, showing controls');
        controls.style.setProperty('display', 'flex', 'important');
    } else {
        console.log('PWA not detected, keeping controls hidden');
        // Uncomment the line below if you want to force show them even on web
        // controls.style.setProperty('display', 'flex', 'important');
    }
}

function getHistory() {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderHistoryList() {
    const historyList = document.getElementById('historyList');
    const history = getHistory();
    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<div style="text-align:center; padding: 20px; color: #999;">No saved history</div>';
        return;
    }

    history.sort((a, b) => b.savedAt - a.savedAt);

    history.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.dataset.id = entry.id;
        item.innerHTML = `
            <button class="swipe-delete-btn" title="Delete">🗑️</button>
            <div class="history-item-content">
                <div class="entry-name">${entry.name}</div>
                <div class="entry-date">${entry.dateStr}</div>
            </div>
        `;

        const content = item.querySelector('.history-item-content');
        const deleteBtn = item.querySelector('.swipe-delete-btn');

        let startX = 0;
        let currentX = 0;
        let isSwiping = false;
        const threshold = 40;

        const handleSelect = () => {
            if (item.classList.contains('swiped-left')) {
                item.classList.remove('swiped-left');
                return;
            }
            selectedDate = new Date(entry.timestamp);
            currentViewDate = new Date(selectedDate);
            renderUI();
            closeHistoryModal();
        };

        // Touch events for swiping
        content.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = false;
            // Close any other swiped items
            document.querySelectorAll('.history-item.swiped-left').forEach(el => {
                if (el !== item) el.classList.remove('swiped-left');
            });
        }, { passive: true });

        content.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const diffX = startX - currentX;

            if (diffX > 10) {
                isSwiping = true;
            }
        }, { passive: true });

        content.addEventListener('touchend', (e) => {
            const diffX = startX - e.changedTouches[0].clientX;
            if (diffX > threshold) {
                item.classList.add('swiped-left');
            } else if (diffX < -threshold) {
                item.classList.remove('swiped-left');
            } else if (!isSwiping) {
                handleSelect();
            }
        });

        // Click for desktop support
        content.addEventListener('click', () => {
            if (!isSwiping) handleSelect();
        });

        // Delete action
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentEditingId = entry.id;
            if (confirm("Are you sure you want to delete this entry?")) {
                let history = getHistory();
                history = history.filter(h => h.id !== currentEditingId);
                saveHistory(history);
                renderHistoryList();
            }
            currentEditingId = null;
        });

        historyList.appendChild(item);
    });
}

function openHistoryModal() {
    document.getElementById('historyModal').classList.add('active');
    renderHistoryList();
}

function closeHistoryModal() {
    // Close any open swipe items when closing modal
    document.querySelectorAll('.history-item.swiped-left').forEach(el => el.classList.remove('swiped-left'));
    document.getElementById('historyModal').classList.remove('active');
}

window.saveCurrentDate = () => {
    const name = prompt("Enter Name：");
    if (name === null) return;

    const finalName = name.trim() || `Saved ${new Date().toLocaleString()}`;
    const history = getHistory();

    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const h = String(selectedDate.getHours()).padStart(2, '0');
    const min = String(selectedDate.getMinutes()).padStart(2, '0');

    const newEntry = {
        id: Date.now(),
        name: finalName,
        timestamp: selectedDate.getTime(),
        dateStr: `${y}-${m}-${d} ${h}:${min}`,
        savedAt: Date.now()
    };

    history.push(newEntry);
    saveHistory(history);
};

document.addEventListener('DOMContentLoaded', () => {
    checkPWA();

    document.getElementById('saveBtn').onclick = window.saveCurrentDate;
    document.getElementById('historyBtn').onclick = openHistoryModal;
    document.getElementById('closeHistory').onclick = closeHistoryModal;

    document.getElementById('historyModal').onclick = (e) => {
        if (e.target.id === 'historyModal') {
            closeHistoryModal();
        }
    };

    // Prevent default context menu on the whole modal to be safe
    document.getElementById('historyModal').oncontextmenu = (e) => {
        e.preventDefault();
    };
});
