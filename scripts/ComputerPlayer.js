// Based on: https://kartikkukreja.wordpress.com/2014/03/17/heuristicevaluation-function-for-nine-mens-morris/

import Cell from "./Cell.js";
import CellState from "./CellState.js";
import NineMensMorris from "./NineMensMorris.js";
import Winner from "./Winner.js";

export default class ComputerPlayer {
    #player;
    #opponent;
    #game;
    constructor(player, game) {
        this.#player = player;
        this.#opponent = this.#getOpponent(player);
        this.#game = game;
    }
    #getOpponent(player) {
        return player === CellState.PLAYER1 ? CellState.PLAYER2 : CellState.PLAYER1;
    }
    alphabeta(node, depth = 2, alfa = -Infinity, beta = Infinity, maximizingPlayer = CellState.PLAYER2) {
        let w = this.#game.isGameOver();
        if (depth === 0 || w !== Winner.NONE) {
            return { score: this.heuristic(node) };
        }
        let nextPlayer = this.#getOpponent(maximizingPlayer);
        if (maximizingPlayer === this.#player) {
            let value = -Infinity;
            let childs = this.getAvailableMoves(node, maximizingPlayer);
            for (let child of childs) {
                child.score = this.alphabeta(child, depth - 1, alfa, beta, nextPlayer).score;
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
            let childs = this.getAvailableMoves(node, maximizingPlayer);
            for (let child of childs) {
                child.score = this.alphabeta(child, depth - 1, alfa, beta, nextPlayer).score;
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
    #onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return inLimit(x, this.board.length) && inLimit(y, this.board[0].length);
    }
    #canMove(cell) {
        let { x: or, y: oc } = cell;
        let positions = [new Cell(or, oc + 1 >= this.board[0].length ? 0 : oc + 1), new Cell(or, oc - 1 < 0 ? this.board[0].length - 1 : oc - 1)];
        if (oc % 2 !== 0) {
            positions.push(new Cell(or + 1 >= this.board.length ? 0 : or + 1, oc));
            positions.push(new Cell(or - 1 < 0 ? this.board.length - 1 : or - 1, oc));
        }
        if (positions.some(c => this.#onBoard(c) && this.board[c.x][c.y] === CellState.EMPTY)) {
            return true;
        }
        return false;
    }
    playerCanMove(player) {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === player && this.#canMove(new Cell(i, j))) {
                    return true;
                }
            }
        }
        return false;
    }
    heuristic(node) {
        let { matrix: board, cell } = node;
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
            let possibilities = rowPoss();
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
            possibilities = possibilities.concat(orthPoss());
            return possibilities;
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
            let countMorrises = player => possibilities.filter(p => p.every(obj => obj.value === player)).length;
            return countMorrises(this.#player) - countMorrises(this.#opponent);
        };
        let numberOfBlockedOpponentPieces = () => {
            let numberOfBlockedPieces = player => {
                let count = 0;
                let opponent = this.#getOpponent(player);
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        let prev = j - 1 < 0 ? board[i].length - 1 : j - 1;
                        let next = j + 1 >= board[i].length ? 0 : j + 1;
                        if (board[i][j] === player && board[i][prev] === opponent && board[i][next] === opponent) {
                            count++;
                        }
                    }
                }
                return count;
            };
            return numberOfBlockedPieces(this.#opponent) - numberOfBlockedPieces(this.#player);
        };
        let countRemainingPieces = player => board.flat().filter(cs => cs === player).length;
        let numberOfPieces = () => countRemainingPieces(this.#player) - countRemainingPieces(this.#opponent);
        let numberOfTwoPieceConfigurations = () => {
            let numberOfTwoPiece = player => {
                let count = 0;
                for (let poss of possibilities) {
                    let pieces = poss.filter(obj => obj.value === player).length;
                    let empty = poss.filter(obj => obj.value === CellState.EMPTY).length;
                    if (pieces === 2 && empty === 1) {
                        count++;
                    }
                }
                return count;
            };
            return numberOfTwoPiece(this.#player) - numberOfTwoPiece(this.#opponent);
        };
        let numberOfThreePieceConfigurations = () => {
        };
        let doubleMorris = () => {
            let doubleMorrisByPlayer = player => {
                let temp = possibilities.map((poss, i) => poss.every(obj => obj.value === player) ? i : -1);
                let indexes = temp.filter(v => v !== -1);
                let values = indexes.map(i => possibilities[i]);
                let allCells = values.flat();
                let countAll = allCells.length;
                if (countAll === 0) {
                    return 0;
                }
                let nonRepeatingCells = new Set(allCells);
                let countRestricted = nonRepeatingCells.size;
                return countAll - countRestricted;
            };
            return doubleMorrisByPlayer(this.#player) - doubleMorrisByPlayer(this.#opponent);
        };
        let winningConfiguration = () => {
            if (countRemainingPieces(this.#player) < 3) {
                return -1;
            }
            if (countRemainingPieces(this.#opponent) < 3) {
                return 1;
            }
            if (!this.playerCanMove(this.#player)) {
                return -1;
            }
            if (!this.playerCanMove(this.#opponent)) {
                return 1;
            }
            return 0;
        };
        let v1 = closedMorris();
        let v2 = numberOfMorrises();
        let v3 = numberOfBlockedOpponentPieces();
        let v4 = numberOfPieces();
        let v5 = numberOfTwoPieceConfigurations();
        let v7 = doubleMorris();
        let v8 = winningConfiguration();
        let h = 0;
        switch (this.#game.getState()) {
            case "position":
                h = 18 * v1 + 26 * v2 + 1 * v3 + 9 * v4 + 10 * v5; // + 7 * numberOfThreePieceConfigurations();
                break;
            case "move":
                h = 14 * v1 + 43 * v2 + 10 * v3 + 11 * v4 + 8 * v7 + 1086 * v8;
                break;
            case "flying":
                h = 16 * v1 + 10 * v5 + 1190 * v8; // + 1 * numberOfThreePieceConfigurations();
                break;
        }
        console.log(v1, v2, v3, v4, v5, v7, v8, h);
        return h;
    }
    getAvailableMoves(matrix, turn) {
        let moves = [];
        if (this.#game.getState() === "position") {
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[0].length; j++) {
                    if (matrix[i][j] === CellState.EMPTY) {
                        let clone = matrix.map(arr => arr.slice());
                        clone[i][j] = turn;
                        moves.push({ matrix: clone, cell: new Cell(i, j) });
                    }
                }
            }
        }
        return moves;
    }
}
let nmm = new NineMensMorris();
nmm.position(new Cell(0, 0));
// nmm.position(new Cell(1, 0));
// nmm.position(new Cell(0, 1));
// nmm.position(new Cell(1, 1));
// nmm.position(new Cell(0, 2));
let cp = new ComputerPlayer(CellState.PLAYER2, nmm);
let obj = cp.alphabeta(nmm.getBoard());
console.log(obj);