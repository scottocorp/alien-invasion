import '../assets/style.css';
import { Kibo } from '../utilities/kibo';
import { Canvas } from './canvas';
import { GoodGuy, GoodGuyStatus } from './goodguy';
import { TextButton } from './textbutton';

// GameState contains all the possible game states.  
export enum GameState {
  SPLASH = 0,
  NEW_LEVEL = 1,
  END_OF_LEVEL = 2,
  END_OF_GAME = 3,
  PLAYER_DESTROYED = 4,
  LEVEL_RESUME = 5,
  NEW_GAME = 6
}

// The following object is used as a base to represent a game level. Each of the properties represents a game parameter.
const GAME_LEVEL_BASE = {
	count: 1,
	goodGuySpeed: 3,
	goodGuyColour: '255,0,0',
	badGuyColour: '255,0,0',
};

const GAME_LEVEL_COLORS = ['255,85,170', '255,0,0', '0,170,255'];

export class Game {
  static kibo: any;
  static canvas: Canvas;
	static currentLevel: any = null;
  static goodGuy: GoodGuy;
  static animationTimeoutId: number;
	static gameState: GameState;
	static functionToAnimate: any;
	static startButton: TextButton;
	static gameHeader: TextButton;
	static introText: TextButton;
	static exitButton: TextButton;

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
		// the following line of code clears the canvas...
		Game.canvas.element.width = Game.canvas.element.width;

    Game.goodGuy.render();
		Game.exitButton.render();
  }

  static levelInit = function() {

		Game.goodGuy = new GoodGuy(
			Game.canvas.ctx, 
			15,                                 /* goodGuy's horizontal range of movement - starting point */
			Game.canvas.element.width - 10,     /* goodGuy's horizontal range of movement - width */
			Game.canvas.element.height - 22,    /* y position of goodGuy */
			Game.currentLevel.goodGuySpeed,  		/* goodGuy Speed */	
			Game.currentLevel.goodGuyColour  		/* goodGuy Colour */
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
		
		Game.functionToAnimate = Game.levelRender;

		Game.animationLoop();
	}

	static getNextLevel = function() {	
		// Here we set up parameters for the current level. These parameters also determine the difficulty of the level. 
		
		if (!Game.currentLevel) {
			// We initialize currentLevel to the first level by cloning gameLevelBase.
			Game.currentLevel = JSON.parse(JSON.stringify(GAME_LEVEL_BASE))
		} else {			
			// But as the game progresses, the difficulty increases.

			Game.currentLevel.count++;
		}

		// Also, we cycle through all the different colour combinations we created, to add some variety.
		var colourComboCount = GAME_LEVEL_COLORS.length;
		Game.currentLevel.goodGuyColour = GAME_LEVEL_COLORS[Game.currentLevel.count%colourComboCount];
		Game.currentLevel.goodGuyFireColour = GAME_LEVEL_COLORS[Game.currentLevel.count%colourComboCount];
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

		Game.gameState = null;

		Game.goodGuy = null;
		Game.gameHeader = null;
		Game.introText = null;
		Game.startButton = null;
		Game.exitButton = null;
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
  }
}
