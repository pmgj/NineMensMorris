import Cell from "./Cell.js";
import NineMensMorris from "./NineMensMorris.js";

class GUI {
    #points
    #game
    #ROWS
    #COLS
    constructor() {
        this.#points = [
            [new Cell(32, 272), new Cell(32, 152), new Cell(32, 32), new Cell(152, 32), new Cell(272, 32), new Cell(272, 152), new Cell(272, 272), new Cell(152, 272)],
            [new Cell(72, 232), new Cell(72, 152), new Cell(72, 72), new Cell(152, 72), new Cell(232, 72), new Cell(232, 152), new Cell(232, 232), new Cell(152, 232)],
            [new Cell(112, 192), new Cell(112, 152), new Cell(112, 112), new Cell(152, 112), new Cell(192, 112), new Cell(192, 152), new Cell(192, 192), new Cell(152, 192)]
        ];
        this.#ROWS = 3;
        this.#COLS = 8;
        this.#game = new NineMensMorris();
    }
    #distance({ x: ox, y: oy }, { x: dx, y: dy }) {
        return Math.sqrt(Math.pow(ox - dx, 2) + Math.pow(oy - dy, 2));
    }
    #play(event) {
        try {
            let clickedCell = new Cell(event.offsetX, event.offsetY);
            let index = this.#points.flat().findIndex(cell => this.#distance(cell, clickedCell) < 20);
            if (index === -1) return;
            let cell = new Cell(Math.floor(index / this.#COLS), index % this.#COLS);
            this.#innerPlay(cell, clickedCell);
        } catch (ex) {
            this.#setMessage(ex.message);
        }
    }
    #innerPlay(cell, clickedCell) {
        switch (this.#game.getState()) {
            case "position":
                let turn = this.#game.getTurn();
                this.#game.position(cell);
                let img = document.createElement("img");
                img.src = `../images/${turn}.svg`;
                let pointCell = this.#points.flat().find(cell => this.#distance(cell, clickedCell) < 20);
                img.style.translate = `${pointCell.x - 10}px ${pointCell.y - 10}px`;
                img.dataset.pointX = cell.x;
                img.dataset.pointY = cell.y;
                img.onclick = () => {
                    this.#innerPlay(new Cell(parseInt(img.dataset.pointX), parseInt(img.dataset.pointY)));
                };
                let main = document.querySelector("main");
                main.appendChild(img);
                break;
            case "removePiece":
                this.#game.removePiece(cell);
                let imgToRemove = document.querySelector(`img[data-point-x="${cell.x}"][data-point-y="${cell.y}"]`);
                imgToRemove.parentElement.removeChild(imgToRemove);
                console.log();
                break;
            case "move":
                break;
        }
    }
    #setMessage(msg) {
        let message = document.querySelector("#message");
        message.textContent = msg;
    }
    registerEvents() {
        let board = document.querySelector("main img");
        board.onclick = this.#play.bind(this);
    }
}
let gui = new GUI();
gui.registerEvents();