
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cannon = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 80,
    width: 100,
    height: 50,
    image: new Image(),
    speed: 10
};
cannon.image.src = "truck.png";

let bullets = [];
let enemies = [];
let bombs = [];
let score = 0;
let stage = 1;
let lives = 5;
let enemySpeed = 2;
let bombSpeed = 4;
let lastEnemySpawnTime = 0;
let lastBombTime = 0;
let gameOver = false;

document.addEventListener("touchstart", shootBullet);
document.addEventListener("touchmove", function (e) {
    cannon.x = e.touches[0].clientX - cannon.width / 2;
});

function shootBullet() {
    bullets.push({
        x: cannon.x + cannon.width / 2 - 5,
        y: cannon.y,
        width: 10,
        height: 20
    });
    const shootSound = new Audio("shoot.mp3");
    shootSound.play();
}

function spawnEnemy() {
    let direction = Math.random() < 0.5 ? 1 : -1;
    let x = direction === 1 ? -100 : canvas.width + 100;

    let enemy = {
        x: x,
        y: Math.random() * 150 + 50,
        width: 80,
        height: 60,
        image: new Image(),
        direction: direction,
        speed: enemySpeed
    };
    enemy.image.src = "plane.png";
    enemies.push(enemy);
}

function updateBombs() {
    for (let enemy of enemies) {
        if (Math.random() < 0.01) {
            bombs.push({
                x: enemy.x + enemy.width / 2 - 5,
                y: enemy.y + enemy.height,
                width: 10,
                height: 20
            });
        }
    }

    for (let i = 0; i < bombs.length; i++) {
        bombs[i].y += bombSpeed;
        if (
            bombs[i].x < cannon.x + cannon.width &&
            bombs[i].x + bombs[i].width > cannon.x &&
            bombs[i].y < cannon.y + cannon.height &&
            bombs[i].y + bombs[i].height > cannon.y
        ) {
            lives--;
            bombs.splice(i, 1);
            i--;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cannon.image, cannon.x, cannon.y, cannon.width, cannon.height);

    for (let bullet of bullets) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    for (let enemy of enemies) {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    }

    for (let bomb of bombs) {
        ctx.fillStyle = "red";
        ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);
    }

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 40);
    ctx.fillText("Stage: " + stage, 20, 70);
    ctx.fillText("Lives: " + lives, 20, 100);
}

function update() {
    if (gameOver) return;

    for (let bullet of bullets) {
        bullet.y -= 8;
    }

    bullets = bullets.filter(bullet => bullet.y > 0);

    for (let enemy of enemies) {
        enemy.x += enemy.speed * enemy.direction;

        if (enemy.x < -100 || enemy.x > canvas.width + 100) {
            enemy.direction *= -1;
        }

        for (let i = 0; i < bullets.length; i++) {
            if (
                bullets[i].x < enemy.x + enemy.width &&
                bullets[i].x + bullets[i].width > enemy.x &&
                bullets[i].y < enemy.y + enemy.height &&
                bullets[i].y + bullets[i].height > enemy.y
            ) {
                bullets.splice(i, 1);
                let explosionSound = new Audio("boom.mp3");
                explosionSound.play();
                score++;
                enemies.splice(enemies.indexOf(enemy), 1);
                break;
            }
        }
    }

    if (score >= stage * 10) {
        stage++;
        enemySpeed += 1;
        bombSpeed += 0.5;
    }

    updateBombs();

    if (lives <= 0) {
        gameOver = true;
        alert("Game Over!");
    }
}

function loop() {
    let now = Date.now();
    if (now - lastEnemySpawnTime > 3000) {
        spawnEnemy();
        lastEnemySpawnTime = now;
    }

    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
