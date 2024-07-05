import '../assets/style.css';
import { 
	GameState,
	GoodGuyStatus,
	GAME_LEVEL_BASE,
	GAME_LEVEL_COLORS
} from '../constants'
import { Kibo } from '../utilities/kibo';
import { Canvas } from './canvas';
import { GoodGuy } from './goodguy';
import { GoodGuyFire } from './goodguyfire';
import { BadGuyField } from './badguyfield';
import { TextButton } from './textbutton';

export class Game {
  static kibo: any;
  static canvas: Canvas;
	static currentLevel: any = null;
  static goodGuy: GoodGuy;
	static goodGuyFire: GoodGuyFire;
	static badGuyField: BadGuyField;
  static animationTimeoutId: number;
	static advanceBadGuysIntervalId: number;
	static endOfLevelIntervalId: number;
	static gameState: GameState;
	static functionToAnimate: any;
	static startButton: TextButton;
	static gameHeader: TextButton;
	static introText: TextButton;
	static exitButton: TextButton;
	static endOfLevelText: TextButton;
	static playAgainButton: TextButton;

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
				Game.levelInit();
				
				break;
				
				case GameState.NEW_LEVEL:

				// Here we set up a new level.
				console.log('NEW_LEVEL');
				
				Game.clearCanvas();
				Game.getNextLevel();
				Game.levelInit();
				
				break;
				
			case GameState.END_OF_LEVEL:
			
				// The goodGuy destroyed all the bad guys. This is a temporary state just to inform the player.
				// We'll shortly advance to the NEW_LEVEL game state.
				console.log('END_OF_LEVEL');
			
				// Remove remnants of any of the previous game states...
				clearInterval(Game.advanceBadGuysIntervalId);
				
				// Create appropriate canvas objects...
				Game.endOfLevelText = new TextButton(
					Game.canvas.ctx,
					["Next Level"],
					130, 
					205, 
					140, 
					35,
					"255,255,255",
					"20pt Arial",
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
				clearInterval(Game.advanceBadGuysIntervalId);
				clearInterval(Game.endOfLevelIntervalId);
				Game.goodGuy = null;
				
				// Create appropriate canvas objects. In this case, a "play again" button.
				Game.playAgainButton = new TextButton(
					Game.canvas.ctx,
					['Play again?'],
					120, 
					205, 
					160, 
					35,
					"255,255,255",
					"20pt Arial",
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

		if (Game.goodGuy) { Game.goodGuy.render(); }
		if (Game.goodGuyFire) { Game.goodGuyFire.render(); }
		if (Game.badGuyField) { Game.badGuyField.render(); }
		Game.exitButton.render();
		if (Game.endOfLevelText) { Game.endOfLevelText.render(); }
		if (Game.playAgainButton) { Game.playAgainButton.render(); }
  }

  static levelInit = function() {

		// This method creates the appropriate canvas objects. 
			
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
		
		Game.functionToAnimate = Game.levelRender;

		Game.animationLoop();
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
		}

		// Also, we cycle through all the different colour combinations we created, to add some variety.
		var colourComboCount = GAME_LEVEL_COLORS.length;
		Game.currentLevel.goodGuyColour = GAME_LEVEL_COLORS[Game.currentLevel.count%colourComboCount];
		Game.currentLevel.goodGuyFireColour = GAME_LEVEL_COLORS[Game.currentLevel.count%colourComboCount];
		Game.currentLevel.badGuyColour = GAME_LEVEL_COLORS[Game.currentLevel.count%colourComboCount];
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
		clearInterval(Game.advanceBadGuysIntervalId);
		clearInterval(Game.endOfLevelIntervalId);

		Game.gameState = null;

		Game.goodGuy = null;
		Game.goodGuyFire = null;
		Game.gameHeader = null;
		Game.introText = null;
		Game.startButton = null;
		Game.exitButton = null;
		Game.endOfLevelText = null;
		Game.playAgainButton = null;

		// These objects contain sub-objects. We need to recursively remove these sub-objects as well.
		if (Game.badGuyField) {
				Game.badGuyField.clearContents();
				Game.badGuyField = null;
		}
	}

  static eventSetup = function () {
    Game.kibo = new Kibo();
    Game.kibo.down(['left', 'right'], () => {

      if (Game.goodGuy) {
        const status: keyof typeof GoodGuyStatus = Game.kibo.lastKey().toUpperCase();
        Game.goodGuy.status = GoodGuyStatus[status];
      }
    }).up('any', function() {
      Game.goodGuy.status = GoodGuyStatus.STATIONARY;
    });
		Game.kibo.down('space', function () {

			// Fire a missile.
			if (!Game.goodGuyFire && Game.goodGuy) {
						Game.goodGuyFire = new GoodGuyFire(
							Game.canvas.ctx,
							Game.goodGuy.xPos,
							Game.goodGuy.yPos,
							Game.currentLevel.goodGuyFireSpeed,
							Game.currentLevel.goodGuyFireColour
						);
				}
		});
  }
}
