export class UI {
  static board = ".board";
  static cell = ".field";
  static face = ".face";
  static timer = ".time";
  static bombsLeft = ".bombs-left";

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
    return document.querySelector(UI.timer);
  }
  getBombsLeft() {
    return document.querySelector(UI.bombLeft);
  }
  getFace() {
    return document.querySelector(UI.face);
  }
}
