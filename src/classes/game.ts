import '../assets/style.css';
import { Canvas } from './canvas';
import { GoodGuy } from './goodguy';

export class Game {
  static canvas: Canvas;
  static goodGuy: GoodGuy;

  static init() {
    try {
      this.canvas = new Canvas('canvas')

      this.goodGuy = new GoodGuy(
        this.canvas, 
        15,                                 /* goodGuy's horizontal range of movement - starting point */
        this.canvas.element.width - 10,     /* goodGuy's horizontal range of movement - width */
        this.canvas.element.height - 22,    /* y position of goodGuy */
        // this.currentLevel.goodGuySpeed,  /* goodGuy Speed */	
        // this.currentLevel.goodGuyColour  /* goodGuy Colour */
        3,
        "255,0,0",
      );

    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
