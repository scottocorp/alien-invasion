import { GoodGuyStatus } from '../constants'
import { Game } from './game';
import { GameState } from '../constants'
import { 
  hitTest2,
  animateCanvasObject
} from '../utilities';

// The GoodGuy class is used to represent the user, or "good guy" in the game.
export class GoodGuy {
  
  private _xPos: number;
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

    if (this._status==GoodGuyStatus.DESTROYED) {
      // By this stage the goodGuy has been shot, and after a period of TRANSITION (where she flickers) her status has been changed to DESTROYED.
      
      // So first we decremnet the number of live she has left.		
      Game.livesText.decrement();
		
      if (parseInt(Game.livesText.text[0])==0) {
        // If all the lives are used up, we've reached the end of the game, and so we need to change the game state to END_OF_GAME.
        Game.gameStateHandler(GameState.END_OF_GAME);
      } else {
        // Otherwise we only need to change the game state to PLAYER_DESTROYED.
        Game.gameStateHandler(GameState.PLAYER_DESTROYED);
      }
      return;
    }
    
    // We iterate through all the bad guy's to see if any fired a missile that hit the goodGuy.	
    for (let i = 0; i < Game.badGuyField.numBadGuys; i++) {
  
      if (Game.badGuyField.badGuysFire[i]) {

        if (hitTest2(this, Game.badGuyField.badGuysFire[i])) {

          //YOU'VE BEEN HIT!
          
          // goodGuy's been hit, but before we remove her, we make her "flicker" and set her status to TRANSITION...
          // After x flicker cycles of y milliseconds each (where x and y are the two numbers below) ...
          // We change her status to DESTROYED....
          // So that, in the next animation frame, she'll be removed from the canvas by the code above.
          animateCanvasObject(
            10,
            50,
            {transitionEffect: function(frame: number, time:number) {
              Game.goodGuy._status = GoodGuyStatus.TRANSITION;
              Game.goodGuy._alpha = frame % 2;
            }},
            {afterTransition: function(frame: number, time:number) {
              Game.goodGuy._status = GoodGuyStatus.DESTROYED;
            }}
          );
          
          // Remove the bad guy fire from the canvas.
          Game.badGuyField.removeBadGuyFire(i)
        }
      }
    }
    
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

  public get vertices() {
    return this._vertices;
  }

  public set vertices(vertices: any) {
    this._vertices = vertices;
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

  public get status() {
    return this._status;
  }

  public set status(status: GoodGuyStatus) {
    this._status = status;
  }
}
