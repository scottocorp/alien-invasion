import { 
  GameState,
  BadGuyStatus,
  CANVAS_BADGUY_LIMIT
} from '../constants'
import { 
  hitTest1,
  animateCanvasObject
} from '../utilities';
import { Game } from './game';
import explosionAudio from '../assets/explosion_new.wav';

// BadGuy is used to represent a bad guy on the canvas.
export class BadGuy {
  private _radius: number;
  private _status: BadGuyStatus;
  private _alpha: number;
  private _explosionAudio: any;
  private _game: Game;

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

    this._explosionAudio = new Audio(explosionAudio);

    this._game = new Game();

    this.create();
  }

  public render = function () {

    if (this.status==BadGuyStatus.DESTROYED) {
      // By this stage the bad guy has been shot, and after a period of TRANSITION, whereby he flickers, her status has been changed to DESTROYED.
      // So now we need to remove her from the canvas.		
      this._game.badGuyField.removeBadGuy(this._badGuyIndex);
      
      // But if that was the last bad guy, we've reached the end of the level, and so we need to change the game state to END_OF_LEVEL.
      if (this._game.badGuyField.badGuysLeft==0) {
        this._game.gameStateHandler(GameState.END_OF_LEVEL);
      }

      return;
    }
    
    if (this.yPos > CANVAS_BADGUY_LIMIT) {
      // If any bad guy reaches this far down the canvas, then its game over, goodGuy!
      this._game.gameStateHandler(GameState.END_OF_GAME);
    }
      
    if (this._game.goodGuyFire && this.status != BadGuyStatus.TRANSITION) {

      if (hitTest1(this, this._game.goodGuyFire)) {
    
        //SHOT HER!
        
        let currentBadGuy = this;
      
        // We've hit the bad guy, but before we remove her, we make her "flicker" and set her status to TRANSITION...
        // After x flicker cycles of y milliseconds each (where x and y are the two numbers below) ...
        // We change her status to DESTROYED....
        // So that, in the next animation frame, she'll be removed from the canvas by the code above.
        animateCanvasObject(
          5,
          50,
          {transitionEffect: function(frame: number, time: any) {
            currentBadGuy._status = BadGuyStatus.TRANSITION
            currentBadGuy._alpha = frame % 2;
          }},
          {afterTransition: function(frame: number, time:any) {
            currentBadGuy._status = BadGuyStatus.DESTROYED
          }}
        );

        // Make an explosion sound.
        this.explosion();

        // Remove the goodGuy fire from the canvas.
        this._game.goodGuyFire = null;

        // Increment the score
        this._game.scoreText.increment();
      }
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

  private explosion() {

    this._explosionAudio.pause();
    this._explosionAudio.currentTime = 0;
    this._explosionAudio.play();
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

  public get status() {
    return this._status;
  }

  public set status(status: BadGuyStatus) {
    this._status = status;
  }
}