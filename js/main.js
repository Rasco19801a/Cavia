// Main entry point - initializes the game
import { Game } from './game.js';
import { Customization } from './customization.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Initialize customization screen
    const customization = new Customization();
    
    // Wait for customization to complete
    window.addEventListener('startGame', (e) => {
        // Initialize the game with customization data
        const game = new Game(canvas, e.detail);
        
        // Make game instance available globally for debugging
        window.game = game;
        
        console.log('Cavia Avonturen Wereld is geladen!');
    });
});