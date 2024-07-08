import { Particle } from './particle';

// ParticleField is used to represent the entire particle field on the canvas.
export class ParticleField {

  private _particles: Array<Particle>;

  constructor(
    private _numParticles: number,
    private _context: any,
    particleFieldXPos: number,
    particleFieldYPos: number,
    particleFieldWidth: number,
    particleFieldHeight: number,
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

    this._particles = new Array(this._numParticles);

    // Create the individual particles.
    for (let i = 0; i < this._numParticles; i++) {

      this._particles[i] = new Particle(
        _context,
        particleFieldXPos,
        particleFieldYPos,
        particleFieldWidth,
        particleFieldHeight,
        radiusLowerBound,
        radiusUpperBound,
        xSpeedLowerBound,
        xSpeedUpperBound,
        ySpeedLowerBound,
        ySpeedUpperBound,
        redLowerBound,
        redUpperBound,
        greenLowerBound,
        greenUpperBound,
        blueLowerBound,
        blueUpperBound
      );
    }
  }

  public render = function () {

    for (let i = 0; i < this._numParticles; i++) {
      this._particles[i].render();
    }
  }

  public clearContents = function () {

    for (let i = 0; i < this._numParticles; i++) {
      this._particles[i] = null;
    }
  }
}