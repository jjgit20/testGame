const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreVal = document.getElementById("scoreVal");
const unit = 20;
let score = 0;

let ranX = Math.floor(Math.random() * 19 + 1) * unit;
let ranY = Math.floor(Math.random() * 19 + 1) * unit;
let food = {x: ranX, y: ranY};

let snake = [{x:9*unit, y:9*unit}];

// 방향키 코드: 왼쪽(37), 위(38), 오른쪽(39), 아래(40)
let currDir = 0;

document.addEventListener("keydown", changeDir);

function changeDir(event) {
    let newDir = event.keyCode;
    if(newDir == 37 && currDir != 39) currDir = newDir;
    else if(newDir == 38 && currDir != 40) currDir = newDir;
    else if(newDir == 39 && currDir != 37) currDir = newDir;
    else if(newDir == 40 && currDir != 38) currDir = newDir;
}

function spawnFood() {
    ranX = Math.floor(Math.random() * 19 + 1) * unit;
    ranY = Math.floor(Math.random() * 19 + 1) * unit;
    food = {x: ranX, y: ranY};
}

function checkEatFood(head) {
    let x = head.x;
    let y = head.y;
    if(x == food.x && y == food.y) return true;
    return false;
}

function selfCollision(head) {
    let x = head.x;
    let y = head.y;
    for(let i = 1; i < snake.length; ++i) {
        let bodyX = snake[i].x;
        let bodyY = snake[i].y;
        if(x == bodyX && y == bodyY) return true;
    }
    return false;
}

function wallCollision(head) {
    let x = head.x;
    let y = head.y;
    if(x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return true;
    return false;
}

function checkGameOver(head) {
    if(selfCollision(head) || wallCollision(head)) return true;
    return false;
}

function move() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if(currDir == 37) headX -= unit;
    if(currDir == 39) headX += unit;
    if(currDir == 38) headY -= unit;
    if(currDir == 40) headY += unit;

    let newHead = {x: headX, y: headY};
    snake.unshift(newHead);

    if(checkEatFood(snake[0])) {
        ++score;
        scoreVal.innerHTML = score;
        spawnFood();
    } else {
        snake.pop();
    }
}

function draw() {
    // 배경 그리기 (이전 화면 지우기)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // 뱀 전진 알고리즘
    move();

    // 게임오버 조건
    if(checkGameOver(snake[0])) {
        clearInterval(game);
        alert("Game Over! Score: " + score);
        location.reload();
    }

    // 뱀 그리기
    for(let i = 0; i < snake.length; ++i) {
        ctx.fillStyle = ((i==0) ? "#2ecc71" : "#27ae60");
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    }

    // 먹이 그리기
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, unit, unit);
}

// 0.1초(100ms)마다 draw 함수를 실행
let game = setInterval(draw, 100);
