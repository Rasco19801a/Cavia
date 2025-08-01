// Game module - main game logic and state management
import { CONFIG, WORLDS } from './config.js';
import { Player } from './player.js';
import { Camera } from './camera.js';
import { UI } from './ui.js';
import { drawWorld } from './worlds.js';
import { createStadBuildings, createDierenstadBuildings, drawInterior } from './buildings.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize game components
        this.player = new Player();
        this.camera = new Camera(canvas);
        this.ui = new UI(this.player);
        
        // Game state
        this.currentWorld = WORLDS.STAD;
        this.buildings = [];
        this.isInside = false;
        this.currentBuilding = null;
        this.keys = {};
        
        // Setup world
        this.setupWorld();
        
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
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.handleClick({
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        });
        
        // World change event
        window.addEventListener('worldChange', (e) => {
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
            
            if (this.currentWorld === WORLDS.STAD || this.currentWorld === WORLDS.DIERENSTAD) {
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
            
            // If not clicked on building, move player
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
        this.currentWorld = world;
        this.player.x = CONFIG.PLAYER_START_X;
        this.player.y = CONFIG.PLAYER_START_Y;
        this.camera.x = 0;
        this.camera.y = 0;
        this.isInside = false;
        this.currentBuilding = null;
        this.setupWorld();
    }

    setupWorld() {
        this.buildings = [];
        
        switch (this.currentWorld) {
            case WORLDS.STAD:
                this.buildings = createStadBuildings();
                break;
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