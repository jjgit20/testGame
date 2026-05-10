const gridSize = document.getElementById("gridSize")
const turn = document.getElementById("turn");
const board = document.getElementById("board");
const btnPlayer = document.getElementById("btnPlayer");
const btnComputer = document.getElementById("btnComputer");

btnPlayer.classList.add('active');

let size = 3;
let gameActive = true;
let isPlayerTurn = true; // 'Player'
let statusArr = [];
let cellElements = [];
let winningCells = [];

let indexP = 0;
let indexC = 0;

// function checkWin(who, size)
// status array
// function playerInput() -> updates status array
// function ai() -> updates status array
// function render() -> rerenders the board with curr status array
// function main() -> checks who is winning every turn

function setGame() {
    size = parseInt(gridSize.value);
    gameActive = true;
    isPlayerTurn = btnPlayer.classList.contains('active');
    turn.innerText = (isPlayerTurn ? 'Player' : 'Computer');
    statusArr = [];
    cellElements = [];
    winningCells = [];
    indexP = 0;
    indexC = 0;

    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    board.innerHTML = '';

    statusArr = Array(size * size).fill('');

    cellElements = [];
    for(let i = 0; i < size*size; ++i) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => {playerTurn(i);});

        board.appendChild(cell);
        cellElements.push(cell);
    }

    for(let i = 0; i < size*size; ++i) {
        cellElements[i].innerText = statusArr[i];
    }
    
    if(!isPlayerTurn) aiTurn();
}

function setPlayer(choice) {
    isPlayerTurn = (choice === 'Player' ? true : false);

    if (choice === 'Player') {
        turn.innerText = 'Player';
        btnPlayer.classList.add('active');
        btnComputer.classList.remove('active');
    } else {
        turn.innerText = 'Computer';
        btnComputer.classList.add('active');
        btnPlayer.classList.remove('active');
    }
}

function playerTurn(index) {
    if (statusArr[index] !== "" || !gameActive || !isPlayerTurn) return;

    statusArr[index] = 'O';
    cellElements[index].innerText = 'O';
    isPlayerTurn = false;
    turn.innerText = 'Computer';
    indexP = index;

    if(checkWin('Player')) gameFin('Player');
    else if (!statusArr.includes("")) gameFin('None');
    else aiTurn();
    
    return;
}

async function aiTurn() {
    if (!gameActive || isPlayerTurn) return;
    await new Promise(resolve => setTimeout(resolve, 200));

    let strategyIndex;
    let [bestLineP, possibleSlotsP, bestScoreP] = getBestLine(indexP, 'O');
    let [bestLineC, possibleSlotsC, bestScoreC] = getBestLine(indexC, 'X');

    if (bestScoreC >= bestScoreP && possibleSlotsC.length > 0) {
        strategyIndex = possibleSlotsC[0];
    } 
    else if (bestScoreP > bestScoreC && possibleSlotsP.length > 0) {
        strategyIndex = possibleSlotsP[0];
    } 
    else {
        const emptySlots = statusArr.map((v, i) => v === '' ? i : null).filter(v => v !== null);
        if (emptySlots.length > 0) {
            strategyIndex = emptySlots[Math.floor(Math.random() * emptySlots.length)];
        }
    }

    statusArr[strategyIndex] = 'X';
    cellElements[strategyIndex].innerText = 'X';
    isPlayerTurn = true;
    turn.innerText = 'Player';
    indexC = strategyIndex;

    if(checkWin('Computer')) gameFin('Computer');
    else if (!statusArr.includes("")) gameFin('None');

    return;
}

function gameFin(unit) {
    if(unit === 'None') turn.innerText = "무승부입니다! 🤝";
    else {
        console.log(winningCells);
        winningCells.forEach(index => board.children[index].classList.add('win-highlight'));
        turn.innerText = (unit === 'Player' ? "축하합니다! 당신이 승리했습니다! 🎉" : "Computer가 승리했습니다! 🤖");
    }

    gameActive = false;
    return;
}

function getBestLine(index, playerColor) {
    // 4개의 축 정의: [dx, dy] (방향 벡터)
    const axes = [[1, 0], [0, 1], [1, 1], [1, -1]];

    const lines = [];
    for(let i = 0; i < 4; ++i) lines.push(getLineOnAxis(index, axes[i][0], axes[i][1], playerColor));

    let bestLineScore = 0;
    let bestLineIndex = 0;

    for(let i = 0; i < 4; ++i) {
        let lineScore = lines[i].Line.length;
        if (lineScore > bestLineScore) {
            bestLineScore = lineScore;
            bestLineIndex = i;
        }
    }

    return [lines[bestLineIndex].Line, lines[bestLineIndex].Possible, bestLineScore];
}

function getLineOnAxis(index, dx, dy, playerColor) {
    const x = index % size;
    const y = Math.floor(index / size);
    let line = [index]; 
    let possibleSlots = [];

    // 정방향 탐색
    let nx = x + dx;
    let ny = y + dy;
    // 조건: 보드 안이고 + 탐색하는 곳의 돌이 내가 방금 놓은 돌과 같은가?
    while (nx >= 0 && nx < size && ny >= 0 && ny < size && statusArr[ny * size + nx] === playerColor) {
        line.push(ny * size + nx);
        nx += dx;
        ny += dy;
    }
    if(nx >= 0 && nx < size && ny >= 0 && ny < size && statusArr[ny * size + nx] === '') possibleSlots.push(ny * size + nx);

    // 역방향 탐색
    nx = x - dx;
    ny = y - dy;
    while (nx >= 0 && nx < size && ny >= 0 && ny < size && statusArr[ny * size + nx] === playerColor) {
        line.unshift(ny * size + nx);
        nx -= dx;
        ny -= dy;
    }
    if(nx >= 0 && nx < size && ny >= 0 && ny < size && statusArr[ny * size + nx] === '') possibleSlots.push(ny * size + nx);

    line.sort();

    return {'Line': line, 'Possible': possibleSlots}; 
}

function checkWin(unit) {
    let playerColor = (unit === 'Player' ? 'O' : 'X');
    let lastMove = (unit === 'Player' ? indexP : indexC);
    const [bestLine, possibleSlots, bestScore] = getBestLine(lastMove, playerColor);

    let winCondition = (size < 5 ? size : 5);

    if(unit === 'Player') {
        if (bestScore >= winCondition) {
            winningCells = bestLine;
            return true;
        }
    } 
    else if (unit === 'Computer') {
        if (bestScore >= winCondition) {
            winningCells = bestLine;
            return true;
        }
    }
    return false;
}

setGame();