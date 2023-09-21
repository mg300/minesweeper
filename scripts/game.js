import { UI } from "./UI.js";
import { Field } from "./field.js";
import { Config } from "./config.js";
import { Stats } from "./Stats.js";
class Game extends UI {
  constructor(config) {
    super();
    this.startNewGame(config);
    this.initGame();
  }
  startNewGame(config) {
    if (this.stats) this.stats.resetTimer();
    this.config = config;
    this.cols = config.cols;
    this.board = this.getBoard();
    this.board.innerHTML = "";
    this.rows = config.rows;
    this.bombs = config.mines;
    this.bombsLeft = config.mines;
    this.NumberOfCells = config.cols * config.rows;
    this.isGameWin = false;
    this.isGameLost = false;
    this.FieldsLeft = config.cols * config.rows - config.mines;
    this.cellsArr = [];
    this.levels = this.getLevels();
    this.stats = new Stats();
    this.GenerateBoard();
    this.PlaceMines(this.bombs);
    this.assignValueToFields();
    this.stats.setBombsLeft(this.bombsLeft);
    this.addEventTimer();
  }
  setGrid() {
    this.board.style.gridTemplateColumns = `repeat(${this.cols},1.61rem)`;
    this.board.style.gridTemplateRows = `repeat(${this.rows},1.61rem)`;
  }
  GenerateBoard() {
    for (let i = 0; i < this.rows; i++) {
      this.cellsArr[i] = [];
      for (let j = 0; j < this.cols; j++) {
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
      if (!flatArr[cel].isMine) mines--;
      flatArr[cel].isMine = true;
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
          i >= this.rows ||
          j >= this.cols
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
    for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, this.rows - 1); i++) {
      for (
        let j = Math.max(y - 1, 0);
        j <= Math.min(y + 1, this.cols - 1);
        j++
      ) {
        if (!this.cellsArr[i][j].isClicked) {
          this.handleClick(this.cellsArr[i][j]);
        }
      }
    }
  }

  addEventClickField() {
    let moving = false;
    let prevEl = null;
    this.board.addEventListener("mousedown", (e) => {
      if (this.isGameLost || this.isGameWin || e.button == 2 || e.button == 1)
        return;
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
          const field = this.cellsArr[x.target.dataset.x][x.target.dataset.y];
          this.handleClick(field);
        },
        { once: true }
      );
    });
  }
  endGame(bool) {
    this.stats.stopTimer();
    if (bool) {
      this.isGameWin = true;
      Field.showAllBombs(this.cellsArr);
    } else {
      this.isGameLost = true;
      this.stats.setBombsLeft(0);
      Field.showAllBombs(this.cellsArr);
      this.stats.toggleSmileFace();
      this.stats.toggleSadFace();
    }
  }
  addEventFace() {
    this.stats.face.addEventListener("click", () => {
      let children = Array.from(this.levels.children);
      const el = children.find((e) => e.classList.contains("clicked"));
      console.log(el.dataset.level);
      if (el.dataset.level == "easy") this.startNewGame(Config.easy);
      if (el.dataset.level == "normal") this.startNewGame(Config.normal);
      if (el.dataset.level == "expert") this.startNewGame(Config.expert);
    });
  }
  checkFlaggedFields() {
    let fieldCheck = 0;
    this.cellsArr.flat().forEach((e) => {
      fieldCheck = e.isFlagged && e.isMine ? fieldCheck + 1 : fieldCheck;
    });
    console.log(fieldCheck);
    if (fieldCheck == this.bombs) this.endGame(true);
  }
  handleClick(field) {
    if (field.isMine) {
      this.endGame(false);
      return;
    }
    if (field.isFlagged) {
      return;
    }
    if (field.isQusetionMark) return;
    if (field.value) {
      field.showValue();
    }
    field.isClicked = true;

    field.showEmpty();
    this.FieldsLeft--;
    if (this.FieldsLeft == 0) {
      this.endGame(true);
      return;
    }
    if (!field.value) this.showEmptyFields(field.x, field.y);
  }
  addEventTimer() {
    this.board.addEventListener(
      "click",
      this.stats.startTimer.bind(this.stats),
      { once: true }
    );
  }
  addEventRightClick() {
    this.board.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      let field = this.cellsArr[e.target.dataset.x][e.target.dataset.y];
      if (field.isClicked) return;
      if (field.isQuestionMark) {
        console.log("x");
        field.toggleQuestionMark();
        return;
      }
      if (field.isFlagged) {
        this.bombsLeft++;
        field.toggleQuestionMark();
        field.toggleFlag();
      } else if (!field.isFlagged) {
        field.toggleFlag();
        this.bombsLeft--;
        if (this.bombsLeft == 0) {
          this.checkFlaggedFields();
        }
      }
      field.isFlagged = !field.isFlagged;
      this.cellsArr[e.target.dataset.x][e.target.dataset.y].isFlagged =
        !field.isFlagged;
      this.stats.setBombsLeft(this.bombsLeft);
    });
  }
  addEventLevels() {
    this.levels.addEventListener("click", (e) => {
      this.levels.childNodes.forEach((e) => {
        if (typeof e.classList != "undefined") e.classList.remove("clicked");
      });
      const el = e.target.classList;
      if (el.contains("easy")) {
        this.startNewGame(Config.easy);
        el.add("clicked");
      } else if (el.contains("medium")) {
        this.startNewGame(Config.normal);
        el.add("clicked");
      } else if (el.contains("hard")) {
        this.startNewGame(Config.expert);
        el.add("clicked");
      }
    });
  }

  initGame() {
    this.addEventClickField();
    this.addEventFace();
    this.addEventRightClick();
    this.addEventLevels();
  }
}
const saper = new Game(Config.easy);
