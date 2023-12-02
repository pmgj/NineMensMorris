import Cell from "./Cell.js";
import CellState from "./CellState.js";
import Player from "./Player.js";

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
        this.#board[x][y] = this.#turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        this.#remainingPieces--;
        if (this.#checkMill(cell)) {
            this.#state = "removePiece1";
            return;
        }
        this.#turn = this.#turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        if(this.#remainingPieces === 0) {
            this.#state = "move";
        }
    }
    removePiece(cell) {
        if (!this.#state.startsWith("removePiece")) {
            throw new Error(`Removing a piece now is invalid (current state: ${this.#state}).`);
        }
        if (!this.#onBoard(cell)) {
            throw new Error("This cell is not on board.");
        }
        const { x, y } = cell;
        let op = this.#turn === Player.PLAYER1 ? CellState.PLAYER2 : CellState.PLAYER1;
        if (this.#board[x][y] !== op) {
            throw new Error("This position is not from the opponent.");
        }
        this.#board[x][y] = CellState.EMPTY;
        this.#turn = this.#turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        this.#state = this.#remainingPieces === 0 ? "move" : "position";
    }
    #checkMill(cell) {
        let { x, y } = cell;
        if (y % 2 === 0) {
            let front = this.#board[x].slice(y, y + 3);
            let back = this.#board[x].slice(0, front.length - 3);
            let positions = [...front, ...back];
            if (positions.every(cs => this.#board[x][y] === cs)) {
                return true;
            }
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
            return false;
        }
        let positions = [new Cell(0, y), new Cell(1, y), new Cell(2, y)];
        if (positions.every(({ x: row, y: col }) => this.#board[row][col] === this.#board[x][y])) {
            return true;
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
        let piece = this.#turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        if (this.#board[or][oc] !== piece) {
            throw new Error("This piece is not from the current player.");
        }
        if (this.#board[dr][dc] !== CellState.EMPTY) {
            throw new Error("This destination is not empty.");
        }
        let positions = [new Cell(or + 1 >= this.#ROWS ? 0 : or + 1, oc), new Cell(or - 1 < 0 ? this.#ROWS - 1 : or - 1, oc), new Cell(or, oc + 1 >= this.#COLS ? 0 : oc + 1), new Cell(or, oc - 1 < 0 ? this.#ROWS - 1 : oc - 1)];
        if (!positions.some(cell => this.#onBoard(cell) && cell.equals(endCell))) {
            throw new Error("This move is invalid.");
        }
        this.#board[dr][dc] = this.#board[or][oc];
        this.#board[or][oc] = CellState.EMPTY;
    }
    showBoard() {
        console.table(this.#board);
    }
}