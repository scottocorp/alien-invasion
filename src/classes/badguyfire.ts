import { Game } from './game';
import { CANVAS_HEIGHT } from '../constants'

// BadGuyFire is used to represent the bad guy's missile on the canvas.
export class BadGuyFire {

  private _radius: number;
  private _alpha: number;

  constructor(
    private _context: any,
    private _xPos: number,
    private _yPos: number,
    private _ySpeed: number,
    private _color: string,
    private _badGuysFireIndex: number,
) {

    this._radius = 3;
    this._alpha = 1.0;
  }

  public render = function () {

    if (this._yPos > CANVAS_HEIGHT) {
      // The missile has reached the bottom of the canvas and so must be removed.
      Game.badGuyField.removeBadGuyFire(this._badGuysFireIndex);
    }
    else {
      // Each animation frame we move the missile down a small amount to give the illusion of movement.
      this._yPos = this._yPos + this._ySpeed;
      this.create();
    }
  }

  private create = function () {

    // First we take a backup of the context...
    this._context.save();

    // Because we are going to translate it to the object's x and y position...  
    this._context.translate(this._xPos, this._yPos);

    // And draw a circle on the canvas...
    this._context.fillStyle = `rgba(${this._color}, ${this._alpha})`;
    this._context.beginPath();
    this._context.arc(0, 0, this._radius, 0, Math.PI * 2, true);
    this._context.closePath();
    this._context.fill();

    // And once we're done, we just restore the context...
    this._context.restore();
  }

  public get radius() {
    return this._radius;
  }

  public set radius(radius: number) {
    this._radius = radius;
  }

  public get xPos() {
    return this._xPos;
  }

  public set xPos(xPos: number) {
    this._xPos = xPos;
  }

  public get yPos() {
    return this._yPos;
  }

  public set yPos(yPos: number) {
    this._yPos = yPos;
  }

  public get alpha() {
    return this._alpha;
  }

  public set alpha(alpha: number) {
    this._alpha = alpha;
  }
}