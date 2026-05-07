const gridSize = document.getElementById("gridSize")
const turn = document.getElementById("turn");
const board = document.getElementById("board");
const selectedUnit = document.getElementById("selectedUnit");
const btnPlayer = document.getElementById("btnPlayer");
const btnComputer = document.getElementById("btnComputer");

btnPlayer.classList.add('active');

let size = 3;
let gameActive = true;
let isPlayerTurn = true; // 'Player'
let statusArr = [];
let cellElements = [];

let indexP = 0;
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
    statusArr = [];
    for(let i = 0; i < size*size; ++i) statusArr.push('');

    resetGame();
}

function setPlayer(choice) {
    selectedUnit.value = choice;

    if (choice === 'Player') {
        btnPlayer.classList.add('active');
        btnComputer.classList.remove('active');
    } else {
        btnComputer.classList.add('active');
        btnPlayer.classList.remove('active');
    }
}

function resetGame() {
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
            playerTurn(index);
        }
    });

    if(selectedUnit.value === 'Computer') aiTurn();
}

function playerTurn(index) {
    if (gameState[index] !== "" || !gameActive || !isPlayerTurn) return;

    statusArr[index] = 'O';
    cellElements[index].innerText = 'O';
    isPlayerTurn = false;
    turn.innerText = 'Computer';
    indexP = index;

    if(checkWin('Player')) gameFin('Player');
    else if (!gameState.includes("")) gameFin('None');
    else aiTurn();
    
    return;
}

function aiTurn() {
    if (!gameActive || isPlayerTurn) return;

    if(checkWin('Computer')) gameFin('Computer');
    else if (!gameState.includes("")) gameFin('None');

    return;
}

function gameFin(unit) {
    if(unit === 'None') statusElement.innerText = "무승부입니다! 🤝";
    else {
        winningCells.forEach(index => boardElement.children[index].classList.add('win-highlight'));
        statusElement.innerText = (unit === 'Player' ? "축하합니다! 당신이 승리했습니다! 🎉" : "AI가 승리했습니다! 🤖");
    }
    
    gameActive = false;

    return;
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

function checkPlayerWin() {
    let playerColor = (currTurn == 'Player' ? 'O' : 'X');
    const [bestIdx, bestScore] = getLinesThrough(lastMoveIndex, playerColor);

    let winCondition = (size < 5 ? size : 5);

    if (bestScore >= winCondition) {
        return currTurn; // 승리자 반환
    }
    return 'none';
}

function gameStateUpdate(gameState) {
    gameActive = gameState;

    if()
}







function main() {
    indexP = yP * size + xP;
    indexC = yC * size + xC;
}

start();
main();