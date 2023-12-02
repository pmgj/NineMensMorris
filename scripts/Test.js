import NineMensMorris from "./NineMensMorris.js";
import Cell from "./Cell.js";

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
m.showBoard();