const canvas = document.getElementById('shootingGame');
const ctx = canvas.getContext('2d');

const GAME = {
    WORLD_SIZE: 4000,
    GRID_SIZE: 200,
    keys: {},
    isMouseDown: false,
    mouseX: 0,
    mouseY: 0
};

class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.radius = 8;
        this.speed = 10;
        this.maxDistance = 400;
        this.angle = angle;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    isDead() {
        const dx = this.x - this.startX;
        const dy = this.y - this.startY;
        return Math.sqrt(dx * dx + dy * dy) > this.maxDistance;
    }

    render(camX, camY) {
        ctx.fillStyle = '#00B2E1';
        ctx.beginPath();
        ctx.arc(this.x - camX, this.y - camY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0085A8'; 
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Player {
    constructor() {
        this.x = GAME.WORLD_SIZE / 2;
        this.y = GAME.WORLD_SIZE / 2;
        this.radius = 20;
        
        this.barrelLength = 30;
        this.barrelWidth = 20;

        this.speedX = 0;
        this.speedY = 0;
        
        // 1. 물리 엔진용 변수 추가
        this.accel = 0.6;        // 키보드 입력 시 가속도
        this.friction = 0.92;    // 마찰력 (1프레임당 속도가 92%로 줄어듦)
        this.recoilPower = 4;    // 총기 반동 세기
        
        this.bullets = [];
        this.fireRate = 150;
        this.lastFired = 0;
    }

    getAngle(drawX, drawY) {
        return Math.atan2(GAME.mouseY - drawY, GAME.mouseX - drawX);
    }

    update() {
        // 2. 이동 로직 간소화 (가속도만 더해줌)
        if (GAME.keys['KeyW'] || GAME.keys['ArrowUp']) this.speedY -= this.accel;
        if (GAME.keys['KeyS'] || GAME.keys['ArrowDown']) this.speedY += this.accel;
        if (GAME.keys['KeyA'] || GAME.keys['ArrowLeft']) this.speedX -= this.accel;
        if (GAME.keys['KeyD'] || GAME.keys['ArrowRight']) this.speedX += this.accel;

        // 3. 마찰력 적용 (자연스러운 감속 및 최고 속도 제한 효과)
        this.speedX *= this.friction;
        this.speedY *= this.friction;

        this.x += this.speedX;
        this.y += this.speedY;

        // 월드 경계 제한
        this.x = Math.max(this.radius, Math.min(GAME.WORLD_SIZE - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(GAME.WORLD_SIZE - this.radius, this.y));

        if (GAME.isMouseDown) this.fire();

        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b => !b.isDead());
    }

    fire() {
        const now = Date.now();
        if (now - this.lastFired > this.fireRate) {
            const drawX = this.x - (this.x - canvas.width / 2);
            const drawY = this.y - (this.y - canvas.height / 2);
            const angle = this.getAngle(drawX, drawY);

            const bulletStartX = this.x + Math.cos(angle) * this.barrelLength;
            const bulletStartY = this.y + Math.sin(angle) * this.barrelLength;

            this.bullets.push(new Bullet(bulletStartX, bulletStartY, angle));
            this.lastFired = now;

            // 4. 반동(Recoil) 적용
            // 발사하는 각도의 반대 방향으로 speedX, speedY에 힘을 가함
            this.speedX -= Math.cos(angle) * this.recoilPower;
            this.speedY -= Math.sin(angle) * this.recoilPower;
        }
    }

    render(camX, camY) {
        const drawX = this.x - camX;
        const drawY = this.y - camY;

        this.bullets.forEach(b => b.render(camX, camY));

        ctx.save();
        ctx.translate(drawX, drawY);
        const angle = this.getAngle(drawX, drawY);
        ctx.rotate(angle);
        
        ctx.fillStyle = '#999999';
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.fillRect(0, -this.barrelWidth/2, this.barrelLength, this.barrelWidth); 
        ctx.strokeRect(0, -this.barrelWidth/2, this.barrelLength, this.barrelWidth);
        ctx.restore();

        ctx.fillStyle = '#00B2E1';
        ctx.beginPath();
        ctx.arc(drawX, drawY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0085A8'; 
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

document.addEventListener('keydown', e => GAME.keys[e.code] = true);
document.addEventListener('keyup', e => GAME.keys[e.code] = false);
document.addEventListener('mousedown', () => GAME.isMouseDown = true);
document.addEventListener('mouseup', () => GAME.isMouseDown = false);
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    GAME.mouseX = e.clientX - rect.left;
    GAME.mouseY = e.clientY - rect.top;
});

const player = new Player();

function drawGrid(camX, camY) {
    ctx.strokeStyle = '#afafaf';
    ctx.lineWidth = 1;
    let offsetX = -(camX % GAME.GRID_SIZE);
    let offsetY = -(camY % GAME.GRID_SIZE);

    ctx.beginPath();
    for (let x = offsetX; x < canvas.width; x += GAME.GRID_SIZE) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
    }
    for (let y = offsetY; y < canvas.height; y += GAME.GRID_SIZE) {
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}

function gameLoop() {
    player.update();

    const camX = player.x - canvas.width / 2;
    const camY = player.y - canvas.height / 2;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid(camX, camY);
    player.render(camX, camY);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);