const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

// Canvas Auto-Resizing
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game State
let score = 0;
let lives = 3;
let gameOver = false;
let fruits = [];
let slicePath = [];
let isSlicing = false;

// Fruit Types Configuration
const FRUIT_TYPES = [
  { name: 'apple', color: '#ff3333', radius: 30, points: 10 },
  { name: 'orange', color: '#ffa500', radius: 28, points: 10 },
  { name: 'watermelon', color: '#2e8b57', radius: 45, points: 20 },
  { name: 'bomb', color: '#333333', radius: 25, isBomb: true }
];

// Spawn Fruit Class
class Fruit {
  constructor() {
    const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
    this.x = Math.random() * (canvas.width - 100) + 50;
    this.y = canvas.height + 50;
    this.radius = type.radius;
    this.color = type.color;
    this.isBomb = type.isBomb || false;
    this.points = type.points || 0;
    
    // Physics
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = -(Math.random() * 5 + 14);
    this.gravity = 0.35;
    this.sliced = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.closePath();
  }
}

// Controls / Blade Trail Listeners
function addPoint(x, y) {
  slicePath.push({ x, y, time: Date.now() });
}

window.addEventListener('mousedown', (e) => {
  isSlicing = true;
  slicePath = [];
  addPoint(e.clientX, e.clientY);
});

window.addEventListener('mousemove', (e) => {
  if (isSlicing) addPoint(e.clientX, e.clientY);
});

window.addEventListener('mouseup', () => { isSlicing = false; });

// Mobile Touch Support
window.addEventListener('touchstart', (e) => {
  isSlicing = true;
  slicePath = [];
  addPoint(e.touches[0].clientX, e.touches[0].clientY);
});

window.addEventListener('touchmove', (e) => {
  if (isSlicing) addPoint(e.touches[0].clientX, e.touches[0].clientY);
});

window.addEventListener('touchend', () => { isSlicing = false; });

// Distance helper for collision detection
function getDistance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

// Check Collision between slice points and fruit
function checkSlices() {
  if (slicePath.length < 2) return;
  const latest = slicePath[slicePath.length - 1];

  fruits.forEach((fruit) => {
    if (!fruit.sliced) {
      const dist = getDistance(latest.x, latest.y, fruit.x, fruit.y);
      if (dist < fruit.radius) {
        fruit.sliced = true;
        if (fruit.isBomb) {
          endGame();
        } else {
          score += fruit.points;
          scoreEl.textContent = score;
        }
      }
    }
  });
}

function endGame() {
  gameOver = true;
  alert(`Game Over! Final Score: ${score}`);
  location.reload();
}

// Main Game Loop
let spawnTimer = 0;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Spawn timing
  spawnTimer++;
  if (spawnTimer % 60 === 0) {
    fruits.push(new Fruit());
  }

  // Draw Blade Trail
  const now = Date.now();
  slicePath = slicePath.filter(p => now - p.time < 150);
  
  if (slicePath.length > 1) {
    ctx.beginPath();
    ctx.moveTo(slicePath[0].x, slicePath[0].y);
    for (let i = 1; i < slicePath.length; i++) {
      ctx.lineTo(slicePath[i].x, slicePath[i].y);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Update & Draw Fruits
  for (let i = fruits.length - 1; i >= 0; i--) {
    const f = fruits[i];
    f.update();
    f.draw();

    // Check if fruit fell off bottom without being sliced
    if (f.y - f.radius > canvas.height) {
      if (!f.sliced && !f.isBomb) {
        lives--;
        livesEl.textContent = '❤️'.repeat(Math.max(0, lives));
        if (lives <= 0) endGame();
      }
      fruits.splice(i, 1);
    } else if (f.sliced) {
      fruits.splice(i, 1);
    }
  }

  if (isSlicing) checkSlices();
  if (!gameOver) requestAnimationFrame(animate);
}

animate();
