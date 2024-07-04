import { BadGuy } from './badguy';

// BadGuyField is used to represent the full set of bad guys on the canvas. We use the object created from this class, 
// badGuyField, to invoke functions that need to be applied to the bad guys "en masse" - like advancing them toward 
// the goodGuy object.
export class BadGuyField {
  private _numBadGuys: number;
  private _badGuysLeft: number;
  private _badGuys: Array<BadGuy>;

  constructor(
    private _context: any,
    private _gameLevel: any,
  ) {

    this._numBadGuys = this._gameLevel.badGuyCoordinateList.length;
    this._badGuysLeft = this._numBadGuys;
    this._badGuys = new Array(this._numBadGuys);

    for (let i = 0; i < this._numBadGuys; i++) {

      // Create the individual bad guys.
      this._badGuys[i] = new BadGuy(
        this._context,
        this._gameLevel.badGuyCoordinateList[i].x,
        this._gameLevel.badGuyCoordinateList[i].y,
        this._gameLevel.badGuyColour,
        i
      );
    }
  }

  public render = function () {

    for (let i = 0; i < this._numBadGuys; i++) {
    // Be careful to render only those bad guys that haven't been destroyed.
      if (this._badGuys[i]) this._badGuys[i].render();
    }
  }

  public clearContents = function () {

    // This removes all the individual bad guys (and missiles) from the canvas.

    for (let i = 0; i < this._numBadGuys; i++) {
      if (this._badGuys[i]) this._badGuys[i] = null;
    }
  }

  public removeBadGuy = function (index: number) {

    this._badGuys[index]=null;
    this._badGuysLeft=this._badGuysLeft-1;
  }

	public advanceBadGuys = function(){

		// This function will be periodically invoked to advance the badGuyField downwards towards the goodGuy.
		
		for (let i = 0; i < this._numBadGuys; i++) {
			if (this._badGuys[i]) {
        this._badGuys[i].yPos+=10;
      }
		}
	}
}