
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
export const GAME_LEVEL_BASE = {
	count: 1,
	goodGuySpeed: 3,
  goodGuyFireSpeed: 15,
	goodGuyColour: '255,0,0',
	goodGuyFireColour: '255,0,0',
  badGuyFireSpeed: 4,
	badGuyColour: '255,0,0',
	badGuyFireColour: '255,0,0',
	badGuyCoordinateList: [
		{ x: 100, y: 100 }, { x: 150, y: 100 }, { x: 200, y: 100 }, { x:250, y:100 }, { x:300, y:100 },
		{ x: 100, y: 150 }, { x: 150, y: 150 }, { x: 200, y: 150 }, { x:250, y:150 }, { x:300, y:150 },
		{ x: 100, y: 200 }, { x: 150, y: 200 }, { x: 200, y: 200 }, { x:250, y:200 }, { x:300, y:200 },
		{ x: 100, y: 250 }, { x: 150, y: 250 }, { x: 200, y: 250 }, { x:250, y:250 }, { x:300, y:250 },
		{ x: 100, y: 300 }, { x: 150, y: 300 }, { x: 200, y: 300 }, { x:250, y:300 }, { x:300, y:300 }
		],
  advanceBadGuysIntervalDuration: 2000,
  badGuyFireIntervalDuration: 2000,
}

// We cycle through these colors to provide some variety to the levels.
export const GAME_LEVEL_COLORS = ['255,85,170', '255,0,0', '0,170,255'];

// GoodGuyStatus contains all the possible good guy statuses.
export enum GoodGuyStatus {
  DESTROYED = -1,
  TRANSITION = 0,
  STATIONARY = 1,
  LEFT = 2,
  RIGHT = 3
}

// BadGuyStatus contains all the possible bad guy statuses.  
export enum BadGuyStatus {
  DESTROYED = -1,
  TRANSITION = 0,
  ALIVE = 1
}

// TextButtonStatus contains all the possible TextButton statuses.
export enum TextButtonStatus {
  NORMAL = 0,
  TRANSITION = 1,
  END_OF_TRANSITION = -1
}

// Canvas constants.
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 480;
export const CANVAS_BADGUY_LIMIT = 430;

