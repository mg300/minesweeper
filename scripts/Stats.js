import { UI } from "./UI.js";
export class Stats extends UI {
  constructor() {
    super();
    this.face = this.getFace();
    this.bombs = this.getBombsLeft();
    this.timer = this.getTimer();
  }
  startTimer() {}
  stopTimer() {}
  toggleSmileFace() {
    this.face.classList.toggle("smile");
  }
  toggleSadFace() {
    this.face.classList.toggle("sad");
  }
  toggleAstFace() {
    this.face.classList.toggle("ast");
  }
  setBombsLeft(quantity) {
    this.bombs.innerHTML = this.quantity;
  }
}
