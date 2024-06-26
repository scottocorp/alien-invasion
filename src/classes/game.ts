import '../assets/style.css';
import { Canvas } from './canvas';

export class Game {
  static canvas: Canvas;

  static init() {
    try {
      this.canvas = new Canvas('canvas')
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
