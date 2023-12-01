import Cell from "./Cell.js";
import CellState from "./CellState.js";
import Player from "./Player.js";

class NineMensMorris {
    constructor() {
        this.board = [
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY]
        ];
        this.ROWS = 3;
        this.COLS = 8;
        this.turn = Player.PLAYER1;
        this.state = "position";
        this.p1pp = 9;
        this.p2pp = 9;
    }
    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return inLimit(x, this.ROWS) && inLimit(y, this.COLS);
    }
    position(cell) {
        if (this.state !== "position") {
            throw new Error(`Positioning piece now is invalid (current state: ${this.state}).`);
        }
        if (!this.onBoard(cell)) {
            throw new Error("This cell is not on board.");
        }
        const { x, y } = cell;
        if (this.board[x][y] !== CellState.EMPTY) {
            throw new Error("This position is not empty.");
        }
        this.board[x][y] = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        if (this.turn === Player.PLAYER1) {
            this.p1pp--;
        }
        if (this.turn === Player.PLAYER2) {
            this.p2pp--;
        }
        if (checkMill()) {
            this.state = "removePiece1";
            return;
        }
        this.turn = this.turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
    }
    removePiece(cell) {
        if (!this.state.startsWith("removePiece")) {
            throw new Error(`Removing a piece now is invalid (current state: ${this.state}).`);
        }
        if (!this.onBoard(cell)) {
            throw new Error("This cell is not on board.");
        }
        const { x, y } = cell;
        let op = this.turn === Player.PLAYER1 ? CellState.PLAYER2 : CellState.PLAYER1;
        if (this.board[x][y] !== op) {
            throw new Error("This position is not from the opponent.");
        }
        this.board[x][y] = CellState.EMPTY;
        this.turn = this.turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        this.state = this.state === "removePiece1" ? "position" : "move";
    }
    checkMill() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j += 2) {
                if (this.board[i][j] === this.board[i][j + 1] && this.board[i][j + 1] === this.board[i][j + 2]) {
                    return true;
                }
            }
        }
        for (let i = 1; i < this.board.length; i += 2) {
            if (this.board[i][j] === this.board[i - 1][j] && this.board[i - 1][j] === this.board[i - 2][j]) {
                return true;
            }
        }
        return false;
    }
    move(beginCell, endCell) {
        if (this.state !== "move") {
            throw new Error(`Removing a piece now is invalid (current state: ${this.state}).`);
        }
        if (!this.onBoard(beginCell) || !this.onBoard(endCell)) {
            throw new Error("One cell is not on board.");
        }
        let { x: or, y: oc } = beginCell;
        let { x: dr, y: dc } = endCell;
        let piece = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        if (this.board[or][oc] !== piece) {
            throw new Error("This piece is not from the current player.");
        }
        if (this.board[dr][dc] !== CellState.EMPTY) {
            throw new Error("This destination is not empty.");
        }
        let positions = [new Cell(or + 1, oc), new Cell(or - 1, oc), new Cell(or, oc + 1), new Cell(or, oc - 1)];
        if(!positions.some(cell => this.onBoard(cell) && cell.equals(endCell))) {
            throw new Error("This move is invalid.");
        }
        this.board[dr][dc] = this.board[or][oc];
        this.board[or][oc] = CellState.EMPTY;
    }
}
let m = new NineMensMorris();
m.position(new Cell(0, 0));