// ============================================================
// SPARKVERSE HUB — Token Economy + Toast utility
// Depends on: hub-data.js (loaded first)
// ============================================================

const TOKEN_STORAGE_KEY = 'tokens';

// Load current token balance from localStorage.
let tokens = parseInt(localStorage.getItem(TOKEN_STORAGE_KEY), 10) || 0;

function getTokenCount() {
    return tokens;
}

function setTokenDisplay() {
    const counter = document.getElementById('tokenCount');
    if (counter) {
        counter.textContent = tokens;
        counter.setAttribute('aria-label', `${tokens} SPRK tokens`);
    }
}

function earnTokens(amount, reason) {
    tokens += amount;
    localStorage.setItem(TOKEN_STORAGE_KEY, tokens);
    setTokenDisplay();
    showToast(`✦ +${amount} $SPRK: ${reason}`);
}

// Toast notifications
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('out');
        setTimeout(() => toast.remove(), 260);
    }, 3000);
}
