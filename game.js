
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Image();
background.src = "0db284f77b95e7dd7ec96cba2eab731e.jpeg";
const airplane = new Image();
airplane.src = "airplane_clean.png";
const cannon = new Image();
cannon.src = "cannon_clean.png";

let score = 0;
let round = 1;
let lives = 2;
let gameOver = false;
let messageShown = false;

const shootAudio = new Audio("shoot.mp3");
const boomAudio = new Audio("boom.mp3");

function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawUI() {
  document.getElementById("scoreDisplay").innerText =
    `Score: ${score} | Round: ${round} | Lives: ${lives}`;
  if (gameOver && !messageShown) {
    document.getElementById("message").style.display = "block";
    messageShown = true;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawUI();
  requestAnimationFrame(gameLoop);
}

gameLoop();
