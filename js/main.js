// Main entry point for the game
import { Game } from './game.js';
import { Customization } from './customization.js';
import { ScreenManager } from './screen-manager.js';
import { initThreeScene, startThreeScene, stopThreeScene, onResize as resizeThree } from './three-scene.js';

// Prevent zooming on the entire document
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
});

document.addEventListener('gestureend', function(e) {
    e.preventDefault();
});

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent pinch zoom
document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent ctrl/cmd + scroll zoom
document.addEventListener('wheel', function(e) {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent keyboard zoom shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
    }
});

let game = null;
let threeEnabled = false;
let threeInitialized = false;

async function setThreeEnabled(enabled) {
    const threeCanvas = document.getElementById('threeCanvas');
    if (!threeCanvas) return;

    if (enabled) {
        threeCanvas.classList.remove('hidden');
        if (!threeInitialized) {
            await initThreeScene(threeCanvas);
            threeInitialized = true;
        }
        startThreeScene();
        resizeThree();
    } else {
        threeCanvas.classList.add('hidden');
        stopThreeScene();
    }
    threeEnabled = enabled;
}

function setupThreeToggle() {
    const btn = document.getElementById('toggle3DBtn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        await setThreeEnabled(!threeEnabled);
    });
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    const canvas = document.getElementById('gameCanvas');
    const threeCanvas = document.getElementById('threeCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Match 3D canvas size to container
    function syncCanvasSizes() {
        if (!canvas || !threeCanvas) return;
        // Ensure canvases fill the viewport (CSS handles size visually)
        // Set actual drawing buffer to client size
        const setSize = (c) => {
            const { clientWidth, clientHeight } = c;
            if (clientWidth && clientHeight) {
                if (c.width !== clientWidth) c.width = clientWidth;
                if (c.height !== clientHeight) c.height = clientHeight;
            }
        };
        setSize(canvas);
        setSize(threeCanvas);
        resizeThree();
    }

    window.addEventListener('resize', syncCanvasSizes);

    setupThreeToggle();
    syncCanvasSizes();
    
    // Check if we should skip the initial screens
    if (ScreenManager.hasSettings() && Customization.loadCustomization().skipCustomization) {
        // Skip all screens and start game directly
        document.getElementById('tablesScreen').classList.add('hidden');
        document.getElementById('difficultyScreen').classList.add('hidden');
        document.getElementById('customizationScreen').classList.add('hidden');
        
        const savedCustomization = Customization.loadCustomization();
        const gameSettings = ScreenManager.getGameSettings();
        
        // Initialize the game with customization and settings data
        game = new Game(canvas, {
            ...savedCustomization,
            ...gameSettings
        });
        
        // Make game instance available globally for debugging
        window.game = game;
        
        // Add debug function
        window.testInventory = () => {
            if (game.inventory) {
                console.log('Testing inventory open...');
                game.inventory.openInventory();
            } else {
                console.log('Inventory not found!');
            }
        };
        
        console.log('Cavia Avonturen Wereld is geladen!');
    } else {
        // Initialize screen manager for the selection screens
        const screenManager = new ScreenManager();
        
        // Initialize customization screen
        const customization = new Customization();
        
        // Wait for customization to complete
        window.addEventListener('startGame', async (e) => {
            const gameSettings = ScreenManager.getGameSettings();
            
            // Reset inventory for new game
            localStorage.removeItem('playerInventory');
            localStorage.removeItem('animalChallengeProgress');
            
            // Initialize the game with customization and settings data
            game = new Game(canvas, {
                ...e.detail,
                ...gameSettings
            });
            
            // Make game instance available globally for debugging
            window.game = game;
            
            // Add debug function
            window.testInventory = () => {
                if (game.inventory) {
                    console.log('Testing inventory open...');
                    game.inventory.openInventory();
                } else {
                    console.log('Inventory not found!');
                }
            };

            // Optionally start 3D when game starts
            await setThreeEnabled(false);
            syncCanvasSizes();
            
            console.log('Cavia Avonturen Wereld is geladen!');
        });
    }
});