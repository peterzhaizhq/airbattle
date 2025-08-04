
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const shootSound = new Audio('shoot.mp3');
const boomSound = new Audio('boom.mp3');

document.addEventListener('click', () => {
  shootSound.currentTime = 0;
  shootSound.play();
  setTimeout(() => {
    boomSound.currentTime = 0;
    boomSound.play();
  }, 500);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'red';
  ctx.fillRect(180, 280, 40, 40);
});
