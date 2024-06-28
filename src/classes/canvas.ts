
export class Canvas {
  public element: any;
  public ctx: any;

  constructor(
    public id: string
  ) {
    this.element = document.createElement('canvas');
    this.element.setAttribute('id', id);
    this.element.width = 400;
    this.element.height = 480;
    this.element.innerHTML = 'This canvas element renders a simple computer game.';
    document.body.appendChild(this.element);

    if (this.element.getContext) {
      this.ctx = this.element.getContext("2d");
    } else {
      throw new Error("Cannot get the canvas context.");
    }
  }
}
