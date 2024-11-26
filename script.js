// Game Variables
let qi = parseFloat(localStorage.getItem("qi")) || 0;
let qiPerClick = parseFloat(localStorage.getItem("qiPerClick")) || 1;
let combatPower = parseFloat(localStorage.getItem("combatPower")) || 0;
let prestigePoints = parseInt(localStorage.getItem("prestigePoints")) || 0;
let prestigeCost = parseFloat(localStorage.getItem("prestigeCost")) || 100;
let qiPerSecond = parseFloat(localStorage.getItem("qiPerSecond")) || 0;
let qiMultiplier = parseFloat(localStorage.getItem("qiMultiplier")) || 1; // Combined multiplier

// Equipment
let equipmentSlots = JSON.parse(localStorage.getItem("equipmentSlots")) || ["Empty", "Empty", "Empty"];

// Upgrades
let upgrades = JSON.parse(localStorage.getItem("upgrades")) || [
    { id: 1, name: "2x More Qi", cost: 1, multiplier: 2, purchased: false },
    { id: 2, name: "3x More Qi", cost: 3, multiplier: 3, purchased: false },
    { id: 3, name: "10% Qi per Second", cost: 5, effect: () => (qiPerSecond += qi * 0.1), purchased: false },
    { id: 4, name: "25% Qi per Second", cost: 10, effect: () => (qiPerSecond += qi * 0.25), purchased: false },
];

// Enemies
let enemies = [
    { level: 1, power: 10, reward: 5, speed: 3000 },
    { level: 2, power: 25, reward: 15, speed: 2500 },
    { level: 3, power: 50, reward: 30, speed: 2000 },
    { level: 4, power: 100, reward: 50, speed: 1500 },
    { level: 5, power: 200, reward: 100, speed: 1000 },
];

// Calculate the Combined Multiplier
function calculateQiMultiplier() {
    let multiplier = 1 + prestigePoints * 0.1; // Base Prestige multiplier
    upgrades.forEach((upgrade) => {
        if (upgrade.purchased && upgrade.multiplier) {
            multiplier *= upgrade.multiplier;
        }
    });
    qiMultiplier = multiplier;
    localStorage.setItem("qiMultiplier", qiMultiplier);
}

// Update the UI
function updateUI() {
    document.getElementById("qi").innerText = qi.toFixed(2);
    document.getElementById("qi-per-click").innerText = (qiPerClick * qiMultiplier).toFixed(2);
    document.getElementById("qi-per-second").innerText = qiPerSecond.toFixed(2);
    document.getElementById("combat-power").innerText = combatPower.toFixed(2);
    document.getElementById("prestige-points").innerText = prestigePoints;
    document.getElementById("prestige-cost").innerText = prestigeCost.toFixed(2);
    renderUpgrades();
    renderEnemies();
}

// Gain Qi
function gainQi() {
    qi += qiPerClick * qiMultiplier;
    localStorage.setItem("qi", qi);
    updateUI();
}

// Prestige
function prestige() {
    if (qi >= prestigeCost) {
        prestigePoints += 1;
        qi = 0;
        combatPower = 0;
        prestigeCost = Math.floor(prestigeCost * 1.1);

        calculateQiMultiplier(); // Recalculate multiplier after Prestige

        localStorage.setItem("prestigePoints", prestigePoints);
        localStorage.setItem("qi", qi);
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
        prestigeCost = 100;
        qiPerSecond = 0;
        qiMultiplier = 1;
        equipmentSlots = ["Empty", "Empty", "Empty"];
        upgrades.forEach((upgrade) => (upgrade.purchased = false));
        calculateQiMultiplier();
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
        upgrade.purchased = true;
        if (upgrade.multiplier) calculateQiMultiplier(); // Recalculate multiplier
        if (upgrade.effect) upgrade.effect(); // Apply effect
        localStorage.setItem("prestigePoints", prestigePoints);
        localStorage.setItem("upgrades", JSON.stringify(upgrades));
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

// Passive Qi Generation
setInterval(() => {
    if (qiPerSecond > 0) {
        qi += qiPerSecond;
        localStorage.setItem("qi", qi);
        updateUI();
    }
}, 1000);

// Initialize
calculateQiMultiplier(); // Ensure the multiplier is applied on page load
updateUI();
