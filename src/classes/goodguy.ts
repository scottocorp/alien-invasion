
// GoodGuyStatus contains all the possible good guy statuses
export enum GoodGuyStatus {
  "DESTROYED" = -1,
  "TRANSITION" = 0,
  "STATIONARY" = 1,
  "LEFT" = 2,
  "RIGHT" = 3
}

// The GoodGuy class is used to represent the user, or "good guy" in the game.
export class GoodGuy {
  
  public context: any;
  public xPos: number;
  public vertices: any;
  public status: GoodGuyStatus;
  public alpha: number;

  constructor(
    public canvas: any,
    public goodGuyXRangeStart: number,
    public goodGuyXRangeWidth: number,
    public yPos: number,
    public goodGuySpeed: number,
    public colour: string,
	) {

    this.context = canvas.ctx;

    // Place the goodGuy squarely in the middle of the range that has been assigned.
    this.xPos = this.goodGuyXRangeStart + 0.5 * this.goodGuyXRangeWidth-10;

    this.vertices = [{ x: 0, y: 0 }, { x: 10, y: 17 }, { x: -10, y: 17}];
    //this.vertices = [{ x: 0, y: 0 }, { x: 20, y: 34 }, { x: -20, y: 34}];

    this.status = GoodGuyStatus.STATIONARY;
    this.alpha = 1.0;

    this.create();
  }

  public create = function () {

    // First we take a backup of the context...
    this.context.save();
  
    // Because we are going to translate it to the object's x and y position...  
    this.context.translate(this.xPos, this.yPos);
  
    // And draw a polygon, the vertices of which are stored in this.vertices
    this.context.fillStyle = "rgba(" + this.colour + ", " + this.alpha + ")";  
    this.context.beginPath();
  
    this.context.moveTo(this.vertices[0].x, this.vertices[0].y);
  
    var length = this.vertices.length;
  
    for (var i = 1; i <= length; i++) {
  
      if (i < length) {
        this.context.lineTo(this.vertices[i].x, this.vertices[i].y);
      } else {
        this.context.lineTo(this.vertices[0].x, this.vertices[0].y);
      }
    }
  
    this.context.closePath();
    this.context.fill();
  
    // And once we're done, we just restore the context...
    this.context.restore();
  
  };
}
