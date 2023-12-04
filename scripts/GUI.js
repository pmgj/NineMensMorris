import Cell from "./Cell.js";
import NineMensMorris from "./NineMensMorris.js";

class GUI {
    #points
    #game
    constructor() {
        this.#points = [
            [new Cell(32, 272), new Cell(32, 152), new Cell(32, 32), new Cell(152, 32), new Cell(272, 32), new Cell(272, 152), new Cell(272, 272), new Cell(152, 272)],
            [new Cell(72, 232), new Cell(72, 152), new Cell(72, 72), new Cell(152, 72), new Cell(232, 72), new Cell(232, 152), new Cell(232, 232), new Cell(152, 232)],
            [new Cell(112, 192), new Cell(112, 152), new Cell(112, 112), new Cell(152, 112), new Cell(192, 112), new Cell(192, 152), new Cell(192, 192), new Cell(152, 192)]
        ];
        this.#game = new NineMensMorris();
    }
    registerEvents() {
        let board = document.querySelector("main img");
        board.onclick = (event) => {
            this.#points.flat().
                console.log(event.offsetX, event.offsetY);
        };
    }
}
let gui = new GUI();
gui.registerEvents();