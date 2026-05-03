const gridSize = document.getElementById("gridSize")
const turn = document.getElementById("turn");
const board = document.getElementById("board");

let size = 3;

function applySettings() {
    let inputSize = parseInt(gridSize.value);
    size = inputSize;

    resetGame();
}

function resetGame() {
    // 보드 UI 렌더링
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.innerHTML = '';

    for(let i = 0; i < size*size; ++i) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);

        board.appendChild(cell);
    }
}

applySettings();