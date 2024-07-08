import { BadGuy } from './badguy';
import { BadGuyFire } from './badguyfire';

// BadGuyField is used to represent the full set of bad guys on the canvas. We use the object created from this class, 
// badGuyField, to invoke functions that need to be applied to the bad guys "en masse" - like advancing them toward 
// the goodGuy object.
export class BadGuyField {
  private _numBadGuys: number;
  private _badGuysLeft: number;
  private _badGuys: Array<BadGuy>;
  private _badGuysFire: Array<BadGuyFire>;

  constructor(
    private _context: any,
    private _gameLevel: any,
  ) {

    this._numBadGuys = this._gameLevel.badGuyCoordinateList.length;
    this._badGuysLeft = this._numBadGuys;
    this._badGuys = new Array(this._numBadGuys);
    this._badGuysFire = new Array(this._numBadGuys);

    for (let i = 0; i < this._numBadGuys; i++) {

      // Create the individual bad guys.
      this._badGuys[i] = new BadGuy(
        this._context,
        this._gameLevel.badGuyCoordinateList[i].x,
        this._gameLevel.badGuyCoordinateList[i].y,
        this._gameLevel.badGuyColor,
        i
      );
    }
  }

  public render = function () {

    for (let i = 0; i < this._numBadGuys; i++) {
    // Be careful to render only those bad guys that haven't been destroyed.
      if (this._badGuys[i]) this._badGuys[i].render();
    }
    for (let i = 0; i < this._numBadGuys; i++) {
      if (this._badGuysFire[i]) this._badGuysFire[i].render();
    }
  }

  public fire = function (badGuyIndex: number) {

    // Launch a missile from the bad guy represented by badGuyIndex.
    this.badGuysFire[badGuyIndex] = new BadGuyFire(
      this._context, 
      this._badGuys[badGuyIndex].xPos, 
      this._badGuys[badGuyIndex].yPos + this._badGuys[badGuyIndex].radius, 
      this._gameLevel.badGuyFireSpeed,
      this._gameLevel.badGuyFireColor,
      badGuyIndex
    );
  }

  public clearContents = function () {

    // This removes all the individual bad guys (and missiles) from the canvas.

    for (let i = 0; i < this._numBadGuys; i++) {
      if (this._badGuys[i]) this._badGuys[i] = null;
    }
    for (let i = 0; i < this._numBadGuys; i++) {
      if (this._badGuysFire[i]) this._badGuysFire[i] = null;
  }
}

  public removeBadGuy = function (index: number) {

    this._badGuys[index]=null;
    this._badGuysLeft=this._badGuysLeft-1;
  }

  public removeBadGuyFire = function (index: number) {

    this._badGuysFire[index]=null;
  
  }
  
	public launchBadGuyFire = function(){
		
		// This function will be periodically invoked to randomly select a bad guy to fire a missile at the goodGuy.
		
		let i = Math.floor(Math.random() * this._numBadGuys);	
    if (this._badGuys[i]) this.fire(i);
	}
	
  public advanceBadGuys = function(){

		// This function will be periodically invoked to advance the badGuyField downwards towards the goodGuy.
		
		for (let i = 0; i < this._numBadGuys; i++) {
			if (this._badGuys[i]) {
        this._badGuys[i].yPos+=10;
      }
		}
	}

  public get numBadGuys() {
    return this._numBadGuys;
  }

  public set numBadGuys(numBadGuys: number) {
    this._numBadGuys = numBadGuys;
  }

  public get badGuysLeft() {
    return this._badGuysLeft;
  }

  public set badGuysLeft(badGuysLeft: number) {
    this._badGuysLeft = badGuysLeft;
  }

  public get badGuysFire() {
    return this._badGuysFire
  }

  public set badGuysFire(badGuysFire: Array<BadGuyFire>) {
    this._badGuysFire = badGuysFire;
  }
}
