// Main entry point for the game
import { Game } from './game.js';
import { Customization } from './customization.js';
import { ScreenManager } from './screen-manager.js';

// Zoom/scroll prevention will be scoped to the canvas after DOM is ready

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');

    // Stabilize viewport height across iOS Safari chrome show/hide
    const setAppHeight = () => {
        const vhPx = Math.floor((window.visualViewport?.height || window.innerHeight));
        document.documentElement.style.setProperty('--app-height', `${vhPx}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', setAppHeight);
    }

    // Lock body scroll on iOS Safari to prevent rubber-banding/auto scroll
    const ua = navigator.userAgent || '';
    const isIOS = /iP(hone|ad|od)/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
    const isSafari = /Safari\//.test(ua) && !/CriOS|FxiOS|Chrome\//.test(ua);
    if (isIOS && isSafari) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.left = '0';
        document.body.style.top = '0';
        document.body.style.right = '0';
        document.body.style.bottom = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.height = 'var(--app-height)';
    }

    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Scope zoom/scroll prevention to the canvas only
    // Prevent gesture zoom on iOS/Safari
    canvas.addEventListener('gesturestart', (e) => e.preventDefault());
    canvas.addEventListener('gesturechange', (e) => e.preventDefault());
    canvas.addEventListener('gestureend', (e) => e.preventDefault());

    // Prevent ctrl/cmd + scroll zoom over the canvas
    canvas.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent keyboard zoom when canvas is focused
    canvas.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
            e.preventDefault();
        }
    });

    // Prevent double-tap zoom on touch when interacting with the canvas
    let lastTouchEndTs = 0;
    canvas.addEventListener('pointerup', (e) => {
        if (e.pointerType === 'touch') {
            const now = Date.now();
            if (now - lastTouchEndTs <= 300) {
                e.preventDefault();
            }
            lastTouchEndTs = now;
        }
    }, { passive: false });
    
    // Check if we should skip the initial screens
    if (ScreenManager.hasSettings() && Customization.loadCustomization().skipCustomization) {
        // Skip all screens and start game directly
        document.getElementById('tablesScreen').classList.add('hidden');
        document.getElementById('difficultyScreen').classList.add('hidden');
        document.getElementById('customizationScreen').classList.add('hidden');
        
        const savedCustomization = Customization.loadCustomization();
        const gameSettings = ScreenManager.getGameSettings();
        
        // If a previous game instance is still running (e.g. player restarted), stop its loop first
        if (window.game && typeof window.game.stop === 'function') {
            window.game.stop();
        }

        // Initialize the game with customization and settings data
        const game = new Game(canvas, {
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
        window.addEventListener('startGame', (e) => {
            const gameSettings = ScreenManager.getGameSettings();
            
            // Reset inventory for new game
            try {
                localStorage.removeItem('playerInventory');
                localStorage.removeItem('animalChallengeProgress');
            } catch (err) {
                console.warn('localStorage remove failed; storage unavailable:', err);
            }
            
            // Stop any previous game instance before creating a new one to avoid multiple game loops running
            if (window.game && typeof window.game.stop === 'function') {
                window.game.stop();
            }

            // Initialize the game with customization and settings data
            const game = new Game(canvas, {
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
            
            console.log('Cavia Avonturen Wereld is geladen!');
        });
    }
});