// Game module - main game logic and state management
import { CONFIG, WORLDS, DEFAULT_WORLD } from './config.js';
import { Player } from './player.js';
import { Camera } from './camera.js';
import { UI } from './ui.js';
import { drawWorld } from './worlds.js';
import { createDierenstadBuildings, createZwembadBuildings, drawInterior } from './buildings.js';
import { AnimalChallenge, drawAnimals, checkAnimalClick } from './animals.js';
import { Shop } from './shop.js';
import { HomeInventory } from './home-inventory.js';
import { UnderwaterWorld } from './underwater-world.js';

export class Game {
    constructor(canvas, customization = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Make canvas focusable and give it initial focus
        this.canvas.tabIndex = 1;
        this.canvas.focus();
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize game components with customization
        this.player = new Player(customization);
        this.camera = new Camera(canvas);
        this.ui = new UI(this.player);
        this.animalChallenge = new AnimalChallenge(this);
        this.shop = new Shop(this);
        this.homeInventory = new HomeInventory(this);
        this.underwaterWorld = new UnderwaterWorld(this);
        
        // Game state
        this.currentWorld = DEFAULT_WORLD;
        this.buildings = [];
        this.isInside = false;
        this.currentBuilding = null;
        this.keys = {};
        
        // Drag state
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        
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
        
        // Mouse/Touch controls
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // Touch controls - handle touchend as click for better mobile support
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                const rect = this.canvas.getBoundingClientRect();
                const clickEvent = new MouseEvent('click', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                this.handleClick(clickEvent);
            }
        });
        
        // Drag and drop events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Touch drag events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseDown(mouseEvent);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseMove(mouseEvent);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.handleMouseUp(mouseEvent);
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
        
        // Debug logging
        console.log('Click detected at:', screenX, screenY);
        console.log('Is inside building:', this.isInside);
        console.log('Current world:', this.currentWorld);
        
        // Ensure canvas has focus
        this.canvas.focus();
        
        // Handle underwater world clicks
        if (this.underwaterWorld.active) {
            this.underwaterWorld.handleClick(screenX, screenY);
            return;
        }
        
        if (!this.isInside) {
            const worldCoords = this.camera.screenToWorld(screenX, screenY);
            
            // Check if in home world and clicked on home inventory items
            if (this.currentWorld === 'thuis') {
                if (this.homeInventory.handleClick(worldCoords.x, worldCoords.y)) {
                    return; // Click was handled by home inventory
                }
            }
            
            // Check if clicked on a building
            let clickedBuilding = false;
            
            if (this.currentWorld === 'dierenstad') {
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
    
    handleMouseDown(e) {
        if (this.currentWorld !== 'thuis' || this.isInside) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const worldCoords = this.camera.screenToWorld(screenX, screenY);
        
        if (this.homeInventory.handleDragStart(worldCoords.x, worldCoords.y)) {
            this.isDragging = true;
            this.dragStartX = worldCoords.x;
            this.dragStartY = worldCoords.y;
        }
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const worldCoords = this.camera.screenToWorld(screenX, screenY);
        
        this.homeInventory.handleDragMove(worldCoords.x, worldCoords.y);
    }
    
    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const worldCoords = this.camera.screenToWorld(screenX, screenY);
        
        this.homeInventory.handleDragEnd(worldCoords.x, worldCoords.y);
        this.isDragging = false;
    }
    
    enterBuilding(building) {
        // Check if this is the water pool in the swimming pool world
        if (building.isWaterPool) {
            // Enter underwater mini-game instead of building
            this.underwaterWorld.enter();
            this.ui.showNotification('Duik in het water! Verzamel alle wortels!');
            return;
        }
        
        // Always enter the building first
        this.isInside = true;
        this.currentBuilding = building;
        this.player.x = 400;
        this.player.y = 300;
        this.player.clearTarget();
        this.ui.showNotification(`Je bent nu in ${building.name}`);
        
        // Check if building is a shop and show shop button inside
        const shopBuildings = ['Speelgoedwinkel', 'Groente Markt', 'Hooi Winkel', 
                             'Speeltjes & Meer', 'Cavia Spa', 'Accessoires'];
        
        if (shopBuildings.includes(building.name)) {
            // Show a shop button inside the building
            this.showShopButton(building.name);
        }
    }
    
    showShopButton(shopName) {
        // Create shop button if it doesn't exist
        if (!this.shopButton) {
            this.shopButton = document.createElement('button');
            this.shopButton.className = 'shop-button-inside';
            this.shopButton.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px 40px;
                font-size: 24px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                z-index: 1000;
                font-family: 'Nunito', sans-serif;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;
            document.body.appendChild(this.shopButton);
        }
        
        this.shopButton.textContent = `🛒 Open ${shopName}`;
        this.shopButton.style.display = 'block';
        
        // Remove any existing click listeners
        this.shopButton.replaceWith(this.shopButton.cloneNode(true));
        this.shopButton = document.querySelector('.shop-button-inside');
        
        this.shopButton.addEventListener('click', () => {
            this.shop.openShop(shopName);
            this.shopButton.style.display = 'none';
        });
    }
    
    hideShopButton() {
        if (this.shopButton) {
            this.shopButton.style.display = 'none';
        }
    }

    exitBuilding() {
        this.isInside = false;
        this.player.x = this.currentBuilding.x + this.currentBuilding.w / 2;
        this.player.y = this.currentBuilding.y + this.currentBuilding.h + 50;
        this.currentBuilding = null;
        this.player.clearTarget();
        this.hideShopButton(); // Hide shop button when exiting
    }

    changeWorld(world) {
        console.log(`changeWorld called with: ${world}`);
        console.log(`Current world before change: ${this.currentWorld}`);
        
        // Validate world parameter
        if (!WORLDS.includes(world)) {
            console.error(`Invalid world: ${world}. Valid worlds are:`, WORLDS);
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
        this.hideShopButton(); // Hide shop button when changing worlds
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
            'dierenstad': 'de Dierenstad',
            'thuis': 'Thuis'
        };
        return names[world] || world;
    }

    setupWorld() {
        this.buildings = [];
        
        switch (this.currentWorld) {
            case 'dierenstad':
                this.buildings = createDierenstadBuildings();
                break;
            case 'zwembad':
                this.buildings = createZwembadBuildings();
                break;
        }
    }

    update() {
        // Update underwater world if active
        if (this.underwaterWorld.active) {
            this.underwaterWorld.update();
            return;
        }
        
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
        
        // Draw underwater world if active
        if (this.underwaterWorld.active) {
            this.underwaterWorld.draw(this.ctx);
            return;
        }
        
        if (!this.isInside) {
            // Draw world
            this.ctx.save();
            this.camera.applyTransform(this.ctx);
            
            drawWorld(this.ctx, this.currentWorld, this.buildings);
            
            // Draw home inventory items in home world
            if (this.currentWorld === 'thuis') {
                this.homeInventory.draw(this.ctx);
            }
            
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