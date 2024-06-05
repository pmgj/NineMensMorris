import Cell from "./Cell.js";
import CellState from "./CellState.js";
import ComputerPlayer from "./ComputerPlayer.js";
import NineMensMorris from "./NineMensMorris.js";
import Player from "./Player.js";
import Winner from "./Winner.js";

class GUI {
    #points
    #game
    #COLS
    #lastPiece
    #computer
    constructor() {
        this.#points = [
            [new Cell(15, 235), new Cell(15, 120), new Cell(15, 5), new Cell(130, 5), new Cell(245, 5), new Cell(245, 120), new Cell(245, 235), new Cell(130, 235)],
            [new Cell(53, 197), new Cell(53, 120), new Cell(53, 45), new Cell(130, 45), new Cell(207, 45), new Cell(207, 120), new Cell(207, 195), new Cell(130, 197)],
            [new Cell(92, 158), new Cell(92, 120), new Cell(92, 82), new Cell(130, 82), new Cell(168, 82), new Cell(168, 120), new Cell(168, 158), new Cell(130, 160)]
        ];
        this.#COLS = 8;
        this.#game = new NineMensMorris();
        this.#lastPiece = null;
        this.#computer = new ComputerPlayer(CellState.PLAYER2);
    }
    #distance({ x: ox, y: oy }, { x: dx, y: dy }) {
        return Math.sqrt(Math.pow(ox - dx, 2) + Math.pow(oy - dy, 2));
    }
    #innerPlay(cell) {
        let winner;
        try {
            switch (this.#game.getState()) {
                case "position":
                    let turn = this.#game.getTurn();
                    this.#game.position(cell);
                    let img = document.createElement("img");
                    img.src = `./images/${turn}.svg`;
                    let pointCell = this.#points[cell.x][cell.y];
                    img.style.translate = `${pointCell.x - 250 - 10}px ${pointCell.y - 10}px`;
                    img.dataset.pointX = cell.x;
                    img.dataset.pointY = cell.y;
                    img.onclick = () => this.#play2(new Cell(parseInt(img.dataset.pointX), parseInt(img.dataset.pointY)));
                    let main = document.querySelector("main");
                    main.appendChild(img);
                    winner = Winner.NONE;
                    break;
                case "removePiece":
                    console.log("Invalid move.");
                    break;
                case "move":
                case "flying":
                    winner = this.#game.move(this.#lastPiece, cell);
                    let imgToMove = this.#getImage(this.#lastPiece);
                    let cellToMove = this.#points[cell.x][cell.y];
                    imgToMove.style.translate = `${cellToMove.x - 250 - 10}px ${cellToMove.y - 10}px`;
                    imgToMove.dataset.pointX = cell.x;
                    imgToMove.dataset.pointY = cell.y;
                    break;
            }
        } catch (ex) {
            this.#setMessage(`Erro: ${ex.message}`);
        } finally {
            this.#lastPiece = null;
        }
        return winner;
    }
    #play(event) {
        let clickedCell = new Cell(event.offsetX, event.offsetY);
        let index = this.#points.flat().findIndex(cell => this.#distance(cell, clickedCell) < 20);
        if (index === -1) return;
        let cell = new Cell(Math.floor(index / this.#COLS), index % this.#COLS);
        let winner = this.#innerPlay(cell);
        this.#showMessage(winner);
    }
    #removePiece(cell) {
        let winner = this.#game.removePiece(cell);
        let imgToRemove = this.#getImage(cell);
        imgToRemove.parentElement.removeChild(imgToRemove);
        return winner;
    }
    #play2(cell) {
        let winner;
        try {
            switch (this.#game.getState()) {
                case "position":
                    console.log("Can't position a piece here.");
                    break;
                case "removePiece":
                    winner = this.#removePiece(cell);
                    break;
                case "move":
                case "flying":
                    this.#lastPiece = cell;
                    break;
            }
        } catch (ex) {
            this.#setMessage(`Erro: ${ex.message}`);
        }
        this.#showMessage(winner);
    }
    #unregisterEvents() {
        let board = document.querySelector("#board");
        board.onclick = undefined;
    }
    #showMessage(winner) {
        let writeMessage = () => {
            let messages = {
                'position': `Position a piece in an empty space.`,
                'removePiece': `Remove an opponent's piece.`,
                'move': `Move your piece.`,
                'flying': `Move your piece.`
            };
            let turn = this.#game.getTurn() === Player.PLAYER1 ? "White's turn." : "Black's turn.";
            let rm = this.#game.getRemainingMoves() === this.#game.MAX_MOVES ? "" : `There are ${this.#game.getRemainingMoves()} remaining moves.`;
            this.#setMessage(`${turn} ${messages[this.#game.getState()]} ${rm}`);
        };
        switch (winner) {
            case Winner.PLAYER1:
                this.#setMessage("Game over! White's win!");
                this.#unregisterEvents();
                break;
            case Winner.PLAYER2:
                this.#setMessage("Game over! Black's win!");
                this.#unregisterEvents();
                break;
            case Winner.DRAW:
                this.#setMessage("Game over! It's a draw!");
                this.#unregisterEvents();
                break;
            case Winner.NONE:
                writeMessage();
                setTimeout(() => {
                    let w;
                    while (this.#game.getTurn() === Player.PLAYER2) {
                        let obj = this.#computer.alphabeta({ game: this.#game }, 4);
                        switch (this.#game.getState()) {
                            case "position":
                                w = this.#innerPlay(obj.beginCell);
                                break;
                            case "removePiece":
                                w = this.#removePiece(obj.beginCell);
                                break;
                            case "move":
                            case "flying":
                                this.#lastPiece = obj.beginCell;
                                w = this.#innerPlay(obj.endCell);
                                break;
                        }
                        writeMessage();
                    }
                    this.#showMessage(w);
                }, 2000);
                break;
            default:
                writeMessage();
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
        let board = document.querySelector("#board");
        board.onclick = this.#play.bind(this);
        this.#showMessage();
    }
}
let gui = new GUI();
gui.registerEvents();