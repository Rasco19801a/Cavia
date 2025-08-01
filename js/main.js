// Main entry point - initializes the game
import { Game } from './game.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Initialize the game
    const game = new Game(canvas);
    
    // Make game instance available globally for debugging
    window.game = game;
    
    console.log('Cavia Avonturen Wereld is geladen!');
});