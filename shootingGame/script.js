const canvas = document.getElementById('shootingGame');
const ctx = canvas.getContext('2d');

// 게임 설정
const WORLD_SIZE = 4000;
const GRID_SIZE = 200;

// 플레이어 초기 상태
let player = {
    x: WORLD_SIZE / 2,
    y: WORLD_SIZE / 2,
    radius: 20,
    speedX: 0,
    speedY: 0,
    maxSpeed: 5,
    accel: 0.5,
    mouseX: 0, // 추가: 마우스 X 좌표
    mouseY: 0,  // 추가: 마우스 Y 좌표
    bullets: [],
    bulletSpeed: 7,
    fireRate: 200, // 밀리초 단위 쿨타임
    lastFired: 0   // 마지막 발사 시간
};

// 입력 상태 저장
let keys = {};
let isMouseDown = false;

document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

document.addEventListener('mousemove', (e) => {
    // 캔버스 내에서의 상대 좌표를 구하는 방법
    const rect = canvas.getBoundingClientRect();
    player.mouseX = e.clientX - rect.left;
    player.mouseY = e.clientY - rect.top;
});

document.addEventListener('mousedown', () => isMouseDown = true);
document.addEventListener('mouseup', () => isMouseDown = false);

// 1. 그리드 그리기 함수
function drawGrid(camX, camY) {
    ctx.strokeStyle = '#5f5f5f';
    ctx.lineWidth = 1;

    let offsetX = -camX % GRID_SIZE;
    let offsetY = -camY % GRID_SIZE;

    ctx.beginPath();
    for (let x = offsetX; x < canvas.width; x += GRID_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = offsetY; y < canvas.height; y += GRID_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}

// 2. 상태 업데이트 (로직)
function update() {
    // if (keys['KeyW'] || keys['ArrowUp']) player.y -= player.speed;
    // if (keys['KeyS'] || keys['ArrowDown']) player.y += player.speed;
    // if (keys['KeyA'] || keys['ArrowLeft']) player.x -= player.speed;
    // if (keys['KeyD'] || keys['ArrowRight']) player.x += player.speed;

    if (player.speedY >= -player.maxSpeed && (keys['KeyW'] || keys['ArrowUp'])) player.speedY -= player.accel;
    if (player.speedY <= player.maxSpeed && (keys['KeyS'] || keys['ArrowDown'])) player.speedY += player.accel;
    if (player.speedX >= -player.maxSpeed && (keys['KeyA'] || keys['ArrowLeft'])) player.speedX -= player.accel;
    if (player.speedX <= player.maxSpeed && (keys['KeyD'] || keys['ArrowRight'])) player.speedX += player.accel;

    if (player.speedY < 0 && !(keys['KeyW'] || keys['ArrowUp'])) player.speedY += player.accel;
    if (player.speedY > 0 && !(keys['KeyS'] || keys['ArrowDown'])) player.speedY -= player.accel;
    if (player.speedX < 0 && !(keys['KeyA'] || keys['ArrowLeft'])) player.speedX += player.accel;
    if (player.speedX > 0 && !(keys['KeyD'] || keys['ArrowRight'])) player.speedX -= player.accel;

    player.y += player.speedY;
    player.x += player.speedX;

    // 월드 경계 제한
    player.x = Math.max(player.radius, Math.min(WORLD_SIZE - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(WORLD_SIZE - player.radius, player.y));

    if (isMouseDown) {
        fireBullet();
    }
}

// 3. 화면 그리기 (렌더링)
function render() {
    // 화면 초기화
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 배경 그리드 (카메라 오프셋 적용)
    drawGrid(player.x - canvas.width / 2, player.y - canvas.height / 2);

    renderPlayer();
    renderBullets();
}

function renderPlayer() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 1. 포신 그리기
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // 마우스 좌표를 이용하여 각도 계산
    const angle = Math.atan2(player.mouseY - centerY, player.mouseX - centerX);
    ctx.rotate(angle);

    ctx.fillStyle = '#999999';
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    
    ctx.fillRect(0, -10, player.radius + 15, 20); 
    ctx.strokeRect(0, -10, player.radius + 15, 20);
    ctx.restore();

    // 2. 몸통 그리기
    ctx.fillStyle = '#00B2E1';
    ctx.beginPath();
    ctx.arc(centerX, centerY, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#0085A8'; 
    ctx.lineWidth = 2;
    ctx.stroke();
}

function fireBullet() {
    const now = Date.now();
    if (now - player.lastFired > player.fireRate) {
        // 탄환 객체 생성 및 배열에 추가하는 로직
        player.bullets.push({
            x: 0, // 캔버스 중앙을 기준으로 상대 좌표 사용
            y: 0,
            startX: 0, // 발사된 초기 위치
            startY: 0,
            radius: 12,
            angle: Math.atan2(player.mouseY - canvas.height/2, player.mouseX - canvas.width/2),
            speed: player.bulletSpeed,
            maxDistance: 300,
            distanceTraveled: 0 // 이동 거리 추적
        });
        player.lastFired = now;
    }
}

function renderBullets() {
    for (let i = player.bullets.length - 1; i >= 0; i--) {
        let b = player.bullets[i];

        // 1. 이동 및 거리 업데이트
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;
        
        // 피타고라스 정리를 이용한 실제 이동 거리 계산
        let dx = b.x - b.startX;
        let dy = b.y - b.startY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // 2. 사거리 초과 시 제거
        if (dist > player.bullets.maxDistance) {
            player.bullets.splice(i, 1);
            continue;
        }

        // 3. 그리기 (플레이어 중앙 기준)
        ctx.fillStyle = '#00B2E1';
        ctx.beginPath();
        ctx.arc(canvas.width / 2 + b.x, canvas.height / 2 + b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#0085A8'; 
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// 4. 메인 게임 루프
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop); // 여기에서만 루프 호출!
}

// 게임 시작
requestAnimationFrame(gameLoop);