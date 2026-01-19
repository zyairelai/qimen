// --- History Management Logic ---

const HISTORY_KEY = 'qimen_history';
let currentEditingId = null;
let longPressTimer = null;
let isLongPressing = false;
let touchStartX = 0;
let touchStartY = 0;

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
        item.innerHTML = `
      <div class="entry-name">${entry.name}</div>
      <div class="entry-date">${entry.dateStr}</div>
    `;

        // We use touchend and mouseup to handle the "click" to avoid conflicts with long press
        const handleSelect = (e) => {
            if (isLongPressing) return;
            selectedDate = new Date(entry.timestamp);
            currentViewDate = new Date(selectedDate);
            renderUI();
            closeHistoryModal();
        };

        item.onmousedown = (e) => startLongPress(e, entry);
        item.ontouchstart = (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            startLongPress(e, entry);
        };

        item.onmousemove = clearLongPress;
        item.ontouchmove = (e) => {
            // If moved too much, cancel long press
            const moveX = Math.abs(e.touches[0].clientX - touchStartX);
            const moveY = Math.abs(e.touches[0].clientY - touchStartY);
            if (moveX > 10 || moveY > 10) {
                clearLongPress();
            }
        };

        item.onmouseup = (e) => {
            if (!isLongPressing && longPressTimer) {
                handleSelect(e);
            }
            clearLongPress();
        };

        item.ontouchend = (e) => {
            if (!isLongPressing && longPressTimer) {
                handleSelect(e);
                e.preventDefault(); // Prevent ghost click
            }
            clearLongPress();
        };

        item.onmouseleave = clearLongPress;

        historyList.appendChild(item);
    });
}

function startLongPress(e, entry) {
    clearLongPress();
    isLongPressing = false;
    longPressTimer = setTimeout(() => {
        isLongPressing = true;
        showContextMenu(entry);
    }, 600);
}

function clearLongPress() {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    // We don't reset isLongPressing here immediately because we need it in onmouseup/touchend
    // It's reset at the start of startLongPress
}

function showContextMenu(entry) {
    currentEditingId = entry.id;
    const menu = document.getElementById('editDeleteMenu');
    menu.classList.add('active');

    // Provide haptic feedback if available
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
}

function hideContextMenu() {
    const menu = document.getElementById('editDeleteMenu');
    menu.classList.remove('active');
    currentEditingId = null;
    setTimeout(() => { isLongPressing = false; }, 100);
}

function openHistoryModal() {
    document.getElementById('historyModal').classList.add('active');
    renderHistoryList();
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('active');
}

window.saveCurrentDate = () => {
    const name = prompt("Enter Name for this date:");
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

    document.getElementById('cancelMenuBtn').onclick = hideContextMenu;

    document.getElementById('deleteEntryBtn').onclick = (e) => {
        e.stopPropagation();
        if (!currentEditingId) return;
        if (confirm("Are you sure you want to delete this entry?")) {
            let history = getHistory();
            history = history.filter(h => h.id !== currentEditingId);
            saveHistory(history);
            renderHistoryList();
            hideContextMenu();
        }
    };

    document.getElementById('editEntryBtn').onclick = (e) => {
        e.stopPropagation();
        if (!currentEditingId) return;
        const history = getHistory();
        const entry = history.find(h => h.id === currentEditingId);
        if (entry) {
            const newName = prompt("Edit Name:", entry.name);
            if (newName !== null && newName.trim() !== "") {
                entry.name = newName.trim();
                saveHistory(history);
                renderHistoryList();
            }
        }
        hideContextMenu();
    };

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
