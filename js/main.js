// Main entry point for the game
import { Game } from './game.js';
import { initThreeScene, startThreeScene, stopThreeScene, onResize as resizeThree } from './three-scene.js';
import { initThreeGame, renderThreeGame, onResize as resizeThreeGame, disposeThreeGame } from './three-game.js';

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
let threeEnabled = false; // simple 3D layer (demo cube)
let threeGameEnabled = false; // full 3D conversion mode
let threeInitialized = false;
let threeGameInitialized = false;

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

async function setThreeGameEnabled(enabled) {
    const threeCanvas = document.getElementById('threeCanvas');
    if (!threeCanvas) return;

    if (enabled) {
        threeCanvas.classList.remove('hidden');
        if (!threeGameInitialized) {
            await initThreeGame(threeCanvas, game);
            threeGameInitialized = true;
        }
        // Stop demo cube if running
        if (threeEnabled) await setThreeEnabled(false);
        // Hook render loop
        if (!window.__threeGameRAF) {
            const frame = () => {
                if (threeGameEnabled) {
                    renderThreeGame(game);
                    window.__threeGameRAF = requestAnimationFrame(frame);
                } else {
                    window.__threeGameRAF = null;
                }
            };
            window.__threeGameRAF = requestAnimationFrame(frame);
        }
        resizeThreeGame();
    } else {
        if (window.__threeGameRAF) {
            cancelAnimationFrame(window.__threeGameRAF);
            window.__threeGameRAF = null;
        }
        disposeThreeGame();
        threeGameInitialized = false;
        // Hide canvas when fully disabling 3D game mode
        threeCanvas.classList.add('hidden');
    }
    threeGameEnabled = enabled;
}

function setupThreeToggle() {
    const btn = document.getElementById('toggle3DBtn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        // Toggle full 3D mode
        await setThreeGameEnabled(!threeGameEnabled);
        window.__THREE_GAME_MODE__ = threeGameEnabled;
    });
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
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
        resizeThreeGame();
    }

    window.addEventListener('resize', syncCanvasSizes);

    setupThreeToggle();
    syncCanvasSizes();
    
    // Reset inventory and progress for a fresh start
    localStorage.removeItem('playerInventory');
    localStorage.removeItem('animalChallengeProgress');

    // Start the game immediately with defaults
    game = new Game(canvas, {});

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

    // Start with 3D off by default, user can toggle
    await setThreeGameEnabled(false);
    window.__THREE_GAME_MODE__ = false;
    syncCanvasSizes();

    // Auto-enable full 3D mode by default
    await setThreeGameEnabled(true);
    window.__THREE_GAME_MODE__ = true;
    console.log('Cavia Avonturen Wereld is geladen!');
});