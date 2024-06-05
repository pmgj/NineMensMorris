// Based on: https://kartikkukreja.wordpress.com/2014/03/17/heuristicevaluation-function-for-nine-mens-morris/

import Cell from "./Cell.js";
import CellState from "./CellState.js";
import Winner from "./Winner.js";

export default class ComputerPlayer {
    #player;
    #opponent;
    constructor(player) {
        this.#player = player;
        this.#opponent = this.#getOpponent(player);
    }
    #getOpponent(player) {
        return player === CellState.PLAYER1 ? CellState.PLAYER2 : CellState.PLAYER1;
    }
    alphabeta(node, depth = 2, alfa = -Infinity, beta = Infinity) {
        let w = node.game.isGameOver();
        if (depth === 0 || w !== Winner.NONE) {
            return { score: this.heuristic(node) };
        }
        if (node.game.getCellState() === this.#player) {
            let value = -Infinity;
            let childs = this.getAvailableMoves(node);
            for (let child of childs) {
                let score = this.alphabeta(child, depth - 1, alfa, beta).score;
                child.score = score;
                value = Math.max(value, child.score);
                if (value > beta) {
                    break; /* β cutoff */
                }
                alfa = Math.max(alfa, value);
            }
            let index = childs.reduce((iMax, x, i, arr) => x.score > arr[iMax].score ? i : iMax, 0);
            return childs[index];
        } else {
            let value = Infinity;
            let childs = this.getAvailableMoves(node);
            for (let child of childs) {
                let score = this.alphabeta(child, depth - 1, alfa, beta).score;
                child.score = score;
                value = Math.min(value, child.score);
                if (value < alfa) {
                    break; /* α cutoff */
                }
                beta = Math.min(beta, value);
            }
            let index = childs.reduce((iMax, x, i, arr) => x.score < arr[iMax].score ? i : iMax, 0);
            return childs[index];
        }
    }
    heuristic(node) {
        let { game, beginCell, endCell } = node;
        let cell = endCell ? endCell : beginCell;
        let board = game.getBoard();
        let possibleMorris = () => {
            let rowPoss = () => {
                let poss = [];
                for (let i = 0; i < board.length; i++) {
                    for (let k = 0; k < board[i].length - 2; k += 2) {
                        let temp = [];
                        for (let j = k; j <= k + 2; j++) {
                            temp.push({ value: board[i][j], cell: new Cell(i, j) });
                        }
                        poss.push(temp);
                    }
                    let temp = [];
                    for (let j = board[i].length - 2; j < board[i].length; j++) {
                        temp.push({ value: board[i][j], cell: new Cell(i, j) });
                    }
                    temp.push({ value: board[i][0], cell: new Cell(i, 0) });
                    poss.push(temp);
                }
                return poss;
            };
            let orthPoss = () => {
                let poss = [];
                for (let col = 1; col < board[0].length; col += 2) {
                    let temp = [];
                    for (let j = 0; j < board.length; j++) {
                        const element = board[j][col];
                        temp.push({ value: element, cell: new Cell(j, col) });
                    }
                    poss.push(temp);
                }
                return poss;
            };
            return rowPoss().concat(orthPoss());
        };
        let possibilities = possibleMorris();
        let closedMorris = () => {
            if (possibilities.some(p => p.every(obj => obj.value === this.#player) && p.some(obj => obj.cell.equals(cell)))) {
                return 1;
            }
            if (possibilities.some(p => p.every(obj => obj.value === this.#opponent) && p.some(obj => obj.cell.equals(cell)))) {
                return -1;
            }
            return 0;
        };
        let numberOfMorrises = () => {
            let countMorrises = p => possibilities.filter(poss => poss.every(obj => obj.value === p)).length;
            return countMorrises(this.#player) - countMorrises(this.#opponent);
        };
        let numberOfBlockedOpponentPieces = () => {
            let canMove = c => game.orthogonalMoves(c).some(c => board[c.x][c.y] === CellState.EMPTY);
            let COLS = board[0].length;
            let numberOfBlockedPieces = p => board.flat().filter((cs, i) => cs === p && !canMove(new Cell(Math.floor(i / COLS), i % COLS))).length;
            return numberOfBlockedPieces(this.#opponent) - numberOfBlockedPieces(this.#player);
        };
        let numberOfPieces = () => game.countRemainingPieces(this.#player) - game.countRemainingPieces(this.#opponent);
        let numberOfTwoPieceConfigurations = () => {
            let numberOfTwoPiece = p => {
                let count = 0;
                for (let poss of possibilities) {
                    let pieces = poss.filter(obj => obj.value === p).length;
                    let empty = poss.filter(obj => obj.value === CellState.EMPTY).length;
                    if (pieces === 2 && empty === 1) {
                        count++;
                    }
                }
                return count;
            };
            return numberOfTwoPiece(this.#player) - numberOfTwoPiece(this.#opponent);
        };
        let countDuplicates = array => {
            const uniqueElements = [];
            const duplicates = [];
            array.forEach(item => {
                if (uniqueElements.some(v => v.cell.equals(item.cell))) {
                    duplicates.push(item);
                } else {
                    uniqueElements.push(item);
                }
            });
            return duplicates.length;
        };
        let numberOfThreePieceConfigurations = () => {
            let countTwoPieceMorris = p => {
                let ret = [];
                for (let poss of possibilities) {
                    let pieces = poss.filter(obj => obj.value === p).length;
                    let empty = poss.filter(obj => obj.value === CellState.EMPTY).length;
                    if (pieces === 2 && empty === 1) {
                        ret = ret.concat(poss);
                    }
                }
                return countDuplicates(ret);
            };
            return countTwoPieceMorris(this.#player) - countTwoPieceMorris(this.#opponent);
        };
        let doubleMorris = () => {
            let doubleMorrisByPlayer = p => {
                let temp = possibilities.map((poss, i) => poss.every(obj => obj.value === p) ? i : -1);
                let indexes = temp.filter(v => v !== -1);
                let values = indexes.map(i => possibilities[i]);
                let allCells = values.flat();
                let countAll = allCells.length;
                return (countAll === 0) ? 0 : countDuplicates(allCells);
            };
            return doubleMorrisByPlayer(this.#player) - doubleMorrisByPlayer(this.#opponent);
        };
        let winningConfiguration = () => {
            let w = game.isGameOver();
            return w === Winner.DRAW || w === Winner.NONE ? 0 : w === this.#player ? 1 : -1;
        };
        let v1 = closedMorris();
        let v2 = numberOfMorrises();
        let v3 = numberOfBlockedOpponentPieces();
        let v4 = numberOfPieces();
        let v5 = numberOfTwoPieceConfigurations();
        let v6 = numberOfThreePieceConfigurations();
        let v7 = doubleMorris();
        let v8 = winningConfiguration();
        let h = 0;
        switch (game.getState()) {
            case "position":
            case "removePiece":
                h = 18 * v1 + 26 * v2 + 1 * v3 + 9 * v4 + 10 * v5 + 7 * v6;
                break;
            case "move":
                h = 14 * v1 + 43 * v2 + 10 * v3 + 11 * v4 + 8 * v7 + 1086 * v8;
                break;
            case "flying":
                h = 16 * v1 + 10 * v5 + 1 * v6 + 1190 * v8;
                break;
        }
        // console.log(`v1 = ${v1}, v2 = ${v2}, v3 = ${v3}, v4 = ${v4}, v5 = ${v5}, v6 = ${v6}, v7 = ${v7}, v8 = ${v8}, h = ${h}`);
        return h;
    }
    getAvailableMoves(node) {
        let { game, beginCell, endCell } = node;
        let player = game.getCellState();
        let cell = endCell ? endCell : beginCell;
        let moves = [];
        let board = game.getBoard();
        let poss;
        let COLS = board[0].length;
        switch (game.getState()) {
            case "position":
                poss = board.flat().map((n, i) => n === CellState.EMPTY ? new Cell(Math.floor(i / COLS), i % COLS) : undefined).filter(n => n);
                poss.forEach(c => {
                    let clone = game.clone();
                    clone.position(c);
                    moves.push({ game: clone, beginCell: c });
                });
                break;
            case "move":
                poss = board.flat().map((n, i) => n === player ? new Cell(Math.floor(i / COLS), i % COLS) : undefined).filter(n => n);
                poss.forEach(c => {
                    let positions = game.orthogonalMoves(c).filter(({ x, y }) => board[x][y] === CellState.EMPTY);
                    positions.forEach(emptyCell => {
                        let clone = game.clone();
                        clone.move(c, emptyCell);
                        moves.push({ game: clone, beginCell: c, endCell: emptyCell });
                    });
                });
                break;
            case "flying":
                let pieces = board.flat().map((n, i) => n === player ? new Cell(Math.floor(i / COLS), i % COLS) : undefined).filter(n => n);
                poss = board.flat().map((n, i) => n === CellState.EMPTY ? new Cell(Math.floor(i / COLS), i % COLS) : undefined).filter(n => n);
                pieces.forEach(p => {
                    poss.forEach(c => {
                        let clone = game.clone();
                        clone.move(p, c);
                        moves.push({ game: clone, beginCell: p, endCell: c });
                    });
                });
                break;
            case "removePiece":
                poss = game.availablePiecesToRemove();
                poss.forEach(c => {
                    let clone = game.clone();
                    clone.removePiece(c);
                    moves.push({ game: clone, beginCell: cell ? cell : c });
                });
                break;
        }
        return moves;
    }
}