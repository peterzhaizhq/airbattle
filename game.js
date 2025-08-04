
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let airplaneImg = new Image();
let cannonImg = new Image();
let shootSound = new Audio('shoot.mp3');
let boomSound = new Audio('boom.mp3');
let background = "#000";

airplaneImg.src = 'plane.png';
cannonImg.src = 'truck.png';

let cannon = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50 };
let bullets = [];
let airplanes = [];
let explosions = [];
let score = 0;
let stage = 1;
let hitsThisRound = 0;
let lives = 2;
let gameOver = false;
let showMessage = false;

function spawnAirplane() {
  const speed = 1 + 0.5 * (stage - 1);
  airplanes.push({ x: Math.random() * (canvas.width - 40), y: -60, speed: speed });
}

function drawAirplanes() {
  airplanes.forEach(p => ctx.drawImage(airplaneImg, p.x, p.y, 40, 40));
}

function moveAirplanes() {
  airplanes.forEach(p => p.y += p.speed);
}

function drawCannon() {
  ctx.drawImage(cannonImg, cannon.x, cannon.y, cannon.width, cannon.height);
}

function drawBullets() {
  ctx.fillStyle = 'yellow';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 10));
}

function moveBullets() {
  bullets.forEach(b => b.y -= 5);
}

function checkCollisions() {
  bullets.forEach((b, bi) => {
    airplanes.forEach((p, pi) => {
      if (b.x < p.x + 40 && b.x + 4 > p.x && b.y < p.y + 40 && b.y + 10 > p.y) {
        bullets.splice(bi, 1);
        airplanes.splice(pi, 1);
        score++;
        hitsThisRound++;
        boomSound.play();
        if (hitsThisRound >= 10) {
          stage++;
          hitsThisRound = 0;
          showMessage = true;
          setTimeout(() => showMessage = false, 3000);
        }
      }
    });
  });
}

function drawUI() {
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Stage: ${stage}`, 10, 40);
  ctx.fillText(`Lives: ${lives}`, 10, 60);
  if (showMessage) {
    ctx.fillStyle = 'red';
    ctx.font = '24px Arial';
    ctx.fillText('翟习羽最厉害!', 120, canvas.height / 2);
  }
}

function gameLoop() {
  if (gameOver) return;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  moveAirplanes();
  moveBullets();
  checkCollisions();
  drawAirplanes();
  drawCannon();
  drawBullets();
  drawUI();

  airplanes = airplanes.filter(p => {
    if (p.y > canvas.height) {
      lives--;
      if (lives <= 0) gameOver = true;
      return false;
    }
    return true;
  });

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('touchstart', e => {
  let touch = e.touches[0];
  if (touch.clientY > canvas.height - 100) {
    cannon.x = touch.clientX - cannon.width / 2;
  } else {
    bullets.push({ x: cannon.x + cannon.width / 2 - 2, y: cannon.y });
    shootSound.play();
  }
});

setInterval(spawnAirplane, 2000);
gameLoop();
