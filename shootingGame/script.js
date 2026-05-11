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
    speedX: 5,
    speedY: 5,
    accelX: 0,
    accelY: 0,
    accel: 0.5
};

// 입력 상태 저장
let keys = {};

document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

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

    if (keys['KeyW'] || keys['ArrowUp']) player.accelY -= player.accel;
    if (keys['KeyS'] || keys['ArrowDown']) player.accelY += player.accel;
    if (keys['KeyA'] || keys['ArrowLeft']) player.accelX -= player.accel;
    if (keys['KeyD'] || keys['ArrowRight']) player.accelY += player.accel;

    

    // 월드 경계 제한
    player.x = Math.max(player.radius, Math.min(WORLD_SIZE - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(WORLD_SIZE - player.radius, player.y));
}

// 3. 화면 그리기 (렌더링)
function render() {
    // 화면 초기화
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 배경 그리드 (카메라 오프셋 적용)
    drawGrid(player.x - canvas.width / 2, player.y - canvas.height / 2);

    // 플레이어 (항상 화면 중앙)
    ctx.fillStyle = '#00B2E1';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 테두리 추가 (diep.io 스타일)
    ctx.strokeStyle = '#0085A8'; 
    ctx.lineWidth = 3;
    ctx.stroke();
}

// 4. 메인 게임 루프
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop); // 여기에서만 루프 호출!
}

// 게임 시작
requestAnimationFrame(gameLoop);