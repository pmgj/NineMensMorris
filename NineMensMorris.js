import CellState from "./CellState.js";
import Player from "./Player.js";
import Cell from "./Cell.js";

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
    }
    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return inLimit(x, this.ROWS) && inLimit(y, this.COLS);
    }
    position(cell) {
        if (!this.onBoard(cell)) {
            throw new Error("This cell is not on board.");
        }
        const { x, y } = cell;
        if (this.board[x][y] !== CellState.EMPTY) {
            throw new Error("This position is not empty.");
        }
        this.board[x][y] = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        checkMill();
        this.turn = this.turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
    }
    move(beginCell, endCell) {

    }
}
let m = new NineMensMorris();
m.position(new Cell(0, 0));