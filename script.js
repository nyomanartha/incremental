// Initial Game Variables
let qi = parseInt(localStorage.getItem('qi')) || 0;
let qiPerClick = parseInt(localStorage.getItem('qiPerClick')) || 1;
let combatPower = parseInt(localStorage.getItem('combatPower')) || 0;
let prestigePoints = parseInt(localStorage.getItem('prestigePoints')) || 0;
let prestigeBoost = 1 + prestigePoints * 0.1; // 10% Qi boost per prestige
let prestigeCost = parseInt(localStorage.getItem('prestigeCost')) || 100;

// Equipment
let equipmentSlots = ["Empty", "Empty", "Empty"];

// Enemies
let enemies = [
    { level: 1, power: 10, reward: 5, speed: 3000 },
    { level: 2, power: 25, reward: 15, speed: 2500 },
];

// Update UI
function updateUI() {
    document.getElementById('qi').innerText = qi;
    document.getElementById('qi-per-click').innerText = (qiPerClick * prestigeBoost).toFixed(1);
    document.getElementById('combat-power').innerText = combatPower;
    document.getElementById('prestige-points').innerText = prestigePoints;
    document.getElementById('prestige-boost').innerText = prestigeBoost.toFixed(1);
    document.getElementById('prestige-cost').innerText = prestigeCost;
    document.getElementById('slot-1').innerText = equipmentSlots[0];
    document.getElementById('slot-2').innerText = equipmentSlots[1];
    document.getElementById('slot-3').innerText = equipmentSlots[2];
    renderEnemies();
}

// Gain Qi
function gainQi() {
    qi += qiPerClick * prestigeBoost;
    combatPower += Math.floor((qiPerClick * prestigeBoost) / 10);
    localStorage.setItem('qi', qi);
    localStorage.setItem('combatPower', combatPower);
    updateUI();
}

// Prestige
function prestige() {
    if (qi >= prestigeCost) {
        prestigePoints += 1;
        prestigeBoost = 1 + prestigePoints * 0.1;
        qi = 0;
        qiPerClick = 1;
        combatPower = 0;
        prestigeCost = Math.floor(prestigeCost * 1.1);
        localStorage.setItem('prestigePoints', prestigePoints);
        localStorage.setItem('qi', qi);
        localStorage.setItem('qiPerClick', qiPerClick);
        localStorage.setItem('combatPower', combatPower);
        localStorage.setItem('prestigeCost', prestigeCost);
        updateUI();
    } else {
        alert("Not enough Qi to Prestige!");
    }
}

// Hard Reset
function hardReset() {
    if (confirm("Are you sure you want to reset all progress?")) {
        localStorage.clear();
        qi = 0;
        qiPerClick = 1;
        combatPower = 0;
        prestigePoints = 0;
        prestigeBoost = 1;
        prestigeCost = 100;
        equipmentSlots = ["Empty", "Empty", "Empty"];
        enemies = [
            { level: 1, power: 10, reward: 5, speed: 3000 },
            { level: 2, power: 25, reward: 15, speed: 2500 },
        ];
        updateUI();
    }
}

// Render Enemies
function renderEnemies() {
    const enemiesDiv = document.getElementById("enemies");
    enemiesDiv.innerHTML = "";
    enemies.forEach((enemy) => {
        const canDefeat = combatPower >= enemy.power ? "Can Fight!" : "Too Strong!";
        const enemyDiv = document.createElement("div");
        enemyDiv.className = "enemy";
        enemyDiv.innerHTML = `
            <p><b>Enemy Level:</b> ${enemy.level}</p>
            <p><b>Required Power:</b> ${enemy.power}</p>
            <p><b>Reward:</b> +${enemy.reward} Combat Power</p>
            <button class="button" onclick="fightEnemy(${enemy.level})" ${
            combatPower >= enemy.power ? "" : "disabled"
        }>${canDefeat}</button>
        `;
        enemiesDiv.appendChild(enemyDiv);
    });
}

// Fight Enemy
function fightEnemy(level) {
    const enemy = enemies.find((e) => e.level === level);
    if (combatPower >= enemy.power) {
        const fightDuration = enemy.speed / (combatPower / enemy.power);
        alert(`Fighting Enemy Level ${level}...`);
        setTimeout(() => {
            alert(`Enemy Level ${level} Defeated!`);
            combatPower += enemy.reward;
            dropEquipment();
            updateUI();
        }, fightDuration);
    } else {
        alert("Not enough Combat Power to defeat this enemy!");
    }
}

// Equipment Drop
function dropEquipment() {
    const equipmentTypes = ["Qi Bonus", "Combat Power Bonus", "Speed Bonus"];
    const randomEquipment = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
    for (let i = 0; i < equipmentSlots.length; i++) {
        if (equipmentSlots[i] === "Empty") {
            equipmentSlots[i] = randomEquipment;
            break;
        }
    }
}

// Initialize UI
updateUI();
