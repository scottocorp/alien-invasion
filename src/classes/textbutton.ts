
// TextButtonStatus contains all the possible TextButton statuses.
export enum TextButtonStatus {
  NORMAL = 0,
  TRANSITION = 1,
  END_OF_TRANSITION = -1
}

// TextButton is used to represent both text fields and buttons on the canvas.
// If the clickAction parameter is null, it's a text field. Otherwise, it's a button, and clickAction is the function to invoke when the button is clicked.
export class TextButton {
  private _context: any;
  private _status: TextButtonStatus;
  private _alpha: number;

  constructor(
    canvas: any,
    private _text: string[],
    private _xPos: number,
    private _yPos: number,
    private _width: number,
    private _height: number,
    private _color: string,
    private _font: string,
    private _background: boolean,
    public clickAction: any,
  ) {
    this._context = canvas.ctx;

    this._status = TextButtonStatus.NORMAL;
    this._alpha = 0.8;

    this.create();
  }

  public render = function () {

    this.create();
  }

  private create = function () {

    // First we take a backup of the context...
    this._context.save();
  
    // Because we are going to translate it to the object's x and y position...  
    this._context.translate(this._xPos, this._yPos);
  
    if (this._background) {
      // A grey rectangular background is to be rendered behind the text.
      this._context.fillStyle = '#555';
      this._context.fillRect(0, 0, this._width, this._height);
    }
  
    this._context.fillStyle = `rgba(${this._color}, ${this._alpha})`;
    this._context.font = this._font;

    // The text will be separated into several lines.
    let textArrayLength = this._text.length;
    for (let i = 0; i < textArrayLength; i++){
      this._context.fillText(this._text[i], 5, 25 + (i*25));
    }
  
    // and once we're done, we just restore the context...
    this._context.restore();
  }
  
  public areWeInside = function (inX: number, inY: number)
  {
    // This function will return true if the user's cursor is within the bounds of the current object. 
    
    if (inX >= this._xPos && inX <= this._xPos + this._width && inY >= this._yPos && inY <= this._yPos + this._height)
      return true;
    else
      return false;
  }

  public increment = function () {

    // Increment by one the numeric value stored within the text field.
    
    let textToInt = parseInt(this._text);
    textToInt++;
    this._text = textToInt.toString();
  }

  public decrement = function () {

    // Decrement by one the numeric value stored within the text field.
    
    let textToInt = parseInt(this._text);
    textToInt--;
    this._text = textToInt.toString();
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

  public set status(status: TextButtonStatus) {
    this._status = status;
  }
}