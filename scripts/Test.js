import NineMensMorris from "./NineMensMorris.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";

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