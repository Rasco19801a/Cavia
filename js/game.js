// Game module - main game logic and state management
import { CONFIG, WORLDS, DEFAULT_WORLD } from './config.js';
import { Player } from './player.js';
import { Camera } from './camera.js';
import { UI } from './ui.js';
import { drawWorld } from './worlds.js';
import { createDierenstadBuildings, drawInterior } from './buildings.js';
import { AnimalChallenge, drawAnimals, checkAnimalClick } from './animals.js';

export class Game {
    constructor(canvas, customization = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize game components with customization
        this.player = new Player(customization);
        this.camera = new Camera(canvas);
        this.ui = new UI(this.player);
        this.animalChallenge = new AnimalChallenge(this);
        
        // Game state
        this.currentWorld = DEFAULT_WORLD;
        this.buildings = [];
        this.isInside = false;
        this.currentBuilding = null;
        this.keys = {};
        
        // Setup world
        this.setupWorld();
        
        // Show UI panels with a small delay to ensure DOM is ready
        setTimeout(() => {
            const worldSelector = document.getElementById('worldSelector');
            const controls = document.querySelector('.controls');
            const designPanel = document.querySelector('.design-panel');
            
            if (worldSelector) {
                worldSelector.classList.remove('hidden');
                console.log('World selector shown');
            } else {
                console.error('World selector element not found!');
            }
            
            if (controls) controls.classList.remove('hidden');
            if (designPanel) designPanel.classList.remove('hidden');
        }, 50);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.gameLoop();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mouse/touch controls
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleClick({
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        });
        
        // Also handle touchend for better mobile experience
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
        
        // World change event
        window.addEventListener('worldChange', (e) => {
            console.log('worldChange event received in game.js:', e.detail);
            this.changeWorld(e.detail.world);
        });
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        
        if (!this.isInside) {
            const worldCoords = this.camera.screenToWorld(screenX, screenY);
            
            // Check if clicked on a building
            let clickedBuilding = false;
            
            if (this.currentWorld === WORLDS.DIERENSTAD) {
                for (const building of this.buildings) {
                    if (building.contains && building.contains(worldCoords.x, worldCoords.y)) {
                        // Enter building
                        this.enterBuilding(building);
                        clickedBuilding = true;
                        break;
                    } else if (!building.contains && 
                               worldCoords.x >= building.x && 
                               worldCoords.x <= building.x + building.w &&
                               worldCoords.y >= building.y && 
                               worldCoords.y <= building.y + building.h) {
                        // For buildings without contains method
                        this.enterBuilding(building);
                        clickedBuilding = true;
                        break;
                    }
                }
            }
            
            // Check if clicked on an animal
            if (!clickedBuilding) {
                const clickedAnimal = checkAnimalClick(this.currentWorld, worldCoords.x, worldCoords.y);
                if (clickedAnimal) {
                    // Show challenge modal
                    this.animalChallenge.showChallenge(clickedAnimal);
                    clickedBuilding = true; // Prevent player movement
                }
            }
            
            // If not clicked on building or animal, move player
            if (!clickedBuilding) {
                this.player.setTarget(worldCoords.x, worldCoords.y);
            }
        } else {
            // Inside building
            if (screenY > 500) {
                // Exit building
                this.exitBuilding();
            } else {
                // Move inside building
                this.player.setTarget(screenX, screenY);
            }
        }
    }

    enterBuilding(building) {
        this.isInside = true;
        this.currentBuilding = building;
        this.player.x = 400;
        this.player.y = 300;
        this.player.clearTarget();
        this.ui.showNotification(`Je bent nu in ${building.name}`);
    }

    exitBuilding() {
        this.isInside = false;
        this.player.x = this.currentBuilding.x + this.currentBuilding.w / 2;
        this.player.y = this.currentBuilding.y + this.currentBuilding.h + 50;
        this.currentBuilding = null;
        this.player.clearTarget();
    }

    changeWorld(world) {
        console.log(`changeWorld called with: ${world}`);
        console.log(`Current world before change: ${this.currentWorld}`);
        
        // Validate world parameter
        const validWorlds = Object.values(WORLDS);
        if (!validWorlds.includes(world)) {
            console.error(`Invalid world: ${world}. Valid worlds are:`, validWorlds);
            return;
        }
        
        // Don't change if it's the same world
        if (this.currentWorld === world) {
            console.log('Already in this world, no change needed');
            return;
        }
        
        this.currentWorld = world;
        this.player.x = CONFIG.PLAYER_START_X;
        this.player.y = CONFIG.PLAYER_START_Y;
        this.player.clearTarget(); // Clear any movement target
        this.camera.x = 0;
        this.camera.y = 0;
        this.isInside = false;
        this.currentBuilding = null;
        this.setupWorld();
        console.log(`World changed successfully to: ${this.currentWorld}`);
        
        // Force multiple redraws to ensure the change is visible
        this.draw();
        setTimeout(() => this.draw(), 10);
        setTimeout(() => this.draw(), 50);
        
        // Show a notification
        if (this.ui && this.ui.showNotification) {
            this.ui.showNotification(`Welkom in ${this.getWorldName(world)}!`);
        }
    }
    
    getWorldName(world) {
        const names = {
            'natuur': 'de Natuur',
            'strand': 'het Strand',
            'winter': 'de Winter',
            'woestijn': 'de Woestijn',
            'jungle': 'de Jungle',
            'zwembad': 'het Zwembad',
            'dierenstad': 'de Dierenstad'
        };
        return names[world] || world;
    }

    setupWorld() {
        this.buildings = [];
        
        switch (this.currentWorld) {
            case WORLDS.DIERENSTAD:
                this.buildings = createDierenstadBuildings();
                break;
        }
    }

    update() {
        // Player movement
        this.player.moveToTarget();
        this.player.moveWithKeys(this.keys);
        
        // Apply boundaries
        if (!this.isInside) {
            this.player.constrainToBounds(30, CONFIG.WORLD_WIDTH - 30, 30, CONFIG.WORLD_HEIGHT - 30);
        } else {
            this.player.constrainToBounds(30, 770, 30, 570);
        }
        
        // Update camera
        this.camera.update(this.player, this.isInside);
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.isInside) {
            // Draw world
            this.ctx.save();
            this.camera.applyTransform(this.ctx);
            
            drawWorld(this.ctx, this.currentWorld, this.buildings);
            
            // Draw animals
            drawAnimals(this.ctx, this.currentWorld, this.camera.x, this.camera.y);
            
            // Draw click target
            if (this.player.targetX !== null && this.player.targetY !== null) {
                this.ctx.strokeStyle = '#FF69B4';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(this.player.targetX, this.player.targetY, 20, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            // Draw player
            this.player.draw(this.ctx);
            
            this.ctx.restore();
        } else {
            // Draw interior
            drawInterior(this.ctx, this.currentBuilding);
            this.player.draw(this.ctx);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}