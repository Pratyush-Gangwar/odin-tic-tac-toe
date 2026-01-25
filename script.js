function Player(name, symbol) {
    this.name = name;
    this.symbol = symbol;
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

    function getPlayers() {
        const name1 = prompt("Player 1, enter your name: ");
        const symbol1 = prompt("Player 1, enter your symbol (X/O): ");
        const player1 = new Player(name1, symbol1);

        const name2 = prompt("Player 2, enter your name: ");
        const symbol2 = (symbol1 === 'O' ? 'X' : 'O');
        const player2 = new Player(name2, symbol2);

        return {player1, player2};
    }

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

const gameSession = makeGameSession();
gameSession.start();