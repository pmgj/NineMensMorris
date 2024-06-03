import NineMensMorris from "./NineMensMorris.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";
import CellState from "./CellState.js";
import ComputerPlayer from "./ComputerPlayer.js";
import Player from "./Player.js";

function test1() {
    let m = new NineMensMorris();
    m.position(new Cell(0, 0));
    try {
        m.position(new Cell(0, 0));
        console.assert(true, "Positioning incorrect.");
    } catch (ex) {

    }
    try {
        m.removePiece(new Cell(0, 0));
        console.assert(true, "Removing incorrect.");
    } catch (ex) {

    }
    m.position(new Cell(1, 0));
    m.position(new Cell(0, 1));
    m.position(new Cell(1, 1));
    m.position(new Cell(0, 2));
    try {
        m.position(new Cell(1, 2));
        console.assert(true, "Positioning incorrect.");
    } catch (ex) {

    }
    m.removePiece(new Cell(1, 1));
    m.position(new Cell(2, 0));
    m.position(new Cell(1, 1));
    m.position(new Cell(2, 7));
    m.position(new Cell(2, 1));
    try {
        m.position(new Cell(1, 7));
        console.assert(true, "Positioning incorrect.");
    } catch (ex) {

    }
    m.removePiece(new Cell(2, 7));
    m.position(new Cell(0, 7));
    m.position(new Cell(0, 3));
    m.position(new Cell(1, 6));
    m.position(new Cell(2, 5));
    m.position(new Cell(0, 4));
    m.position(new Cell(2, 3));
    m.position(new Cell(1, 3));
    m.position(new Cell(2, 6));
    m.position(new Cell(0, 6));
    try {
        m.position(new Cell(2, 2));
        console.assert(true, "Positioning incorrect.");
    } catch (ex) {

    }
    m.move(new Cell(2, 1), new Cell(2, 2));
    m.move(new Cell(2, 0), new Cell(2, 7));
    m.move(new Cell(1, 1), new Cell(2, 1));
    m.move(new Cell(1, 0), new Cell(1, 7));
    try {
        m.move(new Cell(0, 0), new Cell(1, 0));
        console.assert(true, "Moving incorrect.");
    } catch (ex) {

    }
    try {
        m.removePiece(new Cell(0, 0));
        console.assert(true, "Moving incorrect.");
    } catch (ex) {

    }
    m.removePiece(new Cell(2, 5));
    try {
        m.move(new Cell(0, 0), new Cell(1, 0));
        console.assert(true, "Moving incorrect.");
    } catch (ex) {

    }
    m.move(new Cell(0, 1), new Cell(1, 1));
    m.move(new Cell(0, 4), new Cell(0, 5));
    m.move(new Cell(0, 0), new Cell(0, 1));
    m.removePiece(new Cell(1, 3));
    m.move(new Cell(0, 5), new Cell(0, 4));
    m.move(new Cell(2, 3), new Cell(2, 4));
    m.move(new Cell(0, 6), new Cell(0, 5));
    m.move(new Cell(2, 2), new Cell(2, 3));
    m.move(new Cell(0, 7), new Cell(0, 6));
    m.removePiece(new Cell(0, 3));
    m.move(new Cell(0, 1), new Cell(0, 0));
    m.move(new Cell(0, 6), new Cell(0, 7));
    m.removePiece(new Cell(2, 4));
    m.move(new Cell(0, 0), new Cell(0, 1));
    m.removePiece(new Cell(1, 6));
    m.move(new Cell(0, 7), new Cell(0, 6));
    m.removePiece(new Cell(2, 6));
    m.move(new Cell(0, 1), new Cell(0, 0));
    m.move(new Cell(0, 6), new Cell(0, 7));
    m.removePiece(new Cell(0, 2));
    m.move(new Cell(0, 0), new Cell(0, 1));
    m.removePiece(new Cell(0, 4));
    m.move(new Cell(0, 7), new Cell(0, 6));
    m.move(new Cell(0, 1), new Cell(0, 0));
    m.move(new Cell(0, 6), new Cell(0, 7));
    m.removePiece(new Cell(2, 3));
    m.move(new Cell(0, 0), new Cell(0, 1));
    m.removePiece(new Cell(0, 5));
    m.move(new Cell(0, 7), new Cell(0, 6));
    m.move(new Cell(0, 1), new Cell(0, 0));
    m.move(new Cell(0, 6), new Cell(0, 7));
    let w = m.removePiece(new Cell(0, 0));
    console.assert(w === Winner.PLAYER2, "Incorrect end of game.");
    m.showBoard();
}
function test2() {
    let f = (board, cell) => {
        let { x, y } = cell;
        let front = board[x].slice(y % 2 === 0 ? y : y - 1, y % 2 === 0 ? y + 3 : y + 2);
        let back = board[x].slice(0, Math.abs(front.length - 3));
        let positions = [...front, ...back];
        if (positions.every(cs => board[x][y] === cs)) {
            return true;
        }
        if (y % 2 === 0) {
            if (y >= 2) {
                positions = board[x].slice(y - 2, y + 1);
            } else {
                front = board[x].slice(0, y + 1);
                back = board[x].slice(board[x].length - front.length - 1, board[x].length);
                positions = [...front, ...back];
            }
            if (positions.every(cs => board[x][y] === cs)) {
                return true;
            }
        } else {
            let positions = [new Cell(0, y), new Cell(1, y), new Cell(2, y)];
            if (positions.every(({ x: row, y: col }) => board[row][col] === board[x][y])) {
                return true;
            }
        }
        return false;
    }
    console.assert(f([
        [CellState.PLAYER1, CellState.PLAYER1, CellState.PLAYER1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ], new Cell(0, 0)), "Erro");
    console.assert(f([
        [CellState.PLAYER1, CellState.PLAYER1, CellState.PLAYER1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ], new Cell(0, 1)), "Erro");
    console.assert(f([
        [CellState.PLAYER1, CellState.PLAYER1, CellState.PLAYER1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ], new Cell(0, 2)), "Erro");
    console.assert(!f([
        [0, CellState.PLAYER1, CellState.PLAYER1, CellState.PLAYER1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ], new Cell(0, 1)), "Erro");
    console.assert(!f([
        [0, CellState.PLAYER1, CellState.PLAYER1, CellState.PLAYER1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ], new Cell(0, 2)), "Erro");
    console.assert(!f([
        [0, CellState.PLAYER1, CellState.PLAYER1, CellState.PLAYER1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ], new Cell(0, 3)), "Erro");
    console.assert(f([
        [0, CellState.PLAYER1, 0, 0, 0, 0, 0, 0],
        [0, CellState.PLAYER1, 0, 0, 0, 0, 0, 0],
        [0, CellState.PLAYER1, 0, 0, 0, 0, 0, 0]
    ], new Cell(0, 3)), "Erro");
}
function test3() {
    let nmm = new NineMensMorris();
    let cp = new ComputerPlayer(CellState.PLAYER2), h;
    nmm.position(new Cell(0, 0));
    h = cp.alphabeta({ game: nmm });
    nmm.position(h.beginCell);
    nmm.position(new Cell(0, 2));
    h = cp.alphabeta({ game: nmm });
    nmm.position(h.beginCell);
    nmm.position(new Cell(2, 1));
    h = cp.alphabeta({ game: nmm });
    nmm.position(h.beginCell);
    nmm.position(new Cell(1, 2));
    h = cp.alphabeta({ game: nmm });
    nmm.position(h.beginCell);
    nmm.position(new Cell(1, 7));
    h = cp.alphabeta({ game: nmm });
    nmm.position(h.beginCell);
    nmm.position(new Cell(2, 0));
    h = cp.alphabeta({ game: nmm });
    nmm.position(h.beginCell);
    nmm.position(new Cell(0, 4));
    h = cp.alphabeta({ game: nmm });
    nmm.position(h.beginCell);
    nmm.position(new Cell(2, 7));
    h = cp.alphabeta({ game: nmm });
    nmm.position(h.beginCell);
    nmm.position(new Cell(2, 5));
    h = cp.alphabeta({ game: nmm });
    nmm.position(h.beginCell);
    nmm.move(new Cell(2, 5), new Cell(2, 4));
    console.table(nmm.getBoard());
    h = cp.alphabeta({ game: nmm });
    nmm.move(h.beginCell, h.endCell);
    console.table(nmm.getBoard());
}
function test4() {
    let nmm = new NineMensMorris();
    nmm.position(new Cell(0, 1));
    nmm.position(new Cell(0, 0));
    nmm.position(new Cell(1, 1));
    nmm.position(new Cell(0, 2));
    nmm.position(new Cell(2, 1));
    let cp = new ComputerPlayer(CellState.PLAYER2), h;
    h = cp.heuristic({ game: nmm, beginCell: new Cell(2, 1) });
    nmm.removePiece(new Cell(0, 0));
    nmm.position(new Cell(0, 3));
    nmm.position(new Cell(1, 2));
    nmm.position(new Cell(0, 4));
    h = cp.heuristic({ game: nmm, beginCell: new Cell(0, 4) });
    nmm.removePiece(new Cell(1, 2));
    nmm.position(new Cell(1, 2));
    h = cp.heuristic({ game: nmm, beginCell: new Cell(1, 2) });
    nmm.position(new Cell(1, 0));
    nmm.position(new Cell(1, 3));
    nmm.position(new Cell(1, 4));
    h = cp.heuristic({ game: nmm, beginCell: new Cell(1, 4) });
    nmm.position(new Cell(2, 2));
    h = cp.heuristic({ game: nmm, beginCell: new Cell(2, 2) });
    nmm.position(new Cell(2, 6));
    nmm.position(new Cell(2, 3));
    h = cp.heuristic({ game: nmm, beginCell: new Cell(2, 3) });
    console.table(nmm.getBoard());
}
function test5() {
    let nmm = new NineMensMorris();
    let cp2 = new ComputerPlayer(CellState.PLAYER2), h, cp1 = new ComputerPlayer(CellState.PLAYER1);
    nmm.position(new Cell(0, 0));
    nmm.position(new Cell(1, 6));
    nmm.position(new Cell(0, 1));
    nmm.position(new Cell(2, 2));
    nmm.position(new Cell(0, 7));
    // h = cp.heuristic({ game: nmm, beginCell: new Cell(0, 7) }, CellState.PLAYER2, CellState.PLAYER1);
    nmm.position(new Cell(2, 0));
    nmm.position(new Cell(0, 6));
    nmm.removePiece(new Cell(2, 0));
    nmm.position(new Cell(2, 0));
    nmm.position(new Cell(0, 2));
    nmm.removePiece(new Cell(2, 0));
    nmm.position(new Cell(2, 0));
    nmm.position(new Cell(1, 4));
    nmm.position(new Cell(1, 0));
    nmm.position(new Cell(1, 1));
    nmm.position(new Cell(1, 2));
    nmm.position(new Cell(1, 3));
    nmm.position(new Cell(1, 5));
    nmm.position(new Cell(2, 4));
    nmm.position(new Cell(2, 6));
    nmm.move(new Cell(0, 2), new Cell(0, 3));
    nmm.move(new Cell(2, 2), new Cell(2, 1));
    nmm.move(new Cell(0, 3), new Cell(0, 2));
    nmm.removePiece(new Cell(1, 2));
    nmm.move(new Cell(2, 6), new Cell(2, 5));
    nmm.move(new Cell(1, 3), new Cell(1, 2));
    nmm.move(new Cell(1, 6), new Cell(1, 7));
    nmm.move(new Cell(0, 2), new Cell(0, 3));
    nmm.move(new Cell(1, 5), new Cell(0, 5));
    nmm.move(new Cell(0, 3), new Cell(0, 2));
    nmm.removePiece(new Cell(1, 0));
    nmm.move(new Cell(2, 1), new Cell(2, 2));
    nmm.move(new Cell(1, 1), new Cell(1, 0));
    nmm.move(new Cell(1, 7), new Cell(2, 7));
    nmm.move(new Cell(0, 1), new Cell(1, 1));
    nmm.removePiece(new Cell(2, 0));
    nmm.move(new Cell(2, 7), new Cell(2, 6));
    nmm.move(new Cell(1, 1), new Cell(0, 1));
    nmm.removePiece(new Cell(2, 2));
    nmm.move(new Cell(0, 5), new Cell(2, 1));
    // h = cp.heuristic({ game: nmm, beginCell: new Cell(1, 1) }, CellState.PLAYER1, CellState.PLAYER2);
    console.log(cp1.alphabeta({ game: nmm }, 4, -Infinity, Infinity));
    console.table(nmm.getBoard());
}
function test6() {
    let nmm = new NineMensMorris();
    let cp2 = new ComputerPlayer(CellState.PLAYER2), h;
    let nmm2 = nmm.clone([
        [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.PLAYER2, CellState.EMPTY, CellState.PLAYER2, CellState.PLAYER2, CellState.EMPTY],
        [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.PLAYER2, CellState.EMPTY, CellState.EMPTY, CellState.EMPTY, CellState.PLAYER1],
        [CellState.PLAYER1, CellState.EMPTY, CellState.EMPTY, CellState.PLAYER2, CellState.PLAYER1, CellState.PLAYER1, CellState.PLAYER1, CellState.EMPTY]
    ],
        Player.PLAYER2, "move", 0);
    console.table(nmm2.getBoard());
    console.log(cp2.alphabeta({ game: nmm2 }, 4, -Infinity, Infinity));
}
function test7() {
    let nmm = new NineMensMorris();
    let cp2 = new ComputerPlayer(CellState.PLAYER1);
    let nmm2 = nmm.clone([
        [CellState.PLAYER2, CellState.PLAYER2, CellState.EMPTY, CellState.PLAYER1, CellState.PLAYER2, CellState.EMPTY, CellState.EMPTY, CellState.PLAYER1],
        [CellState.PLAYER1, CellState.PLAYER1, CellState.PLAYER2, CellState.PLAYER1, CellState.PLAYER2, CellState.PLAYER1, CellState.EMPTY, CellState.PLAYER2],
        [CellState.PLAYER2, CellState.PLAYER1, CellState.PLAYER2, CellState.EMPTY, CellState.PLAYER1, CellState.PLAYER2, CellState.PLAYER1, CellState.EMPTY]
    ],
        Player.PLAYER1, "move", 0);
    console.table(nmm2.getBoard());
    console.log(cp2.alphabeta({ game: nmm2 }, 2, -Infinity, Infinity));
    /* Best move: (2,2) -> (2,3) */
}
test7();