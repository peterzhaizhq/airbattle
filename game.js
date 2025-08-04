
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let truckImg = new Image();
let planeImg = new Image();
truckImg.src = 'truck.png';
planeImg.src = 'plane.png';

let shootSound = new Audio('shoot.mp3');
let boomSound = new Audio('boom.mp3');

let player = { x: 140, y: 520, width: 120, height: 80 };
let plane = { x: 100, y: 50, width: 100, height: 100, hit: 0 };
let bullets = [];
let bombs = [];
let hits = 0, damages = 0;

canvas.addEventListener("pointerdown", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;
  if (x >= player.x && x <= player.x + player.width && y >= player.y && y <= player.y + player.height) {
    canvas.addEventListener("pointermove", moveTruck);
    canvas.addEventListener("pointerup", () => {
      canvas.removeEventListener("pointermove", moveTruck);
    }, { once: true });
  } else {
    shootBullet();
  }
});

function moveTruck(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  player.x = x - player.width / 2;
}

function shootBullet() {
  bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
  shootSound.currentTime = 0;
  shootSound.play();
}

function dropBomb() {
  bombs.push({ x: plane.x + plane.width / 2 - 4, y: plane.y + plane.height });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(truckImg, player.x, player.y, player.width, player.height);
  if (plane.hit < 2) ctx.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);

  bullets.forEach((b, i) => {
    b.y -= 5;
    ctx.fillStyle = 'yellow';
    ctx.fillRect(b.x, b.y, 4, 10);
    if (b.y < 0) bullets.splice(i, 1);
    else if (b.x > plane.x && b.x < plane.x + plane.width && b.y < plane.y + plane.height) {
      plane.hit++;
      boomSound.currentTime = 0;
      boomSound.play();
      bullets.splice(i, 1);
    }
  });

  bombs.forEach((b, i) => {
    b.y += 4;
    ctx.fillStyle = 'white';
    ctx.fillRect(b.x, b.y, 8, 12);
    if (b.y > canvas.height) bombs.splice(i, 1);
    else if (b.x > player.x && b.x < player.x + player.width && b.y > player.y && b.y < player.y + player.height) {
      damages++;
      boomSound.currentTime = 0;
      boomSound.play();
      bombs.splice(i, 1);
    }
  });

  if (damages >= 10) {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('GAME OVER', 100, 300);
    return;
  }

  if (plane.hit < 2) plane.x += (Math.random() - 0.5) * 4;

  requestAnimationFrame(draw);
}

setInterval(dropBomb, 1000);
draw();
