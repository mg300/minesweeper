import { UI } from "./UI.js";
export class Field extends UI {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.value = null;
    this.isMine = false;
    this.isFlagged = false;
    this.isQuestionMark = false;
    this.isClicked = false;
    this.selector = `[data-x='${x}'][data-y='${y}']`;
    this.DOMelement = null;
    // this.DOMelement = `<div class="field not-clicked" data-x=""></div>`;
  }
  setDOMelement() {
    this.DOMelement = this.getCell(this.selector);
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

  showAllBombs(arr) {
    arr.flat().forEach((arr) => {
      if (arr.isMine) {
        arr.DOMelement.classList.remove("not-clicked");
        arr.DOMelement.classList.add("bomb-detonated");
      }
    });
  }
  showValue() {
    this.DOMelement.classList.add(`number-${this.value}`);
    this.DOMelement.classList.add(`number`);
    this.DOMelement.textContent = `${this.value}`;
  }
  showEmpty() {
    this.DOMelement.classList.add("clicked");
    this.DOMelement.classList.remove("not-clicked");
  }

  /////////////////////////////////
}
