import { UI } from "./UI.js";
export class Stats extends UI {
  constructor() {
    super();
    this.face = this.getFace();
    this.bombs = this.getBombsLeft();
    this.timer = this.getTimer();
    this.resetFace();
  }
  #interval = null;
  #seconds = 0;

  #updateTimer() {
    this.timer.textContent = this.#seconds;
    this.#seconds++;
    if (this.#seconds > 999) this.stopTimer();
  }
  startTimer() {
    console.log("timer started");
    this.#interval = setInterval(() => {
      this.#updateTimer();
    }, 1000);
  }
  stopTimer() {
    console.log("timer stopped");
    clearInterval(this.#interval);
  }
  resetTimer() {
    this.stopTimer();
    this.#seconds = 0;
    this.#updateTimer();
  }
  toggleSmileFace() {
    this.face.classList.toggle("smile");
  }
  toggleSadFace() {
    this.face.classList.toggle("sad");
  }
  toggleAstFace() {
    this.face.classList.toggle("ast");
  }
  resetFace() {
    this.face.className = "state-field field face not-clicked smile";
  }
  setBombsLeft(quantity) {
    this.bombs.textContent = quantity;
  }
}
