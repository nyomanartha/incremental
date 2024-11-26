// Game Variables
let qi = parseFloat(localStorage.getItem("qi")) || 0;
let qiPerClick = parseFloat(localStorage.getItem("qiPerClick")) || 1;
let combatPower = parseFloat(localStorage.getItem("combatPower")) || 0;
let prestigePoints = parseInt(localStorage.getItem("prestigePoints")) || 0;
let prestigeBoost = 1 + prestigePoints * 0.1; // Prestige increases Qi multiplier by 10% per point
let prestigeCost = parseFloat(localStorage.getItem("prestigeCost")) || 100;
let qiPerSecond = 0;

// Equipment
let equipmentSlots = ["Empty", "Empty", "Empty"];

// Upgrades
let upgrades = [
    { id: 1, name: "2x More Qi", cost: 1, effect: () => (qiPerClick *= 2), purchased: false },
    { id: 2, name: "3x More Qi", cost: 3, effect: () => (qiPerClick *= 3), purchased: false },
    { id: 3, name: "10% Qi per Second", cost: 5, effect: () => qiPerSecond += qi * 0.1, purchased: false },
    { id: 4, name: "25% Qi per Second", cost: 10, effect: () => qiPerSecond += qi * 0.25, purchased: false },
];

// Enemies
let enemies = [
    { level: 1, power: 10, reward: 5, speed: 3000 },
    { level: 2, power: 25, reward: 15, speed: 2500 },
    { level: 3, power: 50, reward: 30, speed: 2000 },
    { level: 4, power: 100, reward: 50, speed: 1500 },
    { level: 5, power: 200, reward: 100, speed: 1000 },
];

// Update the UI
function updateUI() {
    document.getElementById("qi").innerText = qi.toFixed(2);
    document.getElementById("qi-per-click").innerText = (qiPerClick * prestigeBoost).toFixed(2);
    document.getElementById("qi-per-second").innerText = qiPerSecond.toFixed(2);
    document.getElementById("combat-power").innerText = combatPower.toFixed(2);
    document.getElementById("prestige-points").innerText = prestigePoints;
    document.getElementById("prestige-boost").innerText = prestigeBoost.toFixed(2);
    document.getElementById("prestige-cost").innerText = prestigeCost.toFixed(2);
    document.getElementById("slot-1").innerText = equipmentSlots[0];
    document.getElementById("slot-2").innerText = equipmentSlots[1];
    document.getElementById("slot-3").innerText = equipmentSlots[2];
    renderUpgrades();
    renderEnemies();
}

// Gain Qi
function gainQi() {
    qi += qiPerClick * prestigeBoost;
    localStorage.setItem("qi", qi);
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
        equipmentSlots = ["Empty", "Empty", "Empty"]; // Reset equipment on prestige
        upgrades.forEach((upgrade) => (upgrade.purchased = false)); // Reset upgrades
        localStorage.setItem("prestigePoints", prestigePoints);
        localStorage.setItem("qi", qi);
        localStorage.setItem("qiPerClick", qiPerClick);
        localStorage.setItem("combatPower", combatPower);
        localStorage.setItem("prestigeCost", prestigeCost);
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
        qiPerSecond = 0;
        equipmentSlots = ["Empty", "Empty", "Empty"];
        upgrades.forEach((upgrade) => (upgrade.purchased = false)); // Reset upgrades
        enemies = [
            { level: 1, power: 10, reward: 5, speed: 3000 },
            { level: 2, power: 25, reward: 15, speed: 2500 },
            { level: 3, power: 50, reward: 30, speed: 2000 },
            { level: 4, power: 100, reward: 50, speed: 1500 },
            { level: 5, power: 200, reward: 100, speed: 1000 },
        ];
        updateUI();
    }
}

// Render Upgrades
function renderUpgrades() {
    const upgradesDiv = document.getElementById("upgrades");
    upgradesDiv.innerHTML = "";
    upgrades.forEach((upgrade) => {
        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade";
        upgradeDiv.innerHTML = `
            <p><b>${upgrade.name}</b></p>
            <p>Cost: ${upgrade.cost} Prestige Points</p>
            <button class="button" onclick="buyUpgrade(${upgrade.id})" ${
            prestigePoints >= upgrade.cost && !upgrade.purchased ? "" : "disabled"
        }>${upgrade.purchased ? "Purchased" : "Buy"}</button>
        `;
        upgradesDiv.appendChild(upgradeDiv);
    });
}

// Buy Upgrade
function buyUpgrade(id) {
    const upgrade = upgrades.find((u) => u.id === id);
    if (prestigePoints >= upgrade.cost && !upgrade.purchased) {
        prestigePoints -= upgrade.cost;
        upgrade.effect();
        upgrade.purchased = true;
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
        const fightDuration = Math.max(enemy.speed / (combatPower / enemy.power), 500);
        setTimeout(() => {
            combatPower += enemy.reward;
            updateUI();
        }, fightDuration);
    }
}

// Start the passive Qi generation
setInterval(() => {
    if (qiPerSecond > 0) {
        qi += qiPerSecond;
        updateUI();
    }
}, 1000);

// Initialize UI
updateUI();
