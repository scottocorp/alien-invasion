import { 
  GameState,
  BadGuyStatus,
  CANVAS_BADGUY_LIMIT
} from '../constants'
import { Game } from './game';

// BadGuy is used to represent a bad guy on the canvas.
export class BadGuy {
  private _radius: number;
  private _status: BadGuyStatus;
  private _alpha: number;
  
  constructor(
    private _context: any,
    private _xPos: number,
    private _yPos: number,
    private _color: string,
    private _badGuyIndex: number,
  ) {

    this._radius = 10;
    this._status = BadGuyStatus.ALIVE;
    this._alpha = 1.0;

    this.create();
  }

  public render = function () {

    if (this._yPos > CANVAS_BADGUY_LIMIT) {
      // If any bad guy reaches this far down the canvas, then its game over, goodGuy!
      Game.gameStateHandler(GameState.END_OF_GAME);
    }
      
    this.create();
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
  };

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

  public get status() {
    return this._status;
  }

  public set status(status: BadGuyStatus) {
    this._status = status;
  }
}