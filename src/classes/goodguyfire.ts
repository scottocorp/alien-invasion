import { Game } from './game';

// GoodGuyFire is used to represent the good guy's missile on the canvas.
export class GoodGuyFire {

  private _radius: number;
  private _alpha: number;

  constructor(
    private _context: any,
    private _xPos: number,
    private _yPos: number,
    private _ySpeed: number,
    private _color: string,
  ) {

    this._radius = 3;
    this._alpha = 1.0;
  }

  public render = function () {

    if (this._yPos < 0) {
      // The missile has reached the top of the canvas and so must be removed.
      Game.goodGuyFire = null;
    } else {
      // In each animation frame we move the missile up a small amount to give the illusion of movement.
      this._yPos = this._yPos - this._ySpeed;
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

  public get alpha() {
    return this._alpha;
  }

  public set alpha(alpha: number) {
    this._alpha = alpha;
  }
}