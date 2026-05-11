const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let dino = { x: 50, y: 160, w: 30, h: 30, vy: 0, jumping: false };
let gravity = 0.6;
let obstacles = [];
let frame = 0;
let speed = 5;
let running = false;
let score = 0;

function startGame() {
  running = true;
  loop();
}

function resetGame() {
  obstacles = [];
  frame = 0;
  speed = 5;
  score = 0;
  dino.y = 160;
  dino.vy = 0;
  running = true;
}

function jump() {
  if (!dino.jumping && running) {
    dino.vy = -10;
    dino.jumping = true;
  }
}

function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: 170,
    w: 20,
    h: 30
  });
}

function loop() {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ground
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 190, canvas.width, 10);

  // dino physics
  dino.vy += gravity;
  dino.y += dino.vy;

  if (dino.y > 160) {
    dino.y = 160;
    dino.vy = 0;
    dino.jumping = false;
  }

  ctx.fillStyle = "green";
  ctx.fillRect(dino.x, dino.y, dino.w, dino.h);

  // obstacles
  ctx.fillStyle = "red";

  obstacles.forEach(o => {
    o.x -= speed;
    ctx.fillRect(o.x, o.y, o.w, o.h);

    // collision
    if (
      dino.x < o.x + o.w &&
      dino.x + dino.w > o.x &&
      dino.y < o.y + o.h &&
      dino.y + dino.h > o.y
    ) {
      running = false;
      alert("Game Over!");
    }
  });

  obstacles = obstacles.filter(o => o.x > -50);

  if (frame % 90 === 0) spawnObstacle();

  frame++;
  if (frame % 10 === 0) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
  }

  speed += 0.001;

  requestAnimationFrame(loop);
}
