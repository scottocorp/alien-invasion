
// Particle is used to represent one of the background particles on the canvas.
export class Particle {

  private _xPos: number;
  private _yPos: number;
  private _radius: number;
  private _xSpeed: number;
  private _ySpeed: number;
  private _color: string;

  constructor(
    private _context: any,
    private _particleFieldXPos: number,
    private _particleFieldYPos: number,
    private _particleFieldWidth: number,
    private _particleFieldHeight: number,
    radiusLowerBound: number,
    radiusUpperBound: number,
    xSpeedLowerBound: number,
    xSpeedUpperBound: number,
    ySpeedLowerBound: number,
    ySpeedUpperBound: number,
    redLowerBound: number,
    redUpperBound: number,
    greenLowerBound: number,
    greenUpperBound: number,
    blueLowerBound: number,
    blueUpperBound: number,
  ) {

    // Each particle receives a random position on the canvas.
    this._xPos = this._particleFieldXPos + Math.random() * this._particleFieldWidth;
    this._yPos = this._particleFieldYPos + Math.random() * this._particleFieldHeight;

    // Each particle receives a random radius that lies between radiusLowerBound and radiusUpperBound.
    this._radius = Math.floor(Math.random() * (radiusUpperBound + 1 - radiusLowerBound)) + radiusLowerBound;
    // Each particle receives a random horizontal speed that lies between xSpeedLowerBound and xSpeedUpperBound.
    this._xSpeed = Math.floor(Math.random() * (xSpeedUpperBound + 1 - xSpeedLowerBound)) + xSpeedLowerBound;
    // Each particle receives a random vertical speed that lies between ySpeedLowerBound and ySpeedUpperBound.
    this._ySpeed = Math.floor(Math.random() * (ySpeedUpperBound + 1 - ySpeedLowerBound)) + ySpeedLowerBound;

    // Each particle receives a random red component that lies between redLowerBound and redUpperBound.
    let nRed = Math.floor(Math.random() * (redUpperBound - redLowerBound)) + redLowerBound;
    // Each particle receives a random green component that lies between greenLowerBound and greenUpperBound.
    let nGreen = Math.floor(Math.random() * (greenUpperBound - greenLowerBound)) + greenLowerBound;
    // Each particle receives a random blue component that lies between blueLowerBound and blueUpperBound.
    let nBlue = Math.floor(Math.random() * (blueUpperBound - blueLowerBound)) + blueLowerBound;
    // Here we use a bit-shifting trick to combine the 3 color components into a single field.
    let nRGB = nRed << 16 | nGreen << 8 | nBlue;
    this._color = `#${nRGB.toString(16)}`;
  }

  public render = function () {

    // Each animation frame we move the particle a small amount to give the illusion of movement.
    this._xPos = this._xPos + this._xSpeed;
    this._yPos = this._yPos + this._ySpeed;

    if ((this._yPos > this._particleFieldYPos + this._particleFieldHeight) && (this._ySpeed > 0)) {
      // The down-moving particle has reached the bottom of the canvas and so must be cycled back to the top.
      this._yPos = this._particleFieldYPos;
    }
    if ((this._yPos < this._particleFieldYPos) && (this._ySpeed < 0)) {
      // The up-moving particle has reached the top of the canvas and so must be cycled back to the bottom.
      this._yPos = this._particleFieldYPos + this._particleFieldHeight;
    }

    if ((this._xPos > this._particleFieldXPos + this._particleFieldWidth) && (this._xSpeed > 0)) {
      // The right-moving particle has reached the right of the canvas and so must be cycled back to the left.
      this._xPos = this._particleFieldXPos;
    }
    if ((this._xPos < this._particleFieldXPos) && (this._xSpeed < 0)) {
      // The left-moving particle has reached the left of the canvas and so must be cycled back to the right.
      this._xPos = this._particleFieldXPos + this._particleFieldWidth;
    }

    this.create();
  }

  private create = function () {

    // First we take a backup of the context...
    this._context.save();

    // Because we are going to translate it to the object's x and y position...  
    this._context.translate(this._xPos, this._yPos);

    // And draw a circle on the canvas... 
    this._context.strokeStyle = this._color;
    this._context.fillStyle = this._color;
    this._context.beginPath();
    this._context.arc(0, 0, this._radius, 0, Math.PI * 2, true);
    this._context.closePath();
    this._context.stroke();
    this._context.fill();

    // And once we're done, we just restore the context...
    this._context.restore();
  }
}