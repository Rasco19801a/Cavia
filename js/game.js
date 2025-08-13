// Game module - main game logic and state management
import { CONFIG, WORLDS, DEFAULT_WORLD } from './config.js';
import { Player } from './player.js';
import { Camera } from './camera.js';
import { UI } from './ui.js';
import { drawWorld, clearBackgroundCache } from './worlds.js';
import { createDierenstadBuildings, createZwembadBuildings, createThuisBuildings, drawInterior } from './buildings.js';
import { AnimalChallenge, drawAnimals, checkAnimalClick } from './animals.js';
import { Shop } from './shop.js';
import { HomeInventory } from './home-inventory.js';
import { UnderwaterWorld } from './underwater-world.js';
import { Inventory } from './inventory.js';
import { Minigames } from './minigames.js';
import { createLogger, errorHandler, performanceMonitor } from './logger.js';
import { eventSystem, GameEvents } from './event-system.js';

export class Game {
    constructor(canvas, customization = {}) {
        this.logger = createLogger('Game');
        this.logger.info('Initializing game', customization);
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Store game settings
        this.selectedTables = customization.selectedTables || [1, 2, 3, 4, 5];
        this.selectedDifficulties = customization.selectedDifficulties || [6, 7];
        
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
        
        // Mouse position for hover effects
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Expose game instance globally for debugging and integration
        
        // Setup world
        this.setupWorld();
        
        // Show UI panels with a small delay to ensure DOM is ready
        setTimeout(() => {
            errorHandler.tryCatch(() => {
                const worldSelector = document.getElementById('worldSelector');
                const designPanel = document.querySelector('.design-panel');
                
                if (worldSelector) {
                    worldSelector.classList.remove('hidden');
                    this.logger.debug('World selector shown');
                } else {
                    this.logger.warn('World selector element not found');
                }
                
                if (designPanel) {
                    designPanel.classList.remove('hidden');
                    this.logger.debug('Design panel shown');
                }
            });
        }, 50);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.gameLoop();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Clear background cache when canvas is resized
        clearBackgroundCache();
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
        
        // Click for interactions
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        // Unified pointer events for drag/drop and movement
        this.canvas.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'touch') e.preventDefault();
            this.handleMouseDown(e);
        }, { passive: false });

        this.canvas.addEventListener('pointermove', (e) => {
            this.handleMouseMove(e);
        });

        this.canvas.addEventListener('pointerup', (e) => {
            this.handleMouseUp(e);
        });

        this.canvas.addEventListener('pointercancel', () => {
            this.isDragging = false;
        });
        
        // World change event using event system
        eventSystem.on(GameEvents.WORLD_CHANGE, (world) => {
            this.logger.info('World change requested', { world });
            this.changeWorld(world);
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
            // Check if in a shop
            const shopBuildings = ['Speelgoedwinkel', 'Groente Markt', 'Hooi Winkel', 'Speeltjes & Meer', 'Cavia Spa', 'Accessoires'];
            const isShop = this.currentBuilding && shopBuildings.includes(this.currentBuilding.name);
            
            if (isShop) {
                // For shops, check exit button in world coordinates
                const worldCoords = this.camera.screenToWorld(x, y);
                // Exit button is at WORLD_WIDTH/2 (1000) with width 100
                if (worldCoords.x >= CONFIG.WORLD_WIDTH / 2 - 50 && 
                    worldCoords.x <= CONFIG.WORLD_WIDTH / 2 + 50 && 
                    worldCoords.y >= 520 && worldCoords.y <= 570) {
                    this.exitBuilding();
                    return;
                }
            } else {
                // For other buildings, use screen coordinates
                if (x >= 350 && x <= 450 && y >= 520 && y <= 570) {
                    this.exitBuilding();
                    return;
                }
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
            
            // Check if in swimming pool world and clicked on water bath button
            if (this.currentWorld === 'zwembad' && this.waterBathButton) {
                if (worldCoords.x >= this.waterBathButton.x && 
                    worldCoords.x <= this.waterBathButton.x + this.waterBathButton.width &&
                    worldCoords.y >= this.waterBathButton.y && 
                    worldCoords.y <= this.waterBathButton.y + this.waterBathButton.height) {
                    // Start bath minigame
                    this.startBathMinigame();
                    return;
                }
            }
            
            // Check if in desert world and clicked on cave area
            if (this.currentWorld === 'woestijn') {
                const caveX = 1700;
                const caveY = 500;
                const caveWidth = 150;
                const caveHeight = 120;
                
                // Check if clicked on cave
                if (worldCoords.x >= caveX && 
                    worldCoords.x <= caveX + caveWidth &&
                    worldCoords.y >= caveY && 
                    worldCoords.y <= caveY + caveHeight) {
                    
                    if (!this.shop.hasPurchased('tunnel')) {
                        // Show notification that tunnel is needed
                        this.ui.showNotification('Je hebt een speeltunnel nodig om het doolhof te spelen! Koop het in de Cavia Shop.');
                        return;
                    }
                }
                
                // Check if clicked on play button (under cave)
                if (this.shop.hasPurchased('tunnel')) {
                    const playButtonX = 1725; // Cave is at x=1700, centered under it
                    const playButtonY = 620;  // Below the cave
                    const playButtonWidth = 100;
                    const playButtonHeight = 40;
                    
                    if (worldCoords.x >= playButtonX && 
                        worldCoords.x <= playButtonX + playButtonWidth &&
                        worldCoords.y >= playButtonY && 
                        worldCoords.y <= playButtonY + playButtonHeight) {
                        // Start maze minigame
                        this.minigames.startMazeMinigame();
                        return;
                    }
                }
            }
            
            // Check if clicked on a building
            let clickedBuilding = false;
            
            // Only check for building clicks in dierenstad (not in thuis/home world)
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
            // Skip the y > 500 check since we already handle exit button above
            {
                // Check if in a shop (shops use world coordinates)
                const shopBuildings = ['Speelgoedwinkel', 'Groente Markt', 'Hooi Winkel', 'Speeltjes & Meer', 'Cavia Spa', 'Accessoires'];
                const isShop = this.currentBuilding && shopBuildings.includes(this.currentBuilding.name);
                
                if (isShop) {
                    // Convert screen coordinates to world coordinates for shops
                    const worldCoords = this.camera.screenToWorld(x, y);
                    this.player.setTarget(worldCoords.x, worldCoords.y);
                } else {
                    // Other buildings use screen coordinates
                    this.player.setTarget(x, y);
                }
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
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const worldCoords = this.camera.screenToWorld(screenX, screenY);
        
        // Store mouse position for hover effects
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Check if hovering over water bath button
        if (this.currentWorld === 'zwembad' && this.waterBathButton && !this.isInside) {
            if (worldCoords.x >= this.waterBathButton.x && 
                worldCoords.x <= this.waterBathButton.x + this.waterBathButton.width &&
                worldCoords.y >= this.waterBathButton.y && 
                worldCoords.y <= this.waterBathButton.y + this.waterBathButton.height) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }
        
        if (!this.isDragging) return;
        
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
        
        // Normalize common synonyms (e.g., 'home' -> 'thuis')
        const normalizedWorld = this.normalizeWorldName(world);
        
        // Validate world parameter
        if (!WORLDS.includes(normalizedWorld)) {
            console.error(`Invalid world: ${normalizedWorld}. Valid worlds are:`, WORLDS);
            return;
        }
        
        // Don't change if it's the same world
        if (this.currentWorld === normalizedWorld) {
            console.log('Already in this world, no change needed');
            return;
        }
        
        this.currentWorld = normalizedWorld;
        this.player.x = CONFIG.PLAYER_START_X;
        this.player.y = CONFIG.PLAYER_START_Y;
        this.player.clearTarget(); // Clear any movement target
        this.camera.x = 0;
        this.camera.y = 0;
        this.isInside = false;
        this.currentBuilding = null;
        this.isDragging = false; // reset home drag state
        this.waterBathButton = null; // clear any cached button from zwembad
        if (this.canvas) this.canvas.style.cursor = 'default';
        
        // Proactively close any open overlays that could block input
        try { if (this.inventory && this.inventory.isOpen) this.inventory.closeInventory(); } catch (e) { /* noop */ }
        try { if (this.guineaPigMissions && this.guineaPigMissions.missionManager && this.guineaPigMissions.missionManager.isMissionModalVisible && this.guineaPigMissions.missionManager.isMissionModalVisible()) { this.guineaPigMissions.missionManager.closeModal(); } } catch (e) { /* noop */ }
        try { if (this.animalChallenge && this.animalChallenge.challengeModal && !this.animalChallenge.challengeModal.classList.contains('hidden')) { this.animalChallenge.closeChallenge(); } } catch (e) { /* noop */ }
        try { if (this.minigames && this.minigames.activeMinigame) this.minigames.closeMinigame(); } catch (e) { /* noop */ }
        
        this.setupWorld();
        console.log(`World changed successfully to: ${this.currentWorld}`);
        
        // Force multiple redraws to ensure the change is visible
        this.draw();
        setTimeout(() => this.draw(), 10);
        setTimeout(() => this.draw(), 50);
        
        // Show a notification
        if (this.ui && this.ui.showNotification) {
            this.ui.showNotification(`Welkom in ${this.getWorldName(this.currentWorld)}!`);
        }
    }
    
    getWorldName(world) {
        const names = {
            'stad': 'de Stad',
            'natuur': 'de Natuur',
            'strand': 'het Strand',
            'winter': 'de Winter',
            'woestijn': 'de Woestijn',
            'jungle': 'de Jungle',
            'zwembad': 'het Zwembad',
            'dierenstad': 'de Dierenstad',
            'paarden': 'de Paarden Wereld',
            'thuis': 'Thuis'
        };
        return names[world] || world;
    }

    setupWorld() {
        this.logger.debug('Setting up world', { world: this.currentWorld });
        this.buildings = [];
        
        switch (this.currentWorld) {
            case 'dierenstad':
                this.buildings = createDierenstadBuildings();
                break;
            case 'zwembad':
                this.buildings = createZwembadBuildings();
                break;
            case 'thuis':
                // Create home buildings for consistent structure
                this.buildings = createThuisBuildings();
                // Reorganize items when entering home world to prevent overlapping
                if (this.homeInventory) {
                    this.homeInventory.reorganizeItems();
                }
                break;
        }
        
        eventSystem.emit(GameEvents.WORLD_LOADED, this.currentWorld);
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
            // Check if in a shop (shops use world coordinates)
            const shopBuildings = ['Speelgoedwinkel', 'Groente Markt', 'Hooi Winkel', 'Speeltjes & Meer', 'Cavia Spa', 'Accessoires'];
            const isShop = this.currentBuilding && shopBuildings.includes(this.currentBuilding.name);
            
            if (isShop) {
                // Shops use world coordinates like outside
                this.player.constrainToBounds(30, CONFIG.WORLD_WIDTH - 30, 30, CONFIG.WORLD_HEIGHT - 30);
            } else {
                // Other buildings use screen coordinates
                this.player.constrainToBounds(30, 770, 30, 570);
            }
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
        performanceMonitor.startTimer('frame');
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw underwater world if active
        if (this.underwaterWorld.active) {
            this.underwaterWorld.draw(this.ctx);
            performanceMonitor.endTimer('frame');
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
            this.player.draw(this.ctx, 0.5, 1);
            
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
            
            // Draw click target indicator for shops
            if (isShop && this.player.targetX !== null && this.player.targetY !== null) {
                this.ctx.strokeStyle = '#FF69B4';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(this.player.targetX, this.player.targetY, 20, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            this.player.draw(this.ctx, 0.5, 1);
            
            this.ctx.restore();
        }
        
        performanceMonitor.endTimer('frame');
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    // Backward compatibility: older code calls switchWorld('home'), render(), etc.
    normalizeWorldName(world) {
        if (!world) return world;
        const map = {
            home: 'thuis',
            huis: 'thuis',
            city: 'dierenstad',
            stad: 'stad',
            horses: 'paarden',
            horse: 'paarden',
            desert: 'woestijn',
            jungle: 'jungle',
            beach: 'strand',
            winter: 'winter',
            pool: 'zwembad'
        };
        const lower = String(world).toLowerCase();
        return map[lower] || world;
    }
    
    // Alias for older API
    switchWorld(world) {
        const normalized = this.normalizeWorldName(world);
        this.changeWorld(normalized);
    }
    
    // Alias for older API
    render() {
        this.draw();
    }
}