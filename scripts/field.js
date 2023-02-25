import { UI } from "./UI.js";
export class Field extends UI {
  constructor(x, y) {
    super();
    ``;
    this.x = x;
    this.y = y;
    this.value = null;
    this.isMine = false;
    this.isDetonated = false;
    this.isFlagged = false;
    this.isQuestionMark = false;
    this.isClicked = false;
    this.selector = `[data-x='${x}'][data-y='${y}']`;
    this.DOMelement = null;
    // this.DOMelement = `<div class="field not-clicked" data-x=""></div>`;
  }
  createField() {
    const element = ` <div class="field not-clicked" data-x="${this.x}" data-y="${this.y}"></div>`;
    return element;
  }

  toggleFlag() {
    this.DOMelement.classList.toggle("flag");
    this.isFlagged = !this.isFlagged;
  }
  toggleQuestionMark() {
    if (!this.isQuestionMark) {
      this.DOMelement.textContent = "?";
    } else {
      this.DOMelement.textContent = "";
    }
  }

  showField() {
    this.isClicked = true;
    if (this.isMine) {
      this.DOMelement.classList.add("bomb-detonated");
      this.DOMelement.classList.remove("not-clicked");
      return;
    } else if (this.value) {
      this.DOMelement.classList.add(`number-${this.value}`);
      this.DOMelement.classList.add(`number`);

      this.DOMelement.textContent = `${this.value}`;
    }
    this.DOMelement.classList.add("clicked");
    this.DOMelement.classList.remove("not-clicked");
  }
}
