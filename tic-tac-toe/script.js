const gridSize = document.getElementById("gridSize")
const turn = document.getElementById("turn");
const board = document.getElementById("board");

let size = 3;
let currTurn = turn;
let statusArr = [];
let cellElements = [];

// function checkWin(who, size)
// status array
// function playerInput() -> updates status array
// function ai() -> updates status array
// function render() -> rerenders the board with curr status array
// function main() -> checks who is winning every turn

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

    board.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell')) {
            const index = e.target.getAttribute('data-index');
            playerInput(index);
        }
    });
}

function playerInput(index) {
    if(statusArr[index] == '') return;
    else {
        updateGameState(index, 'O');
        currTurn = 'Computer';
    }
}

function updateGameState(index, text) {
    statusArr[index] = text;
    cellElements[index].innerText = text;
}

function renderBorad() {
    for(let i = 0; i < size*size; ++i) {
        cellElements[i].innerText = statusArr[i];
    }
}

function checkWin(player, size) {
    
}

function aiAlgorithm() {
    
}

function applySettings() {
    let inputSize = parseInt(gridSize.value);
    size = inputSize;
    for(let i = 0; i < size*size; ++i) statusArr.push('');


    resetGame();
    renderBorad();
}



function main() {

}

applySettings();
main();