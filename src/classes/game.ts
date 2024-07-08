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
  static kibo: any;
	static background: ParticleField;
  static canvas: Canvas;
	static currentLevel: any = null;
  static goodGuy: GoodGuy;
	static goodGuyFire: GoodGuyFire;
	static badGuyField: BadGuyField;
  static animationTimeoutId: number;
	static badGuyFireIntervalId: number;
	static advanceBadGuysIntervalId: number;
	static playerDestroyedIntervalId: number;
	static endOfLevelIntervalId: number;
	static gameState: GameState;
	static functionToAnimate: any;
	static startButton: TextButton;
	static gameHeader: TextButton;
	static introText: TextButton;
	static exitButton: TextButton;
	static endOfLevelText: TextButton;
	static playAgainButton: TextButton;
	static scoreText: TextButton;
	static livesText: TextButton;
	static playerDestroyedText: TextButton;

  static init = function () {
    try {
			// Create the HTML canvas:
      Game.canvas = new Canvas('canvas');

			// Set up keyboard event handlers:
			Game.eventSetup();

			// We start by showing the splash screen:
			Game.gameStateHandler(GameState.SPLASH);
			
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

	static gameStateHandler = function(gameState: GameState) {
		// This function handles the overall game logic and "flow". This function is called from various points in the code to handle major events in 
		// game-play, such as the goodGuy being destroyed, or the completion of a level.
							
		switch(gameState) {
			case GameState.SPLASH:
			
				// Here we set up the splash screen that introduces the game and provides instructions.
				console.log('SPLASH');
				
				Game.clearCanvas();
				Game.splashInit();
				
				break;
				
			case GameState.NEW_GAME:

				// Here we set up a new game.
				console.log('NEW_GAME');
				
				Game.currentLevel = null;
				Game.clearCanvas();
				Game.getNextLevel();
				Game.scoreInit();
				Game.levelInit();
				
				break;
				
				case GameState.NEW_LEVEL:

				// Here we set up a new level.
				console.log('NEW_LEVEL');
				
				Game.clearCanvas();
				Game.getNextLevel();
				Game.levelInit();
				
				break;
				
			case GameState.LEVEL_RESUME:
			
				// Here we resume play after the goodGuy was destroyed by enemy fire.
				console.log('LEVEL_RESUME');
				
				if (Game.badGuyField.badGuysLeft==0){
					// This is in case the player was destroyed JUST AFTER the last bad guy. 
					if (parseInt(Game.livesText.text[0])==0) {
						Game.gameStateHandler(GameState.END_OF_GAME);
					} else {
						Game.gameStateHandler(GameState.END_OF_LEVEL);
					}
					return;
				}
				
				// Remove remnants of any previous game states...
				Game.playerDestroyedText = null;

				// Create appropriate canvas objects...
				Game.goodGuy = new GoodGuy(
					Game.canvas.ctx, 
					15, 															/* goodGuy's horizontal range of movement - starting point */
					Game.canvas.element.width - 10, 	/* goodGuy's horizontal range of movement - width */
					Game.canvas.element.height - 22, 	/* y position of goodGuy */
					Game.currentLevel.goodGuySpeed, 	/* goodGuy Speed */
					Game.currentLevel.goodGuyColour 	/* goodGuy Colour */
				);
				
				// Resume badGuy missile bombardment and advancement... 
				Game.badGuyFireIntervalId = window.setInterval(
					Game.badGuyField.launchBadGuyFire.bind(Game.badGuyField), 
					Game.currentLevel.badGuyFireIntervalDuration
				);
				Game.advanceBadGuysIntervalId = window.setInterval(
					Game.badGuyField.advanceBadGuys.bind(Game.badGuyField),
					Game.currentLevel.advanceBadGuysIntervalDuration
				);
				
				break;		
				
			case GameState.PLAYER_DESTROYED:
			
				// The goodGuy has just been destroyed by enemy fire. This is a temporary state just to inform the player.
				// We'll shortly advance to the LEVEL_RESUME game state
				console.log('PLAYER_DESTROYED');
			
				// Remove remnants any of previous game states...
				clearInterval(Game.badGuyFireIntervalId);
				clearInterval(Game.advanceBadGuysIntervalId);
				clearInterval(Game.endOfLevelIntervalId);
				Game.goodGuy = null;
				Game.endOfLevelText = null;
				
				// Create appropriate canvas objects...
				Game.playerDestroyedText = new TextButton(
					Game.canvas.ctx,
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
				Game.endOfLevelIntervalId = window.setTimeout(Game.gameStateHandler, 2000, GameState.LEVEL_RESUME);
				
				break;
				
			case GameState.END_OF_LEVEL:
			
				// The goodGuy destroyed all the bad guys. This is a temporary state just to inform the player.
				// We'll shortly advance to the NEW_LEVEL game state.
				console.log('END_OF_LEVEL');
			
				// Remove remnants of any of the previous game states...
				clearInterval(Game.badGuyFireIntervalId);
				clearInterval(Game.advanceBadGuysIntervalId);
				clearInterval(Game.playerDestroyedIntervalId);
				Game.playerDestroyedText = null;
				
				// Create appropriate canvas objects...
				Game.endOfLevelText = new TextButton(
					Game.canvas.ctx,
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
				Game.endOfLevelIntervalId = window.setTimeout(Game.gameStateHandler, 2000, GameState.NEW_LEVEL);
				
				break;

			case GameState.END_OF_GAME:

				if (!Game.animationTimeoutId) {
					// Multiple bad guys may trigger END_OF_GAME. Only handle the first.
					break;
				}
			
				// The bad guys have advanced to the good guy. Game over!
				console.log('END_OF_GAME');
			
				// Remove remnants of any previous game states.
				clearInterval(Game.badGuyFireIntervalId);
				clearInterval(Game.advanceBadGuysIntervalId);
				clearInterval(Game.endOfLevelIntervalId);
				clearInterval(Game.playerDestroyedIntervalId);				
				Game.goodGuy = null;
				
				// Create appropriate canvas objects. In this case, a "play again" button.
				Game.playAgainButton = new TextButton(
					Game.canvas.ctx,
					['Play again?'],
					120, 
					205, 
					160, 
					35,
					'255,255,255',
					'20pt Arial',
					true,
					// The following paramter is the function be be invoked when the button is clicked.
					function(){
						Game.gameStateHandler(GameState.NEW_GAME);
					}
				);

				cancelAnimationFrame(Game.animationTimeoutId);
				Game.animationTimeoutId = null;

				break;

			default:			  
		}		
		
		Game.gameState = gameState;	
	}

  static animationLoop = function() {
		
		// requestAnimationFrame handles the animation for the whole game. It will invoke levelRender every 60th of a second or so.
		Game.animationTimeoutId = requestAnimationFrame(Game.animationLoop);

		Game.functionToAnimate();
	}

  static levelRender = function() {
		// This method will be repeatedly called to animate the appropriate objects on the canvas.

		// the following line of code clears the canvas...
		Game.canvas.element.width = Game.canvas.element.width;

		Game.background.render();
		if (Game.goodGuy) { Game.goodGuy.render(); }
		if (Game.goodGuyFire) { Game.goodGuyFire.render(); }
		if (Game.badGuyField) { Game.badGuyField.render(); }
		Game.exitButton.render();
		Game.scoreText.render();
		Game.livesText.render();
		if (Game.playerDestroyedText) { Game.playerDestroyedText.render(); }
		if (Game.endOfLevelText) { Game.endOfLevelText.render(); }
		if (Game.playAgainButton) { Game.playAgainButton.render(); }
  }

  static levelInit = function() {

		// This method creates the appropriate canvas objects. 
			
		Game.background = new ParticleField(
			10, 																/* number of particles in the field */
			Game.canvas.ctx, 
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
			Game.currentLevel.redLowerBound,		/* "red-ness" of each particle: lower-bound */
			Game.currentLevel.redUpperBound,		/* "red-ness" of each particle: upper-bound */
			Game.currentLevel.greenLowerBound,	/* "green-ness" of each particle: lower-bound */
			Game.currentLevel.greenUpperBound,	/* "green-ness" of each particle: upper-bound */
			Game.currentLevel.blueLowerBound,		/* "blue-ness" of each particle: lower-bound */
			Game.currentLevel.blueUpperBound		/* "blue-ness" of each particle: upper-bound */
		);

		Game.goodGuy = new GoodGuy(
			Game.canvas.ctx, 
			15,                                 /* goodGuy's horizontal range of movement - starting point */
			Game.canvas.element.width - 10,     /* goodGuy's horizontal range of movement - width */
			Game.canvas.element.height - 22,    /* y position of goodGuy */
			Game.currentLevel.goodGuySpeed,  		/* goodGuy Speed */	
			Game.currentLevel.goodGuyColour  		/* goodGuy Colour */
		);

		Game.badGuyField = new BadGuyField(
			Game.canvas.ctx, 
			Game.currentLevel
		);

		Game.exitButton = new TextButton(
			Game.canvas.ctx,
			['exit'],
			175, 
			10, 
			55, 
			35,
			'255,255,255',
			'20pt Arial',
			true,
			function(){
				Game.gameStateHandler(GameState.SPLASH);
			}
		);

		Game.advanceBadGuysIntervalId = window.setInterval(
			Game.badGuyField.advanceBadGuys.bind(Game.badGuyField),
			Game.currentLevel.advanceBadGuysIntervalDuration
		);
		
		Game.badGuyFireIntervalId = window.setInterval(
			Game.badGuyField.launchBadGuyFire.bind(Game.badGuyField),
			Game.currentLevel.badGuyFireIntervalDuration
		);
		
		Game.functionToAnimate = Game.levelRender;

		Game.animationLoop();
	}

	static scoreInit = function() {
			
		// Here we initialise the two objects on the canvas that hold the player's score and number of lives left.
		
		Game.scoreText = new TextButton(
			Game.canvas.ctx,
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
							
		Game.livesText = new TextButton(
			Game.canvas.ctx,
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
	
	static getNextLevel = function() {	
		// Here we set up parameters for the current level. These parameters also determine the difficulty of the level. 
		
		if (!Game.currentLevel) {
			// We initialize currentLevel to the first level by cloning gameLevelBase.
			Game.currentLevel = JSON.parse(JSON.stringify(GAME_LEVEL_BASE))
		} else {			
			Game.currentLevel.count++;

			// But as the game progresses, the difficulty increases.
			// For example, the bad guys start to close in!
			for (let i = 0; i < Game.currentLevel.badGuyCoordinateList.length; i++) {
				Game.currentLevel.badGuyCoordinateList[i].y += 20;
			}

			// ...and the bombs dropped by the bad guys become faster...
			Game.currentLevel.badGuyFireSpeed += 0.25;
		}

		// Also, we cycle through all the different colour combinations we created, to add some variety.
		var colourComboCount = GAME_LEVEL_COLORS.length;
		Game.currentLevel.goodGuyColour = GAME_LEVEL_COLORS[Game.currentLevel.count%colourComboCount];
		Game.currentLevel.goodGuyFireColour = GAME_LEVEL_COLORS[Game.currentLevel.count%colourComboCount];
		Game.currentLevel.badGuyColour = GAME_LEVEL_COLORS[Game.currentLevel.count%colourComboCount];
		Game.currentLevel.badGuyFireColour = GAME_LEVEL_COLORS[Game.currentLevel.count%colourComboCount];
		
		var backgroundColourComboCount = GAME_LEVEL_BACKGROUND_COLORS.length;
		Game.currentLevel.redLowerBound = GAME_LEVEL_BACKGROUND_COLORS[Game.currentLevel.count%backgroundColourComboCount].redLowerBound;
		Game.currentLevel.redUpperBound = GAME_LEVEL_BACKGROUND_COLORS[Game.currentLevel.count%backgroundColourComboCount].redUpperBound;
		Game.currentLevel.greenLowerBound = GAME_LEVEL_BACKGROUND_COLORS[Game.currentLevel.count%backgroundColourComboCount].greenLowerBound;
		Game.currentLevel.greenUpperBound = GAME_LEVEL_BACKGROUND_COLORS[Game.currentLevel.count%backgroundColourComboCount].greenUpperBound;
		Game.currentLevel.blueLowerBound = GAME_LEVEL_BACKGROUND_COLORS[Game.currentLevel.count%backgroundColourComboCount].blueLowerBound;
		Game.currentLevel.blueUpperBound = GAME_LEVEL_BACKGROUND_COLORS[Game.currentLevel.count%backgroundColourComboCount].blueUpperBound;
	}

	static splashRender = function() {

		// This function will render the appropriate objects on the canvas.
	
		// The following line of code clears the canvas...
		Game.canvas.element.width = Game.canvas.element.width;
		
		// The following objects will be rendered on the canvas.
		Game.startButton.render();
		Game.gameHeader.render();
		Game.introText.render();
	}

	static splashInit = function() {
	
		// This function creates the appropriate canvas objects. 
			
		Game.gameHeader = new TextButton(
			Game.canvas.ctx,
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
	
		Game.introText = new TextButton(
			Game.canvas.ctx,
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
	
		Game.startButton = new TextButton(
			Game.canvas.ctx,
			['start'],
			170, 
			205, 
			65, 
			35,
			'255,255,255',
			'20pt Arial',
			true,
			function(){
				Game.gameStateHandler(GameState.NEW_GAME);
			}
    );

		Game.functionToAnimate = Game.splashRender;

		Game.animationLoop();
	}

	static clearCanvas = function() {
		// Here we clear the canvas of all objects and timers.

		cancelAnimationFrame(Game.animationTimeoutId);
		clearInterval(Game.badGuyFireIntervalId);
		clearInterval(Game.advanceBadGuysIntervalId);
		clearInterval(Game.endOfLevelIntervalId);
		clearInterval(Game.playerDestroyedIntervalId);

		Game.gameState = null;
		Game.goodGuy = null;
		Game.goodGuyFire = null;
		Game.gameHeader = null;
		Game.introText = null;
		Game.startButton = null;
		Game.exitButton = null;
		Game.endOfLevelText = null;
		Game.playAgainButton = null;
		Game.functionToAnimate = null;
		Game.playerDestroyedText = null;

		// These objects contain sub-objects. We need to recursively remove these sub-objects as well.
		if (Game.background) {
			Game.background.clearContents();
			Game.background = null;
		}
		if (Game.badGuyField) {
			Game.badGuyField.clearContents();
			Game.badGuyField = null;
		}
	}

  static eventSetup = function () {
    Game.kibo = new Kibo();
    Game.kibo
		.down('left', () => {
			if (!!Game.goodGuy) {
      	Game.goodGuy.status = GoodGuyStatus.LEFT;
			}
    })
		.down('right', () => {
			if (!!Game.goodGuy) {
				Game.goodGuy.status = GoodGuyStatus.RIGHT;
			}
    })
		.up('any', function() {
			if (!!Game.goodGuy) {
				Game.goodGuy.status = GoodGuyStatus.STATIONARY;
			}
    });
		Game.kibo.down('space', function () {
			// Fire a missile.
      if (Game.goodGuy) {
				if (!Game.goodGuyFire && Game.goodGuy) {
					Game.goodGuyFire = new GoodGuyFire(
						Game.canvas.ctx,
						Game.goodGuy.xPos,
						Game.goodGuy.yPos,
						Game.currentLevel.goodGuyFireSpeed,
						Game.currentLevel.goodGuyFireColour
					);
				}
			}
		});
  }
}
