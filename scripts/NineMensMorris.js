import Cell from "./Cell.js";
import CellState from "./CellState.js";
import Player from "./Player.js";
import Winner from "./Winner.js";

export default class NineMensMorris {
    #board
    #ROWS
    #COLS
    #turn
    #state
    #remainingPieces
    constructor() {
        this.#board = [
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY]
        ];
        this.#ROWS = 3;
        this.#COLS = 8;
        this.#turn = Player.PLAYER1;
        this.#state = "position";
        this.#remainingPieces = 18;
    }
    clone(board = this.#board.map(arr => arr.slice()), turn = this.#turn, state = this.#state, remainingPieces = this.#remainingPieces) {
        let temp = new NineMensMorris();
        temp.#board = board;
        temp.#turn = turn;
        temp.#state = state;
        temp.#remainingPieces = remainingPieces;
        return temp;
    }
    getState() {
        switch (this.#state) {
            case "position":
            case "removePiece":
                return this.#state;
            case "move":
                if (this.countRemainingPieces(this.getCellState()) > 3) {
                    return this.#state;
                }
                return "flying";
        }
    }
    getCellState() {
        return this.#turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
    }
    getTurn() {
        return this.#turn;
    }
    getBoard() {
        return this.#board;
    }
    #onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return inLimit(x, this.#ROWS) && inLimit(y, this.#COLS);
    }
    position(cell) {
        if (this.#state !== "position") {
            throw new Error(`Positioning piece now is invalid (current state: ${this.#state}).`);
        }
        if (!this.#onBoard(cell)) {
            throw new Error("This cell is not on board.");
        }
        const { x, y } = cell;
        if (this.#board[x][y] !== CellState.EMPTY) {
            throw new Error("This position is not empty.");
        }
        this.#board[x][y] = this.getCellState();
        this.#remainingPieces--;
        if (this.#checkMill(cell)) {
            this.#state = "removePiece";
            return;
        }
        this.#turn = this.#turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        if (this.#remainingPieces === 0) {
            this.#state = "move";
        }
    }
    availablePiecesToRemove() {
        let op = this.#turn === Player.PLAYER1 ? CellState.PLAYER2 : CellState.PLAYER1;
        let mills = [], noMills = [];
        for (let i = 0; i < this.#ROWS; i++) {
            for (let j = 0; j < this.#COLS; j++) {
                let cell = new Cell(i, j);
                if (this.#board[i][j] === op) {
                    if (this.#checkMill(cell)) {
                        mills.push(cell);
                    } else {
                        noMills.push(cell);
                    }
                }
            }
        }
        if (noMills.length > 0) {
            return noMills;
        }
        return mills;
    }
    removePiece(cell) {
        if (this.#state !== "removePiece") {
            throw new Error(`Removing a piece now is invalid (current state: ${this.#state}).`);
        }
        if (!this.#onBoard(cell)) {
            throw new Error("This cell is not on board.");
        }
        const { x, y } = cell;
        let op = this.getCellState();
        if (this.#board[x][y] === op) {
            throw new Error("This position is not from the opponent.");
        }
        if (this.#board[x][y] === CellState.EMPTY) {
            throw new Error("This position is empty.");
        }
        if (!this.availablePiecesToRemove().find(c => c.equals(cell))) {
            throw new Error("Pieces from a mill can be removed only if no other pieces are available.");
        }
        this.#board[x][y] = CellState.EMPTY;
        this.#turn = this.#turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        this.#state = this.#remainingPieces === 0 ? "move" : "position";
        return this.isGameOver();
    }
    #checkMill(cell) {
        let { x, y } = cell;
        let front = this.#board[x].slice(y % 2 === 0 ? y : y - 1, y % 2 === 0 ? y + 3 : y + 2);
        let back = this.#board[x].slice(0, Math.abs(front.length - 3));
        let positions = [...front, ...back];
        if (positions.every(cs => this.#board[x][y] === cs)) {
            return true;
        }
        if (y % 2 === 0) {
            if (y >= 2) {
                positions = this.#board[x].slice(y - 2, y + 1);
            } else {
                front = this.#board[x].slice(0, y + 1);
                back = this.#board[x].slice(this.#board[x].length - front.length - 1, this.#board[x].length);
                positions = [...front, ...back];
            }
            if (positions.every(cs => this.#board[x][y] === cs)) {
                return true;
            }
        } else {
            let positions = [new Cell(0, y), new Cell(1, y), new Cell(2, y)];
            if (positions.every(({ x: row, y: col }) => this.#board[row][col] === this.#board[x][y])) {
                return true;
            }
        }
        return false;
    }
    move(beginCell, endCell) {
        if (this.#state !== "move") {
            throw new Error(`Removing a piece now is invalid (current state: ${this.#state}).`);
        }
        if (!this.#onBoard(beginCell) || !this.#onBoard(endCell)) {
            throw new Error("One cell is not on board.");
        }
        let { x: or, y: oc } = beginCell;
        let { x: dr, y: dc } = endCell;
        let piece = this.getCellState();
        if (this.#board[or][oc] !== piece) {
            throw new Error("This piece is not from the current player.");
        }
        if (this.#board[dr][dc] !== CellState.EMPTY) {
            throw new Error("This destination is not empty.");
        }
        if (this.countRemainingPieces(piece) > 3) {
            let positions = this.orthogonalMoves(beginCell);
            if (!positions.some(cell => cell.equals(endCell))) {
                throw new Error("This move is invalid.");
            }
        }
        this.#board[dr][dc] = this.#board[or][oc];
        this.#board[or][oc] = CellState.EMPTY;
        if (this.#checkMill(endCell)) {
            this.#state = "removePiece";
            return;
        }
        this.#turn = this.#turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        return this.isGameOver();
    }
    orthogonalMoves(cell) {
        let { x: or, y: oc } = cell;
        let positions = [new Cell(or, oc + 1 >= this.#COLS ? 0 : oc + 1), new Cell(or, oc - 1 < 0 ? this.#COLS - 1 : oc - 1)];
        if (oc % 2 !== 0) {
            if (this.#board[or + 1]) positions.push(new Cell(or + 1, oc));
            if (this.#board[or - 1]) positions.push(new Cell(or - 1, oc));
        }
        return positions;
    }
    #canMove(cell) {
        let positions = this.orthogonalMoves(cell);
        return positions.some(c => this.#board[c.x][c.y] === CellState.EMPTY);
    }
    countRemainingPieces(cellState) {
        return this.#board.flat().filter(cs => cs === cellState).length;
    }
    playerCanMove(cellState) {
        if (this.#state === "move" && this.countRemainingPieces(cellState) === 3) {
            return true;
        }
        return this.#board.flat().map((n, i) => n === cellState ? new Cell(Math.floor(i / this.#COLS), i % this.#COLS) : undefined).filter(n => n).some(c => this.#canMove(c));
    }
    isGameOver() {
        if (this.#remainingPieces > 0) {
            return Winner.NONE;
        }
        if (this.countRemainingPieces(CellState.PLAYER1) < 3) {
            return Winner.PLAYER2;
        }
        if (this.countRemainingPieces(CellState.PLAYER2) < 3) {
            return Winner.PLAYER1;
        }
        if (this.#turn === CellState.PLAYER1 && !this.playerCanMove(CellState.PLAYER1)) {
            return Winner.PLAYER2;
        }
        if (this.#turn === CellState.PLAYER2 && !this.playerCanMove(CellState.PLAYER2)) {
            return Winner.PLAYER1;
        }
        return Winner.NONE;
    }
    showBoard() {
        console.table(this.#board);
    }
}