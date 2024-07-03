import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants'
import { Game } from './game';

export class Canvas {
  public element: any;
  public ctx: any;

  constructor(
    public id: string
  ) {
    this.element = document.createElement('canvas');
    this.element.setAttribute('id', id);
    this.element.width = CANVAS_WIDTH;
    this.element.height = CANVAS_HEIGHT;
    this.element.innerHTML = 'This canvas element renders a simple computer game.';
    document.body.appendChild(this.element);

    if (this.element.getContext) {
      this.ctx = this.element.getContext('2d');
    } else {
      throw new Error('Cannot get the canvas context.');
    }

		this.element.addEventListener('click', this.mouseClickHandler.bind(this), false);
		this.element.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
  }

  private mouseClickHandler = function (e: any) {

    // This function will be invoked every time the user clicks her mouse.
    
    var x1;
    var y1;
    if (e.pageX || e.pageY) {
      x1 = e.pageX;
      y1 = e.pageY;
    }
    else {
      x1 = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y1 = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x1 -= this.element.offsetLeft;
    y1 -= this.element.offsetTop;

    // Control will be passed to whichever button the user clicked.
    if (Game.startButton && Game.startButton.areWeInside(x1, y1))
      Game.startButton.clickAction();
    if (Game.exitButton && Game.exitButton.areWeInside(x1, y1))
      Game.exitButton.clickAction();
    }

  private mouseMoveHandler = function (e:any) {

    // This function will be invoked every time the user moves her mouse.
    
    var x1;
    var y1;
    if (e.pageX || e.pageY) {
      x1 = e.pageX;
      y1 = e.pageY;
    }
    else {
      x1 = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y1 = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x1 -= this.element.offsetLeft;
    y1 -= this.element.offsetTop;

    // Whichever button is moused-over will have it's text temporarily highlighted.
    if (Game.startButton) { Game.startButton.areWeInside(x1, y1) ? Game.startButton.alpha = 1.0 : Game.startButton.alpha = 0.8; }
    if (Game.exitButton) { Game.exitButton.areWeInside(x1, y1) ? Game.exitButton.alpha = 1.0 : Game.exitButton.alpha = 0.8; }
  };
}
