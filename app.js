const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- GAME OBJECTS ---
const player = {
    x: 50, y: 50, size: 40, color: '#f4ff00',
    speed: 5, dx: 0, dy: 0, angle: 0
};

const flag = { x: canvas.width - 100, y: canvas.height / 2, size: 30, captured: false };

const obstacles = [
    { x: 300, y: 100, w: 50, h: 300 },
    { x: 600, y: 400, w: 300, h: 50 },
    { x: 800, y: 100, w: 50, h: 200 }
];

const bullets = [];

// --- FUNCTIONS ---
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.size/2, player.y + player.size/2);
    ctx.rotate(player.angle);
    
    // Body
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 15; ctx.shadowColor = player.color;
    ctx.fillRect(-player.size/2, -player.size/2, player.size, player.size);
    
    // Gun (Attached to player)
    ctx.fillStyle = "#333";
    ctx.fillRect(10, -5, 30, 10); 
    ctx.restore();
}

function drawObstacles() {
    obstacles.forEach(obs => {
        ctx.fillStyle = "#111";
        ctx.strokeStyle = "#00f3ff"; // Neon Cyan lights
        ctx.lineWidth = 2;
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
    });
}

function drawFlag() {
    if (!flag.captured) {
        ctx.fillStyle = "#ff003c"; // Team Red Flag
        ctx.shadowBlur = 20; ctx.shadowColor = "#ff003c";
        ctx.fillRect(flag.x, flag.y, flag.size, flag.size);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Movement & Collision
    let nextX = player.x + player.dx;
    let nextY = player.y + player.dy;

    // Simple Collision Check
    let collision = obstacles.some(obs => 
        nextX < obs.x + obs.w && nextX + player.size > obs.x &&
        nextY < obs.y + obs.h && nextY + player.size > obs.y
    );

    if (!collision) {
        player.x = nextX;
        player.y = nextY;
    }

    // Flag Capture Check
    if (Math.abs(player.x - flag.x) < 40 && Math.abs(player.y - flag.y) < 40) {
        flag.captured = true;
        document.getElementById('score').innerText = "100 (FLAG CAPTURED)";
    }

    drawObstacles();
    drawFlag();
    drawPlayer();

    requestAnimationFrame(update);
}

// --- CONTROLS ---
window.addEventListener('keydown', e => {
    if (e.key === 'w') player.dy = -player.speed;
    if (e.key === 's') player.dy = player.speed;
    if (e.key === 'a') player.dx = -player.speed;
    if (e.key === 'd') player.dx = player.speed;
});

window.addEventListener('keyup', () => { player.dx = 0; player.dy = 0; });

// Aiming the Gun
window.addEventListener('mousemove', e => {
    player.angle = Math.atan2(e.clientY - (player.y + player.size/2), e.clientX - (player.x + player.size/2));
});

update();
