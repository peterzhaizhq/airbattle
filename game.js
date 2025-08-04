
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const shootBtn = document.getElementById("shootBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let bullets = [];
let enemies = [];
let bombs = [];
let player = { x: canvas.width / 2 - 20, y: canvas.height - 60, width: 40, height: 30, lives: 10 };
let airplane = { x: canvas.width / 2, y: 50, width: 60, height: 20, hits: 0 };

function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawAirplane() {
    ctx.fillStyle = "blue";
    ctx.fillRect(airplane.x, airplane.y, airplane.width, airplane.height);
}

function drawBullets() {
    ctx.fillStyle = "yellow";
    bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, 4, 10);
    });
}

function drawBombs() {
    ctx.fillStyle = "orange";
    bombs.forEach(b => {
        ctx.fillRect(b.x, b.y, 6, 10);
    });
}

function moveBullets() {
    bullets.forEach(b => b.y -= 8);
    bullets = bullets.filter(b => b.y > -10);
}

function moveBombs() {
    bombs.forEach(b => b.y += 6);
    bombs = bombs.filter(b => b.y < canvas.height + 10);
}

function dropBomb() {
    bombs.push({ x: airplane.x + airplane.width / 2, y: airplane.y + 10 });
}

function moveAirplane() {
    airplane.x += Math.random() < 0.5 ? -2 : 2;
    if (airplane.x < 0) airplane.x = 0;
    if (airplane.x + airplane.width > canvas.width) airplane.x = canvas.width - airplane.width;
    if (Math.random() < 0.02) dropBomb();
}

function detectCollisions() {
    // bullets hit airplane
    bullets.forEach((b, bi) => {
        if (b.x < airplane.x + airplane.width && b.x + 4 > airplane.x &&
            b.y < airplane.y + airplane.height && b.y + 10 > airplane.y) {
            bullets.splice(bi, 1);
            airplane.hits++;
        }
    });

    // bombs hit player
    bombs.forEach((b, bi) => {
        if (b.x < player.x + player.width && b.x + 6 > player.x &&
            b.y < player.y + player.height && b.y + 10 > player.y) {
            bombs.splice(bi, 1);
            player.lives--;
        }
    });
}

function shoot() {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawAirplane();
    drawBullets();
    drawBombs();
    moveBullets();
    moveBombs();
    moveAirplane();
    detectCollisions();

    if (airplane.hits >= 2) {
        ctx.fillStyle = "white";
        ctx.font = "30px sans-serif";
        ctx.fillText("Airplane Down!", canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    if (player.lives <= 0) {
        ctx.fillStyle = "white";
        ctx.font = "30px sans-serif";
        ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    requestAnimationFrame(gameLoop);
}

shootBtn.addEventListener("touchstart", shoot);
leftBtn.addEventListener("touchstart", () => player.x -= 15);
rightBtn.addEventListener("touchstart", () => player.x += 15);

window.onload = () => {
    gameLoop();
};
