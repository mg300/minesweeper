import { UI } from "./UI.js";
import { Field } from "./field.js";
import { Config } from "./config.js";
class Game extends UI {
  #cellsArr = [];
  #NumberOfCells = 0;
  #cols = 0;
  #rows = 0;

  GenerateBoard(config) {
    const cols = config.cols;
    const rows = config.rows;
    this.#cols = cols;
    this.#rows = rows;
    this.#NumberOfCells = cols * rows;
    const board = this.getBoard();
    for (let i = 0; i < cols; i++) {
      this.#cellsArr[i] = [];
      for (let j = 0; j < rows; j++) {
        this.#cellsArr[i].push(new Field(i, j));
        const div = this.#cellsArr[i][j].createField();
        board.insertAdjacentHTML("beforeend", div);

        this.#cellsArr[i][j].DOMelement = this.getCell(
          this.#cellsArr[i][j].selector
        );
      }
    }
    board.style.gridTemplateColumns = `repeat(${cols},1.61rem)`;
    board.style.gridTemplateRows = `repeat(${rows},1.61rem)`;
  }
  PlaceMines(config) {
    let mines = config.mines;
    const flatArr = this.#cellsArr.flat();

    while (mines) {
      const cel = Math.floor(Math.random() * this.#NumberOfCells);
      flatArr[cel].isMine = true;
      mines--;
    }
  }
  CalcValueForSingleField(x, y) {
    let value = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (
          (i == x && y == j) ||
          i < 0 ||
          j < 0 ||
          i >= this.#cols ||
          j >= this.#rows
        )
          continue;
        if (this.#cellsArr[i][j].isMine) {
          value++;
        }
      }
    }
    if (value == 0) return null;
    return value;
  }

  RenderValueForBoard() {
    for (const firstLevel of this.#cellsArr) {
      for (const secondLevel of firstLevel) {
        this.#cellsArr[secondLevel.x][secondLevel.y].value =
          this.CalcValueForSingleField(secondLevel.x, secondLevel.y);
      }
    }
  }

  AddEventListenerToFields() {
    const board = this.getBoard();
    let moving = false;
    let prevEl = null;
    board.addEventListener("mousedown", (e) => {
      moving = true;
      board.addEventListener("mousemove", (s) => {
        if (prevEl) prevEl.classList.remove("hover");
        if (!moving) return;
        prevEl = document.elementFromPoint(s.clientX, s.clientY);
        prevEl.classList.add("hover");
      });
      board.addEventListener(
        "mouseup",
        (x) => {
          moving = false;
          if (typeof x.target.dataset.x == "undefined") return;
          const cell = this.#cellsArr[x.target.dataset.x][x.target.dataset.y];
          cell.isClicked = true;
          cell.showField();
          this.showEmptyFields(x.target.dataset.x, x.target.dataset.y);
        },
        { once: true }
      );
    });
  }
  showEmptyFields(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    if (!this.#cellsArr[x][y].value) {
      for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, this.#cols); i++) {
        for (
          let j = Math.max(y - 1, 0);
          j <= Math.min(y + 1, this.#rows);
          j++
        ) {
          if (!this.#cellsArr[i][j].isClicked) {
            this.#cellsArr[i][j].showField();
          }
        }
      }
    }
  }
  initGame() {
    this.GenerateBoard(Config.easy);
    this.PlaceMines(Config.easy);
    this.RenderValueForBoard();
    this.AddEventListenerToFields();
  }
}
const saper = new Game();
saper.initGame();
