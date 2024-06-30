import '../assets/style.css';
import { Kibo } from '../utilities/kibo';
import { Canvas } from './canvas';
import { GoodGuy, GoodGuyStatus } from './goodguy';

export class Game {
  static kibo: any;
  static canvas: Canvas;
  static goodGuy: GoodGuy;
  static animationTimeoutId: number;

  static init = function () {
    try {
      Game.canvas = new Canvas('canvas');

      Game.goodGuy = new GoodGuy(
        Game.canvas, 
        15,                                 /* goodGuy's horizontal range of movement - starting point */
        Game.canvas.element.width - 10,     /* goodGuy's horizontal range of movement - width */
        Game.canvas.element.height - 22,    /* y position of goodGuy */
        // this.currentLevel.goodGuySpeed,  /* goodGuy Speed */	
        // this.currentLevel.goodGuyColour  /* goodGuy Colour */
        3,
        "255,0,0",
      );

      Game.eventSetup();

      Game.animationLoop();

    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  static eventSetup = function () {
    Game.kibo = new Kibo();
    Game.kibo.down(['left', 'right'], () => {

      if (Game.goodGuy) {
        const status: keyof typeof GoodGuyStatus = Game.kibo.lastKey().toUpperCase();
        Game.goodGuy.status = GoodGuyStatus[status];
      }
    }).up('any', function() {
      Game.goodGuy.status = GoodGuyStatus.STATIONARY;
    });
  }

  static animationLoop = function() {
		
		// requestAnimationFrame handles the animation for the whole game. It will invoke levelRender every 60th of a second or so.
		Game.animationTimeoutId = requestAnimationFrame(Game.levelRender);
    // cancelAnimationFrame(Game.animationTimeoutId);
	}

  static levelRender = function() {
		// the following line of code clears the canvas...
		Game.canvas.element.width = Game.canvas.element.width;

    Game.goodGuy.render();

    Game.animationLoop();
  }
}
