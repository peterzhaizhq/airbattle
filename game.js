
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const shootBtn = document.getElementById("shootBtn");

let bullets = [];
let enemies = [];
let player = { x: canvas.width / 2, y: canvas.height - 60, width: 30, height: 30 };

function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = "yellow";
    bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, 4, 10);
    });
}

function drawEnemies() {
    ctx.fillStyle = "green";
    enemies.forEach(e => {
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });
}

function moveBullets() {
    bullets = bullets.filter(b => b.y > -10);
    bullets.forEach(b => b.y -= 8);
}

function spawnEnemies() {
    if (Math.random() < 0.02) {
        enemies.push({ x: Math.random() * (canvas.width - 30), y: -20, width: 30, height: 30 });
    }
}

function moveEnemies() {
    enemies.forEach(e => e.y += 2);
    enemies = enemies.filter(e => e.y < canvas.height + 30);
}

function detectCollisions() {
    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (b.x < e.x + e.width && b.x + 4 > e.x && b.y < e.y + e.height && b.y + 10 > e.y) {
                bullets.splice(bi, 1);
                enemies.splice(ei, 1);
            }
        });
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
    moveBullets();
    spawnEnemies();
    moveEnemies();
    detectCollisions();
    requestAnimationFrame(gameLoop);
}

function shoot() {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
    if (window.shootAudio) {
        window.shootAudio.currentTime = 0;
        window.shootAudio.play();
    }
}

shootBtn.addEventListener("touchstart", shoot);

// 键盘移动
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") player.x -= 15;
    if (e.key === "ArrowRight") player.x += 15;
});

window.onload = () => {
    window.shootAudio = new Audio("shoot.mp3");
    gameLoop();
};
