/*
Since games can be restarted, the game state (and related methods) are best suited to be an object. However, we want the board to be truly private and so we use an object factory over constructor functions. 
*/


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Score() {
    this.x = 0;
    this.o = 0;
    this.draw = 0;
}

function makeGameState() {
    let moves = 0;
    let turn = 'x';

    let board = Array.from({ length: 3 }, () => Array(3).fill('.')); // private

    function getWinningRowIDs() {
        for(let rowIdx = 0; rowIdx < board.length; rowIdx++) {
            let won = true;

            for(const cell of board[rowIdx]) {
                if (cell != turn) {
                    won = false;
                    break;
                }
            }

            if (won) return [ rowIdx * 3, rowIdx * 3 + 1, rowIdx * 3 + 2 ]
        }

        return [];
    }  

    function getWinningColIDs() {
        for(let colIdx = 0; colIdx < board.length; colIdx++) {
            let won = true;
            
            for(let rowIdx = 0; rowIdx < board.length; rowIdx++) {
                if (board[rowIdx][colIdx] != turn) {
                    won = false;
                    break;
                }
            }

            if (won) return [ colIdx, colIdx + 3, colIdx + 6 ];
        }

        return [];
    }

    function getWinningDiagIDs() {
        // Left
        let won = true;

        for (let i = 0; i < board.length; i++) {
            if (board[i][i] != turn) {
                won = false;
                break;
            }
        }

        if (won) return [0, 4, 8];

        // Right
        won = true;
        for (let i = 0; i < board.length; i++) {
            if (board[i][board.length - 1 - i] != turn) {
                won = false;
                break;
            }
        }

        if (won) return [2, 4, 6];
        else return [];
    }

    function getWinningIDs() {
        const winngRowIDs = getWinningRowIDs();
        if (winngRowIDs.length !== 0) return winngRowIDs;

        const winngColIDs = getWinningColIDs();
        if (winngColIDs.length !== 0) return winngColIDs;

        const winngDiagIDs = getWinningDiagIDs();
        if (winngDiagIDs.length !== 0) return winngDiagIDs;

        return [];
    }

    function placeCurrentTurn(i, j) {
        board[i][j] = turn;
        moves++;
    }

    function invertTurn() {
        if (turn === 'x') turn = 'o';
        else if (turn === 'o') turn = 'x';
    }

    function reset() {
        moves = 0;
        turn = 'x';
        board = Array.from({ length: 3 }, () => Array(3).fill('.'));
    }

    function getMoves() {
        return moves;
    }

    function getTurn() {
        return turn;
    }

    function printBoard() {
        for(const row of board) {
            console.log(row);
        }
    }

    return {
        getWinningIDs, placeCurrentTurn, printBoard, getMoves, reset, getTurn, invertTurn
    };
};

const gameState = makeGameState();
const score = new Score();

(function documentController() {

    function updateScoreDOM() {
        const scoreElem = document.querySelector(".score");
        const xScoreElem = scoreElem.querySelector(".x-score h2");
        xScoreElem.textContent = score.x;

        const oScoreElem = scoreElem.querySelector(".o-score h2");
        oScoreElem.textContent = score.o;

        const drawScoreElem = scoreElem.querySelector(".draw-score h2");
        drawScoreElem.textContent = score.draw;

    }

    function resetDOMBoard() {
        const grid = document.querySelector(".grid");

        grid.classList.remove("turn-x");
        grid.classList.add("turn-o");

        for (const child of grid.children) {
            child.classList.remove("marked-x");
            child.classList.remove("marked-o");
            child.classList.remove("won");
            child.classList.remove("draw");

            child.disabled = false;
            child.replaceChildren();
        }
    }

    function disableBoard() {
        const grid = document.querySelector(".grid");

        for (const child of grid.children) {
            child.disabled = true;
        }
    }

    function updateTurnDOM() {
        const grid = document.querySelector('.grid');

        // Remove either
        grid.classList.remove("turn-o");
        grid.classList.remove("turn-x");

        grid.classList.add(`turn-${gameState.getTurn()}`);

        updateTurnIndicator();
    }

    function updateTurnIndicator() {
        const svgContainer = document.querySelector('.turn-indicator .svg-container');

        fetch(`./assets/img/${gameState.getTurn()}-icon.svg`)
        .then(res => res.text())
        .then(svgText => {
            svgContainer.innerHTML = svgText;
        });
        
    }

    function markCell(cell, svgText) {
        cell.classList.add(`marked-${gameState.getTurn()}`);
        cell.innerHTML = svgText; 
        cell.disabled = true; 
    }

    function sessionReset() {
        gameState.reset();
        resetDOMBoard();
        updateTurnDOM();
    }

    async function handleEnd(type, winningIDs) {
        disableBoard();

        const cells = document.querySelectorAll('.grid .cell');

        for(let cellID = 0; cellID < cells.length; cellID++) {
            const cell = cells[cellID];

            if (type === 'draw') {
                cell.classList.add("draw");
                cell.classList.remove(`marked-${gameState.getTurn()}`);
            }

            else if (type === 'won' && winningIDs.includes(cellID)) {
                cell.classList.add( "won" );
                cell.classList.remove(`marked-${gameState.getTurn()}`);
            }
            
        }

        await sleep(1500);

        score[`${type === 'won' ? gameState.getTurn() : 'draw'}`]++;
        updateScoreDOM();

        sessionReset();
    }

    function updateGameState(row, col) {
        gameState.placeCurrentTurn(row, col);
        const winningIDs = gameState.getWinningIDs();

        if (winningIDs.length != 0) {
            handleEnd('won', winningIDs);
            return;
        }

        else if (gameState.getMoves() == 9) {
            handleEnd("draw");
            return;
        }

        gameState.invertTurn();
        updateTurnDOM();

    }

    function initialize() {
        const grid = document.querySelector(".grid");

        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                
                const cell = document.createElement("button");
                cell.classList.add("cell");

                cell.addEventListener("click", async () => {
                    fetch(`./assets/img/${gameState.getTurn()}-icon.svg`)
                        .then(res => res.text())
                        .then(svgText => {
                            markCell(cell, svgText);
                            updateGameState(row, col);
                        });
                });

                grid.appendChild(cell);
            }
        }

        const resetBtn = document.querySelector(".reset-button");
        resetBtn.addEventListener("click", () => sessionReset() );
    }

    initialize();
})();

