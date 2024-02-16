import Cell from "./Cell.js";
import NineMensMorris from "./NineMensMorris.js";
import Player from "./Player.js";
import Winner from "./Winner.js";

class GUI {
    #points
    #game
    #COLS
    #lastPiece
    constructor() {
        this.#points = [
            [new Cell(32, 272), new Cell(32, 152), new Cell(32, 32), new Cell(152, 32), new Cell(272, 32), new Cell(272, 152), new Cell(272, 272), new Cell(152, 272)],
            [new Cell(72, 232), new Cell(72, 152), new Cell(72, 72), new Cell(152, 72), new Cell(232, 72), new Cell(232, 152), new Cell(232, 232), new Cell(152, 232)],
            [new Cell(112, 192), new Cell(112, 152), new Cell(112, 112), new Cell(152, 112), new Cell(192, 112), new Cell(192, 152), new Cell(192, 192), new Cell(152, 192)]
        ];
        this.#COLS = 8;
        this.#game = new NineMensMorris();
        this.#lastPiece = null;
    }
    #distance({ x: ox, y: oy }, { x: dx, y: dy }) {
        return Math.sqrt(Math.pow(ox - dx, 2) + Math.pow(oy - dy, 2));
    }
    #play(event) {
        let winner;
        try {
            let clickedCell = new Cell(event.offsetX, event.offsetY);
            let index = this.#points.flat().findIndex(cell => this.#distance(cell, clickedCell) < 20);
            if (index === -1) return;
            let cell = new Cell(Math.floor(index / this.#COLS), index % this.#COLS);
            switch (this.#game.getState()) {
                case "position":
                    let turn = this.#game.getTurn();
                    this.#game.position(cell);
                    let img = document.createElement("img");
                    img.src = `./images/${turn}.svg`;
                    let pointCell = this.#points.flat().find(c => this.#distance(c, clickedCell) < 20);
                    img.style.translate = `${pointCell.x - 310}px ${pointCell.y - 10}px`;
                    img.dataset.pointX = cell.x;
                    img.dataset.pointY = cell.y;
                    img.onclick = () => this.#play2(new Cell(parseInt(img.dataset.pointX), parseInt(img.dataset.pointY)));
                    let main = document.querySelector("main");
                    main.appendChild(img);
                    break;
                case "removePiece":
                    console.log("Invalid move.");
                    break;
                case "move":
                    winner = this.#game.move(this.#lastPiece, cell);
                    let imgToMove = this.#getImage(this.#lastPiece);
                    let cellToMove = this.#points[cell.x][cell.y];
                    imgToMove.style.translate = `${cellToMove.x - 310}px ${cellToMove.y - 10}px`;
                    imgToMove.dataset.pointX = cell.x;
                    imgToMove.dataset.pointY = cell.y;
                    break;
            }
        } catch (ex) {
            this.#setMessage(`Erro: ${ex.message}`);
        } finally {
            this.#lastPiece = null;
        }
        this.#showMessage(winner);
    }
    #play2(cell) {
        let winner;
        try {
            switch (this.#game.getState()) {
                case "position":
                    console.log("Can't position a piece here.");
                    break;
                case "removePiece":
                    winner = this.#game.removePiece(cell);
                    let imgToRemove = this.#getImage(cell);
                    imgToRemove.parentElement.removeChild(imgToRemove);
                    break;
                case "move":
                    this.#lastPiece = cell;
                    break;
            }
        } catch (ex) {
            this.#setMessage(`Erro: ${ex.message}`);
        }
        this.#showMessage(winner);
    }
    #showMessage(winner) {
        switch (winner) {
            case Winner.PLAYER1:
                this.#setMessage("Game over! White's win!");
                break;
            case Winner.PLAYER2:
                this.#setMessage("Game over! Black's win!");
                break;
            case Winner.DRAW:
                this.#setMessage("Game over! It's a draw!");
                break;
            default:
                this.#setMessage(this.#game.getTurn() === Player.PLAYER1 ? "White's turn." : "Black's turn");
                break;
        }
    }
    #getImage(cell) {
        return document.querySelector(`img[data-point-x="${cell.x}"][data-point-y="${cell.y}"]`);
    }
    #setMessage(msg) {
        let message = document.querySelector("#message");
        message.textContent = msg;
    }
    registerEvents() {
        let board = document.querySelector("main img");
        board.onclick = this.#play.bind(this);
        this.#showMessage();
    }
}
let gui = new GUI();
gui.registerEvents();