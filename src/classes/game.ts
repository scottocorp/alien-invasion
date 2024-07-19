import '../assets/style.css';
import { 
	GameState,
	GoodGuyStatus,
	GAME_LEVEL_BASE,
	GAME_LEVEL_COLORS,
	GAME_LEVEL_BACKGROUND_COLORS,
	CANVAS_WIDTH,
	CANVAS_HEIGHT
} from '../constants'
import { Kibo } from '../utilities/kibo';
import { Canvas } from './canvas';
import { GoodGuy } from './goodguy';
import { GoodGuyFire } from './goodguyfire';
import { BadGuyField } from './badguyfield';
import { TextButton } from './textbutton';
import { ParticleField } from './particlefield';

export class Game {
	static instance: Game;

	private kibo: any;
	private background: ParticleField;
	private canvas: Canvas;
	private currentLevel: any = null;
	public goodGuy: GoodGuy;
	public goodGuyFire: GoodGuyFire;
	public badGuyField: BadGuyField;
	private animationTimeoutId: number;
	private badGuyFireIntervalId: number;
	private advanceBadGuysIntervalId: number;
	private playerDestroyedIntervalId: number;
	private endOfLevelIntervalId: number;
	private gameState: GameState;
	private functionToAnimate: any;
	private startButton: TextButton;
	private gameHeader: TextButton;
	private introText: TextButton;
	private exitButton: TextButton;
	private endOfLevelText: TextButton;
	private playAgainButton: TextButton;
	public scoreText: TextButton;
	public livesText: TextButton;
	private playerDestroyedText: TextButton;

