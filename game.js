
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const background = new Image();
background.src = "background.jpg";

const planeImage = new Image();
planeImage.src = "plane.png";

const truckImage = new Image();
truckImage.src = "truck.png";

const shootSound = new Audio("shoot.mp3");
const boomSound = new Audio("boom.mp3");

let truckX = canvas.width / 2 - 25;
let truckY = canvas.height - 60;
let bullets = [];
let enemies = [];
let bombs = [];

let lives = 5;
let kills = 0;
let round = 1;
let totalRounds = 5;
let isGameOver = false;

function drawTruck() {
  ctx.drawImage(truckImage, truckX, truckY, 50, 50);
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach((b, index) => {
    b.y -= 6;
    ctx.fillRect(b.x, b.y, 4, 10);
    if (b.y < 0) bullets.splice(index, 1);
  });
}

function drawEnemies() {
  enemies.forEach((e, index) => {
    e.x += e.dx;
    if (e.x < 0 || e.x > canvas.width - 50) e.dx *= -1;
    e.y += 0.3;
    ctx.drawImage(planeImage, e.x, e.y, 50, 50);

    if (Math.random() < 0.01) {
      bombs.push({ x: e.x + 25, y: e.y + 50 });
    }

    bullets.forEach((b, bi) => {
      if (b.x > e.x && b.x < e.x + 50 && b.y > e.y && b.y < e.y + 50) {
        enemies.splice(index, 1);
        bullets.splice(bi, 1);
        kills++;
        boomSound.play();
      }
    });
  });
}

function drawBombs() {
  ctx.fillStyle = "red";
  bombs.forEach((b, index) => {
    b.y += 4;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
    ctx.fill();
    if (b.y > canvas.height) bombs.splice(index, 1);
    else if (
      b.x > truckX && b.x < truckX + 50 &&
      b.y > truckY && b.y < truckY + 50
    ) {
      lives--;
      bombs.splice(index, 1);
      boomSound.play();
    }
  });
}

function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawUI() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Lives: " + lives, 10, 20);
  ctx.fillText("Kills: " + kills, 10, 40);
  ctx.fillText("Round: " + round + "/" + totalRounds, 10, 60);
}

function drawWinMessage() {
  ctx.fillStyle = "yellow";
  ctx.font = "26px Arial";
  ctx.fillText("你赢了！", canvas.width / 2 - 60, canvas.height / 2 - 10);
  ctx.fillText("LAK祝你Lucky常伴", canvas.width / 2 - 110, canvas.height / 2 + 30);
}

function gameLoop() {
  if (isGameOver) {
    drawBackground();
    drawWinMessage();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawTruck();
  drawBullets();
  drawEnemies();
  drawBombs();
  drawUI();

  if (kills >= 10) {
    if (round >= totalRounds) {
      isGameOver = true;
    } else {
      round++;
      kills = 0;
      enemies = [];
      for (let i = 0; i < round + 2; i++) {
        enemies.push({
          x: Math.random() * (canvas.width - 50),
          y: 30 + Math.random() * 50,
          dx: 1 + Math.random(),
        });
      }
    }
  }

  if (lives <= 0) {
    isGameOver = true;
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener("click", () => {
  bullets.push({ x: truckX + 23, y: truckY });
  shootSound.play();
});

let isDragging = false;
document.addEventListener("touchstart", (e) => {
  isDragging = true;
});

document.addEventListener("touchmove", (e) => {
  if (isDragging) {
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    truckX = touch.clientX - rect.left - 25;
    if (truckX < 0) truckX = 0;
    if (truckX > canvas.width - 50) truckX = canvas.width - 50;
  }
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

for (let i = 0; i < 3; i++) {
  enemies.push({ x: 60 * i, y: 40, dx: 1 + Math.random() });
}

background.onload = gameLoop;
