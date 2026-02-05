/*
Since games can be restarted, the game board (and related methods) are best suited to be an object. However, we want the board to be truly private and so we use an object factory over constructor functions. 

Similarly, game sessions should also be an object. We don't really need any private variables for it. So we could've used either object factories or constructor functions. We chose object factories since we had already used them.

TODO:
disabled still shows hover
*/


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Score() {
    this["x-score"] = 0;
    this["o-score"] = 0;
    this.draws = 0;
}

function makeGameState() {
    let moves = 0;
    let turn = 'x';

    let board = Array.from({ length: 3 }, () => Array(3).fill('.')); // private

    function hasCurrentTurnWonRow() {
        for(const row of board) {
            let won = true;

            for(const cell of row) {
                if (cell != turn) {
                    won = false;
                    break;
                }
            }

            if (won) return true;
        }

        return false;
    }  

    function hasCurrentTurnWonCol() {
        for(let j = 0; j < board.length; j++) {
            let won = true;
            
            for(let i = 0; i < board.length; i++) {
                if (board[i][j] != turn) {
                    won = false;
                    break;
                }
            }

            if (won) return true;
        }

        return false;
    }

    function hasCurrentTurnWonDiag() {
        // Left
        let won = true;

        for (let i = 0; i < board.length; i++) {
            if (board[i][i] != turn) {
                won = false;
                break;
            }
        }

        if (won) return true;

        // Right
        won = true;
        for (let i = 0; i < board.length; i++) {
            if (board[i][board.length - 1 - i] != turn) {
                won = false;
                break;
            }
        }

        return won;
    }

    function hasCurrentTurnWon() {
        return hasCurrentTurnWonRow() || hasCurrentTurnWonCol() || hasCurrentTurnWonDiag();
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
        hasCurrentTurnWon, placeCurrentTurn, printBoard, getMoves, reset, getTurn, invertTurn
    };
};

const gameState = makeGameState();
const score = new Score();

(function documentController() {

    function resetDOMBoard() {
        const grid = document.querySelector(".grid");

        for (const child of grid.children) {
            child.classList.remove("marked");
            child.classList.remove("marked-x");
            child.classList.remove("marked-o");

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

    function updateTurnDOM(oldTurn, newTurn) {
        const grid = document.querySelector('.grid');

        grid.classList.remove(`turn-${oldTurn}`);
        grid.classList.add(`turn-${newTurn}`);

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
        cell.classList.add("marked");

        cell.innerHTML = svgText; 
        cell.disabled = true; 
    }

    async function updateGameState(row, col) {
        let oldTurn = gameState.getTurn();
        gameState.placeCurrentTurn(row, col);

        if (gameState.hasCurrentTurnWon()) {
            console.log(`Turn ${gameState.getTurn()} won!`);
            

            disableBoard();
            await sleep(1500);

            gameState.reset();
            resetDOMBoard();

            return;
        }

        else if (gameState.getMoves() == 9) {
            console.log("It's draw!");
            return;
        }

        gameState.invertTurn();
        let newTurn = gameState.getTurn();
        updateTurnDOM(oldTurn, newTurn);

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
    }

    initialize();
})();

