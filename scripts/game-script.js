`Since games can be restarted, the game board (and related methods) are best suited to be an object. However, we want the board to be truly private and so we use an object factory over constructor functions. 

Similarly, game sessions should also be an object. We don't really need any private variables for it. So we could've used either object factories or constructor functions. We chose object factories since we had already used them. `

let turn = 'x';

function invertTurn() {
    const grid = document.querySelector('.grid');
    grid.classList.remove(`turn-${turn}`);

    if (turn === 'x') turn = 'o';
    else if (turn === 'o') turn = 'x';

    grid.classList.add(`turn-${turn}`);

    updateTurnIndicator();
}

function updateTurnIndicator() {
    const svgContainer = document.querySelector('.turn-indicator .svg-container');

    fetch(`./assets/img/${turn}-icon.svg`)
    .then(res => res.text())
    .then(svgText => {
        svgContainer.innerHTML = svgText;
    });
    
}

function makeGameState() {
    const board = Array.from({ length: 3 }, () => Array(3).fill('.')); // private

    function hasPlayerWonRow(player) {
        for(const row of board) {
            let won = true;

            for(const cell of row) {
                if (cell != player.symbol) {
                    won = false;
                    break;
                }
            }

            if (won) return true;
        }

        return false;
    }  

    function hasPlayerWonCol(player) {
        for(let j = 0; j < board.length; j++) {
            let won = true;
            
            for(let i = 0; i < board.length; i++) {
                if (board[i][j] != player.symbol) {
                    won = false;
                    break;
                }
            }

            if (won) return true;
        }

        return false;
    }

    function hasPlayerWonDiag(player) {
        // Left
        let won = true;

        for (let i = 0; i < board.length; i++) {
            if (board[i][i] != player.symbol) {
                won = false;
                break;
            }
        }

        if (won) return true;

        // Right
        won = true;
        for (let i = 0; i < board.length; i++) {
            if (board[i][board.length - 1 - i] != player.symbol) {
                won = false;
                break;
            }
        }

        return won;
    }

    function hasPlayerWon(player) {
        return hasPlayerWonRow(player) || hasPlayerWonCol(player) || hasPlayerWonDiag(player);
    }

    function place(i, j, symbol) {
        board[i][j] = symbol;
    }

    function printBoard() {
        for(const row of board) {
            console.log(row);
        }
    }

    return {
        hasPlayerWon, place, printBoard
    };
};

function makeGameSession() {

    function start() {
        const players = getPlayers();
        const gameState = makeGameState();

        let moves = 0;
        let gameFinished = false;

        while (!gameFinished) {
            
            for(const player of Object.values(players)) {
                gameState.printBoard();

                const row = prompt(`Player ${player.name}, enter your row: `);
                const col = prompt(`Player ${player.name}, enter your col: `);

                gameState.place(row, col, player.symbol);
                moves++;

                if (gameState.hasPlayerWon(player)) {
                    gameState.printBoard();
                    console.log(`Player ${player.name} won!`);
                    gameFinished = true;
                    break;
                }

                else if (moves == 9) {
                    gameState.printBoard();
                    console.log("It's draw!");
                    gameFinished = true;
                    break;
                }

            }
        }
    }

    return {start};

};

(function documentController() {
    // Populate initial turn

    const gridCells = document.querySelectorAll(".grid button");

    gridCells.forEach( cell => {

        cell.addEventListener("click", async () => {
            
            fetch(`./assets/img/${turn}-icon.svg`)
                .then(res => res.text())
                .then(svgText => {
                    cell.classList.add(`marked-${turn}`);
                    cell.classList.add("marked");

                    cell.innerHTML = svgText; // to understand
                    cell.disabled = true; 

                    invertTurn();
                });

        });

    });

})();

const gameSession = makeGameSession();
// gameSession.start();
