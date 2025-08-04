
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let airplaneImg = new Image();
let cannonImg = new Image();
let shootSound = new Audio('shoot.mp3');
let boomSound = new Audio('boom.mp3');
let backgroundImg = new Image();

airplaneImg.src = 'plane.png';
cannonImg.src = 'truck.png';
backgroundImg.src = 'background.jpg';

let cannon = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50 };
let bullets = [];
let airplanes = [];
let bombs = [];
let score = 0;
let stage = 1;
let hitsThisRound = 0;
let lives = 5;
let gameOver = false;
let showMessage = false;

function spawnAirplane() {
  const speed = 1 + 0.5 * (stage - 1);
  const direction = Math.random() > 0.5 ? 1 : -1;
  const y = Math.random() * 100 + 20;
  const x = direction === 1 ? -40 : canvas.width + 40;
  airplanes.push({ x, y, speed, direction, dropTimer: 0 });
}

function drawAirplanes() {
  airplanes.forEach(p => ctx.drawImage(airplaneImg, p.x, p.y, 40, 40));
}

function moveAirplanes() {
  airplanes.forEach(p => {
    p.x += p.speed * p.direction;
    p.dropTimer++;
    if (p.dropTimer > 60) {
      bombs.push({ x: p.x + 20, y: p.y + 40, speed: 3 });
      p.dropTimer = 0;
    }
  });
  // 移除出界飞机
  airplanes = airplanes.filter(p => p.x > -50 && p.x < canvas.width + 50);
}

function drawBombs() {
  ctx.fillStyle = 'red';
  bombs.forEach(b => ctx.beginPath() || ctx.arc(b.x, b.y, 6, 0, 2 * Math.PI) || ctx.fill());
}

function moveBombs() {
  bombs.forEach(b => b.y += b.speed);
  bombs = bombs.filter(b => b.y < canvas.height);
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
  bullets = bullets.filter(b => b.y > 0);
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

  bombs.forEach((b, bi) => {
    if (
      b.x > cannon.x &&
      b.x < cannon.x + cannon.width &&
      b.y > cannon.y &&
      b.y < cannon.y + cannon.height
    ) {
      bombs.splice(bi, 1);
      lives--;
      if (lives <= 0) gameOver = true;
    }
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
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  moveAirplanes();
  moveBombs();
  moveBullets();
  checkCollisions();
  drawAirplanes();
  drawCannon();
  drawBullets();
  drawBombs();
  drawUI();
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

setInterval(spawnAirplane, 2500);
gameLoop();
