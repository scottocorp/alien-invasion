import { GoodGuyStatus } from '../constants'

// The GoodGuy class is used to represent the user, or "good guy" in the game.
export class GoodGuy {
  
  public _xPos: number;
  private _vertices: any;
  private _status: GoodGuyStatus;
  private _alpha: number;

  constructor(
    private _context: any,
    private _goodGuyXRangeStart: number,
    private _goodGuyXRangeWidth: number,
    private _yPos: number,
    private _goodGuySpeed: number,
    private _color: string,
	) {

    // Place the goodGuy squarely in the middle of the range that has been assigned.
    this._xPos = this._goodGuyXRangeStart + 0.5 * this._goodGuyXRangeWidth-10;

    this._vertices = [{ x: 0, y: 0 }, { x: 10, y: 17 }, { x: -10, y: 17}];
    //this.vertices = [{ x: 0, y: 0 }, { x: 20, y: 34 }, { x: -20, y: 34}];

    this._status = GoodGuyStatus.STATIONARY;
    this._alpha = 1.0;

    this.create();
  }

  public render = function () {

    if (this._status == GoodGuyStatus.LEFT) {
		  // The user is holding down the left arrow key, so we move goodGuy left.
      this._xPos -= this._goodGuySpeed;
      if (this._xPos < this._goodGuyXRangeStart) {
			// But no further left than the start of goodGuy's constraining range.
        this._xPos = this._goodGuyXRangeStart;
      }
    }

    if (this._status == GoodGuyStatus.RIGHT) {
      // The user is holding down the right arrow key, so we move goodGuy right.
      this._xPos += this._goodGuySpeed;
      if (this._xPos > this._goodGuyXRangeStart + this._goodGuyXRangeWidth - 20) {
			  // But no further right than the end of goodGuy's constraining range.
        this._xPos = this._goodGuyXRangeStart + this._goodGuyXRangeWidth - 20;
      }
    }

    this.create();
  }

  private create = function () {

    // First we take a backup of the context...
    this._context.save();
  
    // Because we are going to translate it to the object's x and y position...  
    this._context.translate(this._xPos, this._yPos);
  
    // And draw a polygon, the vertices of which are stored in this.vertices
    this._context.fillStyle = `rgba(${this._color}, ${this._alpha})`;  
    this._context.beginPath();
  
    this._context.moveTo(this._vertices[0].x, this._vertices[0].y);
  
    let length = this._vertices.length;
  
    for (let i = 1; i <= length; i++) {
  
      if (i < length) {
        this._context.lineTo(this._vertices[i].x, this._vertices[i].y);
      } else {
        this._context.lineTo(this._vertices[0].x, this._vertices[0].y);
      }
    }
  
    this._context.closePath();
    this._context.fill();
  
    // And once we're done, we just restore the context...
    this._context.restore();
  
  }

  public get status() {
    return this._status;
  }

  public set status(status: GoodGuyStatus) {
    this._status = status;
  }
}
