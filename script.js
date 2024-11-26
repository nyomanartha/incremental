let qi = parseInt(localStorage.getItem('qi')) || 0;
let qiPerClick = parseInt(localStorage.getItem('qiPerClick')) || 1;
let combatPower = parseInt(localStorage.getItem('combatPower')) || 0;
let prestigePoints = parseInt(localStorage.getItem('prestigePoints')) || 0;
let prestigeBoost = 1 + prestigePoints;

const enemies = [
    { level: 1, power: 10, reward: 5 },
    { level: 2, power: 25, reward: 15 },
    { level: 3, power: 50, reward: 30 },
    { level: 4, power: 100, reward: 50 },
    { level: 5, power: 200, reward: 100 },
];

function updateUI() {
    document.getElementById('qi').innerText = qi;
    document.getElementById('qi-per-click').innerText = qiPerClick * prestigeBoost;
    document.getElementById('combat-power').innerText = combatPower;
    document.getElementById('prestige-points').innerText = prestigePoints;
    document.getElementById('prestige-boost').innerText = prestigeBoost;
    renderEnemies();
}

function gainQi() {
    qi += qiPerClick * prestigeBoost;
    combatPower += Math.floor((qiPerClick * prestigeBoost) / 10); // Small Qi-based CP boost
    localStorage.setItem('qi', qi);
    localStorage.setItem('combatPower', combatPower);
    updateUI();
}

function prestige() {
    if (qi >= 100) { // Example threshold for prestige
        prestigePoints += 1;
        prestigeBoost = 1 + prestigePoints;
        qi = 0;
        qiPerClick = 1; // Reset upgrades
        combatPower = 0; // Reset combat power
        localStorage.setItem('prestigePoints', prestigePoints);
        localStorage.setItem('qi', qi);
        localStorage.setItem('qiPerClick', qiPerClick);
        localStorage.setItem('combatPower', combatPower);
        updateUI();
    } else {
        alert('You need at least 100 Qi to Prestige!');
    }
}

function renderEnemies() {
    const enemiesDiv = document.getElementById('enemies');
    enemiesDiv.innerHTML = '';
    enemies.forEach((enemy) => {
        const canDefeat = combatPower >= enemy.power ? 'Can Fight!' : 'Too Strong!';
        const enemyDiv = document.createElement('div');
        enemyDiv.className = 'enemy';
        enemyDiv.innerHTML = `
            <p><b>Enemy Level:</b> ${enemy.level}</p>
            <p><b>Required Power:</b> ${enemy.power}</p>
            <p><b>Reward:</b> +${enemy.reward} Combat Power</p>
            <button class="button" onclick="fightEnemy(${enemy.level})" ${
            combatPower >= enemy.power ? '' : 'disabled'
        }>${canDefeat}</button>
        `;
        enemiesDiv.appendChild(enemyDiv);
    });
}

function fightEnemy(level) {
    const enemy = enemies.find((e) => e.level === level);
    if (combatPower >= enemy.power) {
        combatPower += enemy.reward;
        localStorage.setItem('combatPower', combatPower);
        updateUI();
    } else {
        alert('Not enough Combat Power to defeat this enemy!');
    }
}

// Initialize UI on load
updateUI();
