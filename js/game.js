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
import { Inventory } from './inventory.js';
import { Minigames } from './minigames.js';

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
        this.inventory = new Inventory(this);
        this.minigames = new Minigames(this);
        
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
            const designPanel = document.querySelector('.design-panel');
            
            if (worldSelector) {
                worldSelector.classList.remove('hidden');
                console.log('World selector shown');
            } else {
                console.error('World selector element not found!');
            }
            
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
            
            // R key to reorganize items in home world
            if (e.key === 'r' || e.key === 'R') {
                if (this.currentWorld === 'thuis' && this.homeInventory) {
                    this.homeInventory.reorganizeItems();
                    this.ui.showNotification('Items georganiseerd!');
                }
            }
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

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Check if inside a shop and clicking on a shop item
        if (this.isInside && this.currentBuilding && this.shop.isShopBuilding(this.currentBuilding.name)) {
            // Convert screen coordinates to world coordinates for shops
            const worldCoords = this.camera.screenToWorld(x, y);
            if (this.shop.handleClick(worldCoords.x, worldCoords.y)) {
                return; // Click was handled by shop
            }
        }
        
        // Check if clicking on exit
        if (this.isInside) {
            if (x >= 350 && x <= 450 && y >= 520 && y <= 570) {
                this.exitBuilding();
                return;
            }
        }
        
        // Debug logging
        console.log('Click detected at:', x, y);
        console.log('Is inside building:', this.isInside);
        console.log('Current world:', this.currentWorld);
        
        // Ensure canvas has focus
        this.canvas.focus();
        
        // Handle underwater world clicks
        if (this.underwaterWorld.active) {
            this.underwaterWorld.handleClick(x, y);
            return;
        }
        
        if (!this.isInside) {
            const worldCoords = this.camera.screenToWorld(x, y);
            
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
            if (y > 500) {
                // Exit building
                this.exitBuilding();
            } else {
                // Move inside building
                this.player.setTarget(x, y);
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
        // Special handling for swimming pool
        if (building.name === 'Zwembad') {
            // Check if player has badbehandeling
            if (this.shop.hasPurchased('bath')) {
                console.log('Player has badbehandeling - starting bath minigame');
                // Start bath minigame
                this.startBathMinigame();
                this.ui.showNotification('Tijd voor een ontspannend badje!');
            } else {
                console.log('Player needs badbehandeling to use the swimming pool');
                this.ui.showNotification('Je hebt badbehandeling nodig om te kunnen zwemmen! Koop het in de Cavia Spa.');
            }
            return;
        }
        
        // Always enter the building first
        this.isInside = true;
        this.currentBuilding = building;
        this.player.x = 400;
        this.player.y = 300;
        this.player.clearTarget();
        this.ui.showNotification(`Je bent nu in ${building.name}`);
        
        // Clear shop click areas when entering a building
        this.shop.clearClickAreas();
    }
    
    exitBuilding() {
        this.isInside = false;
        this.player.x = this.currentBuilding.x + this.currentBuilding.w / 2;
        this.player.y = this.currentBuilding.y + this.currentBuilding.h + 50;
        this.currentBuilding = null;
        this.player.clearTarget();
        
        // Clear shop click areas when exiting
        this.shop.clearClickAreas();
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
            case 'thuis':
                // Reorganize items when entering home world to prevent overlapping
                if (this.homeInventory) {
                    this.homeInventory.reorganizeItems();
                }
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
        this.camera.update(this.player, this.isInside, this.currentBuilding);
        
        // Update home inventory if in home world
        if (this.currentWorld === 'thuis') {
            this.homeInventory.update();
        }
    }

    startPuzzleMinigame() {
        this.minigames.startPuzzleMinigame();
    }
    
    startCatchMinigame() {
        this.minigames.startCatchMinigame();
    }
    
    startStackMinigame() {
        this.minigames.startStackMinigame();
    }
    
    startBathMinigame() {
        this.minigames.startBathMinigame();
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
            this.ctx.save();
            
            // Apply camera transform for shops
            const shopBuildings = ['Speelgoedwinkel', 'Groente Markt', 'Hooi Winkel', 'Speeltjes & Meer', 'Cavia Spa', 'Accessoires'];
            const isShop = this.currentBuilding && shopBuildings.includes(this.currentBuilding.name);
            if (isShop) {
                this.camera.applyTransform(this.ctx);
            }
            
            drawInterior(this.ctx, this.currentBuilding);
            this.player.draw(this.ctx);
            
            this.ctx.restore();
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}