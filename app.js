const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- MULTIPLAYER SETUP (Add your Firebase config here) ---
// const firebaseConfig = { ... };
// firebase.initializeApp(firebaseConfig);
// const db = firebase.database();

const bullets = [];
const obstacles = [
    { x: 400, y: 150, w: 60, h: 300, color: '#00f3ff' },
    { x: 100, y: 400, w: 250, h: 60, color: '#ff003c' }
];

const player = {
    x: 100, y: 100, size: 40, speed: 5,
    color: '#f4ff00', angle: 0, dx: 0, dy: 0
};

class Bullet {
    constructor(x, y, angle) {
        this.x = x; this.y = y; this.angle = angle;
        this.speed = 12; this.active = true;
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Wall/Obstacle Collision
        if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.active = false;
        obstacles.forEach(obs => {
            if(this.x > obs.x && this.x < obs.x + obs.w && this.y > obs.y && this.y < obs.y + obs.h) this.active = false;
        });
    }
    draw() {
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 10; ctx.shadowColor = '#f4ff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + 20, player.y + 20);
    ctx.rotate(player.angle);
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 15; ctx.shadowColor = player.color;
    ctx.fillRect(-20, -20, 40, 40); // Body
    ctx.fillStyle = '#333';
    ctx.fillRect(15, -5, 25, 10); // Gun
    ctx.restore();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move Player
    player.x += player.dx;
    player.y += player.dy;

    // Draw Obstacles
    obstacles.forEach(obs => {
        ctx.fillStyle = '#111';
        ctx.strokeStyle = obs.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    });

    // Handle Bullets
    bullets.forEach((b, i) => {
        b.update();
        b.draw();
        if(!b.active) bullets.splice(i, 1);
    });

    drawPlayer();
    requestAnimationFrame(update);
}

// Input Handling
window.addEventListener('keydown', e => {
    if(e.key === 'w') player.dy = -player.speed;
    if(e.key === 's') player.dy = player.speed;
    if(e.key === 'a') player.dx = -player.speed;
    if(e.key === 'd') player.dx = player.speed;
});
window.addEventListener('keyup', () => { player.dx = 0; player.dy = 0; });
window.addEventListener('mousemove', e => {
    player.angle = Math.atan2(e.clientY - (player.y + 20), e.clientX - (player.x + 20));
});
window.addEventListener('mousedown', () => {
    bullets.push(new Bullet(player.x+20, player.y+20, player.angle));
});

update();
