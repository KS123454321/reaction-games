// 1. 內建免檔案音效產生器 (答對叮咚聲、答錯低音)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    if (type === 'good') {
        // 清脆高音叮咚
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'bad') {
        // 低沉提醒音
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    }
}

// 2. 統一儲存最高分 (傳入遊戲代號與本次分數)
function saveHighScore(gameKey, score) {
    const storageKey = `best_${gameKey}`;
    const currentBest = parseInt(localStorage.getItem(storageKey) || '0', 10);
    if (score > currentBest) {
        localStorage.setItem(storageKey, score);
        return true; // 回傳 true 代表破紀錄！
    }
    return false;
}

// 3. 防誤觸回到首頁
function exitToHome(isPlaying = false) {
    if (isPlaying) {
        if (confirm("遊戲還在進行中，確定要回到首頁嗎？")) {
            window.location.href = "index.html";
        }
    } else {
        window.location.href = "index.html";
    }
}

// 初始化主題（網頁載入時檢查玩家上一次的選擇）
function initTheme() {
    const savedTheme = localStorage.getItem('site_theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

// 切換主題並儲存
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('site_theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('site_theme', 'dark');
    }
}

// 每次網頁打開時自動執行主題套用
window.addEventListener('DOMContentLoaded', initTheme);