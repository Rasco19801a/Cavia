// Game configuration and constants
export const CONFIG = {
    WORLD_WIDTH: 2000,
    WORLD_HEIGHT: 1000,
    PLAYER_SPEED: 5,
    PLAYER_START_X: 400,
    PLAYER_START_Y: 500,
    CAMERA_OFFSET_X: 0,
    CAMERA_OFFSET_Y: 0
};

// Default cavia colors
export const DEFAULT_CAVIA_COLORS = {
    body: 'white',
    ears: '#FFB6C1',
    belly: '#FFF5EE',
    feet: '#FFB6C1',
    nose: '#FF69B4',
    eyes: 'black'
};

// Available colors for customization
export const AVAILABLE_COLORS = [
    'white', 
    '#8B4513', 
    '#2c2c2c', 
    '#D2B48C', 
    '#FFB6C1', 
    '#FF69B4'
];

// Color part names
export const COLOR_PARTS = ['body', 'ears', 'belly', 'feet', 'nose'];

// World types
export const WORLDS = {
    STAD: 'stad',
    NATUUR: 'natuur',
    STRAND: 'strand',
    WINTER: 'winter',
    WOESTIJN: 'woestijn',
    JUNGLE: 'jungle',
    ZWEMBAD: 'zwembad',
    DIERENSTAD: 'dierenstad'
};

// Default world
export const DEFAULT_WORLD = WORLDS.DIERENSTAD;