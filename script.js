let qi = parseInt(localStorage.getItem('qi')) || 0;
let qiPerClick = parseInt(localStorage.getItem('qiPerClick')) || 1;
let prestigePoints = parseInt(localStorage.getItem('prestigePoints')) || 0;
let prestigeBoost = 1 + prestigePoints;

function updateUI() {
    document.getElementById('qi').innerText = qi;
    document.getElementById('qi-per-click').innerText = qiPerClick * prestigeBoost;
    document.getElementById('prestige-points').innerText = prestigePoints;
    document.getElementById('prestige-boost').innerText = prestigeBoost;
}

function gainQi() {
    qi += qiPerClick * prestigeBoost;
    localStorage.setItem('qi', qi);
    updateUI();
}

function prestige() {
    if (qi >= 100) { // Example threshold for prestige
        prestigePoints += 1;
        prestigeBoost = 1 + prestigePoints;
        qi = 0;
        qiPerClick = 1; // Reset upgrades
        localStorage.setItem('prestigePoints', prestigePoints);
        localStorage.setItem('qi', qi);
        localStorage.setItem('qiPerClick', qiPerClick);
        updateUI();
    } else {
        alert('You need at least 100 Qi to Prestige!');
    }
}

// Initialize UI on load
updateUI();
