
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
	goodGuyColour: '255,0,0',
	badGuyColour: '255,0,0',
};

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