  constructor() {
		try {
			if (Game.instance) {
				return Game.instance;
			}
			Game.instance = this;
	
			// Create the HTML canvas:
      this.canvas = new Canvas('canvas');

			// Set up keyboard event handlers:
			this.eventSetup();

			// We start by showing the splash screen:
			this.gameStateHandler(GameState.SPLASH);
			
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

	public gameStateHandler = function(gameState: GameState) {
		// This function handles the overall game logic and "flow". This function is called from various points in the code to handle major events in 
		// game-play, such as the goodGuy being destroyed, or the completion of a level.
							
		switch(gameState) {
			case GameState.SPLASH:
			
				// Here we set up the splash screen that introduces the game and provides instructions.
				console.log('SPLASH');
				
				this.clearCanvas();
				this.splashInit();
				
				break;
				
			case GameState.NEW_GAME:

				// Here we set up a new game.
				console.log('NEW_GAME');
				
				this.currentLevel = null;
				this.clearCanvas();
				this.getNextLevel();
				this.scoreInit();
				this.levelInit();
				
				break;
				
				case GameState.NEW_LEVEL:

				// Here we set up a new level.
				console.log('NEW_LEVEL');
				
				this.clearCanvas();
				this.getNextLevel();
				this.levelInit();
				
				break;
				
			case GameState.LEVEL_RESUME:
			
				// Here we resume play after the goodGuy was destroyed by enemy fire.
				console.log('LEVEL_RESUME');
				
				if (this.badGuyField.badGuysLeft==0){
					// This is in case the player was destroyed JUST AFTER the last bad guy. 
					if (parseInt(this.livesText.text[0])==0) {
						this.gameStateHandler(GameState.END_OF_GAME);
					} else {
						this.gameStateHandler(GameState.END_OF_LEVEL);
					}
					return;
				}
				
				// Remove remnants of any previous game states...
				this.playerDestroyedText = null;

				// Create appropriate canvas objects...
				this.goodGuy = new GoodGuy(
					this.canvas.ctx, 
					15, 															/* goodGuy's horizontal range of movement - starting point */
					this.canvas.element.width - 10, 	/* goodGuy's horizontal range of movement - width */
					this.canvas.element.height - 22, 	/* y position of goodGuy */
					this.currentLevel.goodGuySpeed, 	/* goodGuy Speed */
					this.currentLevel.goodGuyColor 	/* goodGuy Color */
				);
				
				// Resume badGuy missile bombardment and advancement... 
				this.badGuyFireIntervalId = window.setInterval(
					this.badGuyField.launchBadGuyFire.bind(this.badGuyField), 
					this.currentLevel.badGuyFireIntervalDuration
				);
				this.advanceBadGuysIntervalId = window.setInterval(
					this.badGuyField.advanceBadGuys.bind(this.badGuyField),
					this.currentLevel.advanceBadGuysIntervalDuration
				);
				
				break;		
				
			case GameState.PLAYER_DESTROYED:
			
				// The goodGuy has just been destroyed by enemy fire. This is a temporary state just to inform the player.
				// We'll shortly advance to the LEVEL_RESUME game state
				console.log('PLAYER_DESTROYED');
			
				// Remove remnants any of previous game states...
				clearInterval(this.badGuyFireIntervalId);
				clearInterval(this.advanceBadGuysIntervalId);
				clearInterval(this.endOfLevelIntervalId);
				this.goodGuy = null;
				this.endOfLevelText = null;
				
				// Create appropriate canvas objects...
				this.playerDestroyedText = new TextButton(
					this.canvas.ctx,
					['Player Destroyed'],
					90, 
					205, 
					220, 
					35,
					'255,255,255',
					'20pt Arial',
					false,
					null
				);

				// Set a timeout. Once expired, we'll advance to the LEVEL_RESUME game state
				this.endOfLevelIntervalId = window.setTimeout(this.gameStateHandler.bind(this), 2000, GameState.LEVEL_RESUME);
				
				break;
				
			case GameState.END_OF_LEVEL:
			
				// The goodGuy destroyed all the bad guys. This is a temporary state just to inform the player.
				// We'll shortly advance to the NEW_LEVEL game state.
				console.log('END_OF_LEVEL');
			
				// Remove remnants of any of the previous game states...
				clearInterval(this.badGuyFireIntervalId);
				clearInterval(this.advanceBadGuysIntervalId);
				clearInterval(this.playerDestroyedIntervalId);
				this.playerDestroyedText = null;
				
				// Create appropriate canvas objects...
				this.endOfLevelText = new TextButton(
					this.canvas.ctx,
					['Next Level'],
					130, 
					205, 
					140, 
					35,
					'255,255,255',
					'20pt Arial',
					false,
					null
				);
				
				// Set a timeout. Once expired, we'll advance to the NEW_LEVEL game state.
				this.endOfLevelIntervalId = window.setTimeout(this.gameStateHandler.bind(this), 2000, GameState.NEW_LEVEL);
				
				break;

			case GameState.END_OF_GAME:

				if (!this.animationTimeoutId) {
					// Multiple bad guys may trigger END_OF_GAME. Only handle the first.
					break;
				}
			
				// The bad guys have advanced to the good guy. Game over!
				console.log('END_OF_GAME');
			
				// Remove remnants of any previous game states.
				clearInterval(this.badGuyFireIntervalId);
				clearInterval(this.advanceBadGuysIntervalId);
				clearInterval(this.endOfLevelIntervalId);
				clearInterval(this.playerDestroyedIntervalId);				
				this.goodGuy = null;
				
				// Create appropriate canvas objects. In this case, a "play again" button.
				this.playAgainButton = new TextButton(
					this.canvas.ctx,
					['Play again?'],
					120, 
					205, 
					160, 
					35,
					'255,255,255',
					'20pt Arial',
					true,
					// The following paramter is the function be be invoked when the button is clicked.
					(function(){
						this.gameStateHandler(GameState.NEW_GAME);
					}).bind(this)
				);

				cancelAnimationFrame(this.animationTimeoutId);
				this.animationTimeoutId = null;

				break;

			default:			  
		}		
		
		this.gameState = gameState;	
	}

  public animationLoop = function() {
		// requestAnimationFrame handles the animation for the whole game. It will invoke levelRender every 60th of a second or so.
		this.animationTimeoutId = requestAnimationFrame(this.animationLoop.bind(this));

		this.functionToAnimate();
	}

  private levelRender = function() {
		// This method will be repeatedly called to animate the appropriate objects on the canvas.

		// the following line of code clears the canvas...
		this.canvas.element.width = this.canvas.element.width;

		this.background.render();
		if (this.goodGuy) { this.goodGuy.render(); }
		if (this.goodGuyFire) { this.goodGuyFire.render(); }
		if (this.badGuyField) { this.badGuyField.render(); }
		this.exitButton.render();
		this.scoreText.render();
		this.livesText.render();
		if (this.playerDestroyedText) { this.playerDestroyedText.render(); }
		if (this.endOfLevelText) { this.endOfLevelText.render(); }
		if (this.playAgainButton) { this.playAgainButton.render(); }
  }

  private levelInit = function() {

		// This method creates the appropriate canvas objects.

		this.background = new ParticleField(
			10, 																/* number of particles in the field */
			this.canvas.ctx, 
			0,																	/* particlefield x pos */
			0,																	/* particlefield y pos */
			CANVAS_WIDTH,												/* particlefield width */
			CANVAS_HEIGHT,											/* particlefield height */
			1,																	/* radius of each particle: lower-bound */
			1,																	/* radius of each particle: upper-bound */
			0,																	/* x speed of each particle: lower-bound */
			0,																	/* x speed of each particle: upper-bound */
			1,																	/* y speed of each particle: lower-bound */
			3,																	/* y speed of each particle: upper-bound */
			this.currentLevel.redLowerBound,		/* "red-ness" of each particle: lower-bound */
			this.currentLevel.redUpperBound,		/* "red-ness" of each particle: upper-bound */
			this.currentLevel.greenLowerBound,	/* "green-ness" of each particle: lower-bound */
			this.currentLevel.greenUpperBound,	/* "green-ness" of each particle: upper-bound */
			this.currentLevel.blueLowerBound,		/* "blue-ness" of each particle: lower-bound */
			this.currentLevel.blueUpperBound		/* "blue-ness" of each particle: upper-bound */
		);

		this.goodGuy = new GoodGuy(
			this.canvas.ctx, 
			15,                                 /* goodGuy's horizontal range of movement - starting point */
			this.canvas.element.width - 10,     /* goodGuy's horizontal range of movement - width */
			this.canvas.element.height - 22,    /* y position of goodGuy */
			this.currentLevel.goodGuySpeed,  		/* goodGuy Speed */	
			this.currentLevel.goodGuyColor  		/* goodGuy Color */
		);

		this.badGuyField = new BadGuyField(
			this.canvas.ctx, 
			this.currentLevel
		);

		this.exitButton = new TextButton(
			this.canvas.ctx,
			['exit'],
			175, 
			10, 
			55, 
			35,
			'255,255,255',
			'20pt Arial',
			true,
			(function(){
				this.gameStateHandler(GameState.SPLASH);
			}).bind(this)
		);

		this.advanceBadGuysIntervalId = window.setInterval(
			this.badGuyField.advanceBadGuys.bind(this.badGuyField),
			this.currentLevel.advanceBadGuysIntervalDuration
		);
		
		this.badGuyFireIntervalId = window.setInterval(
			this.badGuyField.launchBadGuyFire.bind(this.badGuyField),
			this.currentLevel.badGuyFireIntervalDuration
		);
		
		this.functionToAnimate = this.levelRender;

		this.animationLoop();
	}

	private scoreInit = function() {
			
		// Here we initialise the two objects on the canvas that hold the player's score and number of lives left.
		
		this.scoreText = new TextButton(
			this.canvas.ctx,
			['0'],
			10, 
			10, 
			50, 
			35,
			'255,255,255',
			'20pt Arial',
			false,
			null
		);
							
		this.livesText = new TextButton(
			this.canvas.ctx,
			['3'],
			340, 
			10, 
			50, 
			35,
			'255,255,255',
			'20pt Arial',
			false,
			null
		);
	}
	
	private getNextLevel = function() {	
		// Here we set up parameters for the current level. These parameters also determine the difficulty of the level. 
		
		if (!this.currentLevel) {
			// We initialize currentLevel to the first level by cloning gameLevelBase.
			this.currentLevel = JSON.parse(JSON.stringify(GAME_LEVEL_BASE))
		} else {			
			this.currentLevel.count++;

			// But as the game progresses, the difficulty increases.
			// For example, the bad guys start to close in!
			for (let i = 0; i < this.currentLevel.badGuyCoordinateList.length; i++) {
				this.currentLevel.badGuyCoordinateList[i].y += 20;
			}

			// ...and the bombs dropped by the bad guys become faster...
			this.currentLevel.badGuyFireSpeed += 0.25;
		}

		// Also, we cycle through all the different color combinations we created, to add some variety.
		var colorComboCount = GAME_LEVEL_COLORS.length;
		this.currentLevel.goodGuyColor = GAME_LEVEL_COLORS[this.currentLevel.count%colorComboCount];
		this.currentLevel.goodGuyFireColor = GAME_LEVEL_COLORS[this.currentLevel.count%colorComboCount];
		this.currentLevel.badGuyColor = GAME_LEVEL_COLORS[this.currentLevel.count%colorComboCount];
		this.currentLevel.badGuyFireColor = GAME_LEVEL_COLORS[this.currentLevel.count%colorComboCount];
		
		var backgroundColorComboCount = GAME_LEVEL_BACKGROUND_COLORS.length;
		this.currentLevel.redLowerBound = GAME_LEVEL_BACKGROUND_COLORS[this.currentLevel.count%backgroundColorComboCount].redLowerBound;
		this.currentLevel.redUpperBound = GAME_LEVEL_BACKGROUND_COLORS[this.currentLevel.count%backgroundColorComboCount].redUpperBound;
		this.currentLevel.greenLowerBound = GAME_LEVEL_BACKGROUND_COLORS[this.currentLevel.count%backgroundColorComboCount].greenLowerBound;
		this.currentLevel.greenUpperBound = GAME_LEVEL_BACKGROUND_COLORS[this.currentLevel.count%backgroundColorComboCount].greenUpperBound;
		this.currentLevel.blueLowerBound = GAME_LEVEL_BACKGROUND_COLORS[this.currentLevel.count%backgroundColorComboCount].blueLowerBound;
		this.currentLevel.blueUpperBound = GAME_LEVEL_BACKGROUND_COLORS[this.currentLevel.count%backgroundColorComboCount].blueUpperBound;
	}

	private splashRender = function() {

		// This function will render the appropriate objects on the canvas.
	
		// The following line of code clears the canvas...
		this.canvas.element.width = this.canvas.element.width;
		
		// The following objects will be rendered on the canvas.
		this.startButton.render();
		this.gameHeader.render();
		this.introText.render();
	}

	private splashInit = function() {
	
		// This function creates the appropriate canvas objects. 
			
		this.gameHeader = new TextButton(
			this.canvas.ctx,
			['Alien Invasion'],
			10, 
			10, 
			50, 
			35,
			'255,87,87',
			'24pt Arial',
			false,
			null
		);	
	
		this.introText = new TextButton(
			this.canvas.ctx,
			['Use left and right arrow keys to move.', 'Use the spacebar to fire.', 'Good luck!'],
			10, 
			50, 
			50, 
			35,
			'255,255,255',
			'16pt Arial',
			false,
			null
		);	
	
		this.startButton = new TextButton(
			this.canvas.ctx,
			['start'],
			170, 
			205, 
			65, 
			35,
			'255,255,255',
			'20pt Arial',
			true,
			(function(){
				this.gameStateHandler(GameState.NEW_GAME)
			}).bind(this)
    );

		this.functionToAnimate = this.splashRender;

		this.animationLoop();
	}

	private clearCanvas = function() {
		// Here we clear the canvas of all objects and timers.

		cancelAnimationFrame(this.animationTimeoutId);
		clearInterval(this.badGuyFireIntervalId);
		clearInterval(this.advanceBadGuysIntervalId);
		clearInterval(this.endOfLevelIntervalId);
		clearInterval(this.playerDestroyedIntervalId);

		this.gameState = null;
		this.goodGuy = null;
		this.goodGuyFire = null;
		this.gameHeader = null;
		this.introText = null;
		this.startButton = null;
		this.exitButton = null;
		this.endOfLevelText = null;
		this.playAgainButton = null;
		this.functionToAnimate = null;
		this.playerDestroyedText = null;

		// These objects contain sub-objects. We need to recursively remove these sub-objects as well.
		if (this.background) {
			this.background.clearContents();
			this.background = null;
		}
		if (this.badGuyField) {
			this.badGuyField.clearContents();
			this.badGuyField = null;
		}
	}

  private eventSetup = function () {
    this.kibo = new Kibo();
    this.kibo.down('left', (() => {
			if (!!this.goodGuy) {
      	this.goodGuy.status = GoodGuyStatus.LEFT;
			}
    }).bind(this));
		this.kibo.down('right', (() => {
			if (!!this.goodGuy) {
				this.goodGuy.status = GoodGuyStatus.RIGHT;
			}
    }).bind(this));
		this.kibo.up('any', (() => {
			if (!!this.goodGuy) {
				this.goodGuy.status = GoodGuyStatus.STATIONARY;
			}
    }).bind(this));
		this.kibo.down('space', (() => {
			// Fire a missile.
      if (this.goodGuy) {
				if (!this.goodGuyFire && this.goodGuy) {
					this.goodGuyFire = new GoodGuyFire(
						this.canvas.ctx,
						this.goodGuy.xPos,
						this.goodGuy.yPos,
						this.currentLevel.goodGuyFireSpeed,
						this.currentLevel.goodGuyFireColor
					);
					this.goodGuy.fire();
				}
			}
		}).bind(this));
  }
}
