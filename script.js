function Player(name, symbol) {
    this.name = name;
    this.symbol = symbol;
}

const game = (function() {
    const board = Array.from({ length: 3 }, () => Array(3).fill('.'));

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

    return {
        hasPlayerWon, place
    };
})();