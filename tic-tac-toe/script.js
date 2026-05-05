const gridSize = document.getElementById("gridSize")
const turn = document.getElementById("turn");
const board = document.getElementById("board");

let size = 3;
let gameActive = true;
let playersTurn = true; // 'Player'
// let playerColor = (currTurn == 'Player' ? 'O' : 'X');
let statusArr = [];
let cellElements = [];

// let xP = 0;
// let yP = 0;
let indexP = 0;

// let xC = 0;
// let yC = 0;
let indexC = 0;

// function checkWin(who, size)
// status array
// function playerInput() -> updates status array
// function ai() -> updates status array
// function render() -> rerenders the board with curr status array
// function main() -> checks who is winning every turn

function start() {
    let inputSize = parseInt(gridSize.value);
    size = inputSize;
    for(let i = 0; i < size*size; ++i) statusArr.push('');

    resetGame();
}

function resetGame() {
    // 보드 UI 렌더링
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    board.innerHTML = '';

    cellElements = [];

    for(let i = 0; i < size*size; ++i) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => {playerInput(i);});

        board.appendChild(cell);
        cellElements.push(cell);
    }

    for(let i = 0; i < size*size; ++i) {
        cellElements[i].innerText = statusArr[i];
    }

    board.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell')) {
            const index = e.target.getAttribute('data-index');
            playerInput(index);
        }
    });
}

function playerInput(index) {
    if(statusArr[index] === '' && gameActive && playersTurn) {
        playersTurn = false;
        indexP = index;
        updateCellText(index, 'O');
        updateTurnText(playersTurn);
    }
    return;
}

function updateCellText(index, playerColor) {
    statusArr[index] = playerColor;
    cellElements[index].innerText = playerColor;
}

function updateTurnText(playersTurn) {
    turn.innerText = (playersTurn ? 'Player' : 'Computer');
}

function getLinesThrough(index, playerColor) {
    const x = index % size;
    const y = Math.floor(index / size);

    // 4개의 축 정의: [dx, dy] (방향 벡터)
    const axes = [[1, 0], [0, 1], [1, 1], [1, -1]];

    const lines = [];
    for(let i = 0; i < 4; ++i) lines.push(getLineOnAxis(x, y, axes[i][0], axes[i][1], playerColor));

    let bestLineScore = 0;
    let bestLineIndex = 0;

    for(let i = 0; i < 4; ++i) {
        let currScore = line.length;
        if (currScore > bestLineScore) {
            bestLineScore = currScore;
            bestLineIndex = i;
        }
    }

    return [bestLineIndex, bestLineScore];
}

function getLineOnAxis(startX, startY, dx, dy, playerColor) {
    let line = [startY * size + startX]; 

    // 정방향 탐색
    let nx = startX + dx;
    let ny = startY + dy;
    // 조건: 보드 안이고 + 탐색하는 곳의 돌이 내가 방금 놓은 돌과 같은가?
    while (nx >= 0 && nx < size && ny >= 0 && ny < size && statusArr[ny * size + nx] === playerColor) {
        line.push(ny * size + nx);
        nx += dx;
        ny += dy;
    }

    // 역방향 탐색
    nx = startX - dx;
    ny = startY - dy;
    while (nx >= 0 && nx < size && ny >= 0 && ny < size && statusArr[ny * size + nx] === playerColor) {
        line.unshift(ny * size + nx);
        nx -= dx;
        ny -= dy;
    }

    return line; 
}

function checkWinner() {
    let playerColor = (currTurn == 'Player' ? 'O' : 'X');
    const [bestIdx, bestScore] = getLinesThrough(lastMoveIndex, playerColor);

    let winCondition = (size < 5 ? size : 5);

    if (bestScore >= winCondition) {
        return currTurn; // 승리자 반환
    }
    return 'none';
}

function aiAlgorithm() {
    if(!playersTurn && gameActive) {
        playersTurn = true;
    }
}





function main() {
    indexP = yP * size + xP;
    indexC = yC * size + xC;
}

start();
main();