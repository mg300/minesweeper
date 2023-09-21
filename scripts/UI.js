export class UI {
  static board = ".board";
  static cell = ".field";
  static face = ".face";
  static timer = ".time";
  static bombsLeft = ".bombs-left";
  static levels = ".levels";

  getCell(sel) {
    return document.querySelector(sel);
  }
  getCells() {
    return document.querySelectorAll(UI.cell);
  }
  getBoard() {
    return document.querySelector(UI.board);
  }
  getTimer() {
    return document.querySelector(UI.timer).firstChild;
  }
  getBombsLeft() {
    return document.querySelector(UI.bombsLeft).firstChild;
  }
  getFace() {
    return document.querySelector(UI.face);
  }
  getLevels() {
    return document.querySelector(UI.levels);
  }
}
