import { UI } from "./UI.js";
import { Field } from "./field.js";
import { Config } from "./config.js";
import { Stats } from "./Stats.js";
class Game extends UI {
  constructor(config) {
    super();
    this.cols = config.cols;
    this.rows = config.rows;
    this.bombs = config.mines;
    this.NumberOfCells = config.cols * config.rows;
    this.cellsLeft = 10;
    this.isGameWin = false;
    this.isGameLost = false;
    this.FieldsLeft = config.cols * config.rows - config.mines;
    this.cellsArr = [];
    this.board = this.getBoard();
    this.stats = new Stats();
  }
  setGrid() {
    this.board.style.gridTemplateColumns = `repeat(${this.cols},1.61rem)`;
    this.board.style.gridTemplateRows = `repeat(${this.rows},1.61rem)`;
  }
  GenerateBoard() {
    for (let i = 0; i < this.cols; i++) {
      this.cellsArr[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.cellsArr[i].push(new Field(i, j));
        const div = this.cellsArr[i][j].createField();
        this.board.insertAdjacentHTML("beforeend", div);
        this.cellsArr[i][j].setDOMelement();
      }
    }
    this.setGrid();
  }
  PlaceMines(mines) {
    let mine = mines;
    const flatArr = this.cellsArr.flat();

    while (mines) {
      const cel = Math.floor(Math.random() * this.NumberOfCells);
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
          i >= this.cols ||
          j >= this.rows
        )
          continue;
        if (this.cellsArr[i][j].isMine) {
          value++;
        }
      }
    }
    if (value == 0) return null;
    return value;
  }

  assignValueToFields() {
    for (const firstLevel of this.cellsArr) {
      for (const secondLevel of firstLevel) {
        this.cellsArr[secondLevel.x][secondLevel.y].value =
          this.CalcValueForSingleField(secondLevel.x, secondLevel.y);
      }
    }
  }
  showEmptyFields(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, this.cols - 1); i++) {
      for (
        let j = Math.max(y - 1, 0);
        j <= Math.min(y + 1, this.rows - 1);
        j++
      ) {
        if (!this.cellsArr[i][j].isClicked) {
          this.handleClick(this.cellsArr[i][j]);
        }
      }
    }
  }

  addEventClick() {
    let moving = false;
    let prevEl = null;
    this.board.addEventListener("mousedown", (e) => {
      if (this.isGameLost || this.isGameWin) return;
      moving = true;
      this.stats.toggleAstFace();
      this.stats.toggleSmileFace();
      this.board.addEventListener("mousemove", (s) => {
        if (prevEl) prevEl.classList.remove("hover");
        if (!moving) return;
        prevEl = document.elementFromPoint(s.clientX, s.clientY);
        prevEl.classList.add("hover");
      });
      document.addEventListener(
        "mouseup",
        (x) => {
          this.stats.toggleSmileFace();
          this.stats.toggleAstFace();
          moving = false;
          if (typeof e.target.dataset.x == "undefined") return;
          const field = this.cellsArr[e.target.dataset.x][e.target.dataset.y];
          this.handleClick(field);
        },
        { once: true }
      );
    });
  }
  endGame(bool) {
    if (bool) {
      this.isGameWin = true;
      this.showFieldsWithBomb();
    } else {
      this.isGameLost = true;
      console.log("end");
      this.stats.toggleSmileFace();
      this.stats.toggleSadFace();
    }
  }

  handleClick(field) {
    if (field.isMine) {
      field.showBomb();
      this.endGame();
      return;
    }
    if (field.isFlagged) return;
    if (field.isQusetionMark) return;
    if (field.value) {
      field.showValue();
    }
    field.isClicked = true;
    field.showEmpty();
    if (!field.value) this.showEmptyFields(field.x, field.y);
  }

  initGame() {
    this.GenerateBoard();
    this.PlaceMines(this.bombs);
    this.assignValueToFields();
    this.addEventClick();
  }
}
const saper = new Game(Config.easy);
saper.initGame();
