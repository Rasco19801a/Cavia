// Game configuration and constants

// World and canvas configuration
export const CONFIG = {
    WORLD_WIDTH: 2000,
    WORLD_HEIGHT: 1000,
    PLAYER_SPEED: 5,
    PLAYER_START_X: 400,
    PLAYER_START_Y: 500,
    CAMERA_OFFSET_X: 0,
    CAMERA_OFFSET_Y: 0
};

// UI and display constants
export const UI_CONFIG = {
    NOTIFICATION_DURATION: 3000,
    MODAL_Z_INDEX: 100,
    INVENTORY_SLOTS: 20,
    GRID_COLUMNS: 8,
    GRID_SPACING: 150,
    ITEM_SIZE: 80,
    HOVER_SCALE: 1.2,
    DRAG_THRESHOLD: 5
};

// Game mechanics constants
export const GAME_CONFIG = {
    CARROT_REWARD: 10,
    MISSION_REWARD: 10,
    SHOP_ITEM_PRICE_MULTIPLIER: 1,
    MAX_INVENTORY_ITEMS: 20,
    REORGANIZE_ANIMATION_DURATION: 500
};

// Drawing constants
export const DRAW_CONFIG = {
    GUINEA_PIG_BODY_WIDTH: 60,
    GUINEA_PIG_BODY_HEIGHT: 40,
    GUINEA_PIG_HEAD_RADIUS: 25,
    GUINEA_PIG_EAR_SIZE: 15,
    GUINEA_PIG_EYE_SIZE: 3,
    GUINEA_PIG_NOSE_SIZE: 3,
    SHADOW_OFFSET_Y: 5,
    SHADOW_BLUR: 10
};

// Underwater world constants
export const UNDERWATER_CONFIG = {
    PLAYER_START_Y: 300,
    MIN_Y: 50,
    MAX_Y_OFFSET: 100,
    FISH_COUNT: 10,
    BUBBLE_COUNT: 20,
    FISH_SIZE: 30,
    SHARK_SIZE: 40,
    BUBBLE_MIN_SIZE: 5,
    BUBBLE_MAX_SIZE: 15,
    COLLECT_DISTANCE: 40,
    CARROTS_TO_COLLECT: 10,
    SEAWEED_SPACING: 200,
    SEAWEED_HEIGHT: 150
};

// Animation constants
export const ANIMATION_CONFIG = {
    SWIM_PHASE_SPEED: 0.005,
    TAIL_WAVE_SPEED: 0.001,
    BUBBLE_SPEED: 0.001,
    WAVE_AMPLITUDE: 20,
    WAVE_FREQUENCY: 0.05
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
    '#8B4513',    // Brown
    '#2c2c2c',    // Dark gray
    '#D2B48C',    // Tan
    '#FFB6C1',    // Light pink
    '#FF69B4',    // Hot pink
    '#FFA500',    // Orange
    '#FFD700',    // Gold
    '#708090',    // Gray
    '#000000'     // Black
];

// Color part names
export const COLOR_PARTS = ['body', 'ears', 'belly', 'feet', 'nose'];

// World types
export const WORLDS = [
    'stad', 
    'natuur', 
    'strand', 
    'winter', 
    'woestijn', 
    'jungle', 
    'zwembad',
    'dierenstad',
    'paarden wei',
    'thuis'
];

// Default world
export const DEFAULT_WORLD = 'dierenstad';

// Shop categories
export const SHOP_CATEGORIES = {
    FOOD: 'food',
    ACCESSORIES: 'accessories',
    TOYS: 'toys',
    FURNITURE: 'furniture'
};

// Item types
export const ITEM_TYPES = {
    CARROT: 'carrot',
    LETTUCE: 'lettuce',
    BOW: 'bow',
    HAT: 'hat',
    GLASSES: 'glasses',
    BALL: 'ball',
    HOUSE: 'house',
    BED: 'bed',
    HAY: 'hay',
    APPLE: 'apple'
};