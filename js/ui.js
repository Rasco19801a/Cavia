// UI module - handles user interface elements
import { eventSystem, GameEvents } from './event-system.js';
import { domManager } from './dom-manager.js';
import { UI_CONFIG } from './config.js';

export class UI {
    constructor(player) {
        this.player = player;
        this.notificationTimeout = null;
        this.setupUI();
        this.setupEventListeners();
    }
    
    setupUI() {
        // Create carrot display
        this.setupCarrotDisplay();
        
        // Initial display update
        this.updateDisplay();
        
        // Setup world selector
        this.setupWorldSelector();
        
        // Setup design panel if it exists
        this.setupDesignPanel();
    }
    
    setupEventListeners() {
        // Listen for game events that need UI updates
        eventSystem.on(GameEvents.PLAYER_COLLECT_ITEM, () => {
            this.updateDisplay();
        });
        
        eventSystem.on(GameEvents.SHOP_PURCHASE, () => {
            this.updateDisplay();
        });
        
        eventSystem.on(GameEvents.MISSION_COMPLETE, () => {
            this.updateDisplay();
        });
    }
    
    setupCarrotDisplay() {
        // Create carrot display element if it doesn't exist
        if (!document.getElementById('carrotDisplay')) {
            const carrotDisplay = document.createElement('div');
            carrotDisplay.id = 'carrotDisplay';
            carrotDisplay.className = 'carrots-display';
            carrotDisplay.innerHTML = `
                <span class="carrot-icon">🥕</span>
                <span id="carrotCount">0</span>
            `;
            document.body.appendChild(carrotDisplay);
            
            // Cache the element in domManager
            domManager.cacheElement('carrotCount', 'carrotCount');
        }
    }
    
    setupWorldSelector() {
        // Setup world selector buttons
        const worldButtons = document.querySelectorAll('.world-btn');
        
        console.log('Setting up world selector, found buttons:', worldButtons.length);
        
        worldButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const world = btn.getAttribute('data-world');
                console.log('World button clicked:', world);
                
                // Update active state
                worldButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Emit world change event
                eventSystem.emit(GameEvents.WORLD_CHANGE, world);
            });
        });
    }
    
    updateDisplay() {
        // Update carrot count directly
        const carrotCount = document.getElementById('carrotCount');
        if (carrotCount) {
            carrotCount.textContent = this.player.carrots;
        }
        
        // Also emit event for other systems
        eventSystem.emit(GameEvents.UI_UPDATE_DISPLAY, {
            carrots: this.player.carrots
        });
    }
    
    showNotification(message) {
        // Create notification element if it doesn't exist
        if (!document.getElementById('notification')) {
            const notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
            
            // Cache the element
            domManager.cacheElement('notification', 'notification');
        }
        
        // Use event system for notifications
        eventSystem.emit(GameEvents.UI_NOTIFICATION, message);
    }
    
    setupDesignPanel() {
        // Setup design panel buttons
        const designButtons = document.querySelectorAll('.design-btn');
        designButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const world = btn.dataset.world;
                if (world) {
                    eventSystem.emit(GameEvents.WORLD_CHANGE, world);
                }
            });
        });
        
        // Setup category buttons
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show/hide item grids
                const category = btn.dataset.category;
                document.querySelectorAll('.item-grid').forEach(grid => {
                    if (grid.dataset.category === category) {
                        grid.classList.remove('hidden');
                    } else {
                        grid.classList.add('hidden');
                    }
                });
            });
        });
        
        // Setup item buttons
        const itemButtons = document.querySelectorAll('.item-btn');
        itemButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const itemType = btn.dataset.item;
                const price = parseInt(btn.dataset.price) || 0;
                
                if (this.player.carrots >= price) {
                    this.player.carrots -= price;
                    this.updateDisplay();
                    
                    // Emit item purchase event
                    eventSystem.emit(GameEvents.SHOP_PURCHASE, {
                        item: itemType,
                        price: price
                    });
                    
                    this.showNotification(`Je hebt een ${itemType} gekocht!`);
                } else {
                    this.showNotification('Je hebt niet genoeg wortels!');
                }
            });
        });
    }
    
    createModal(config) {
        return domManager.createModal(config);
    }
    
    openModal(modalId) {
        domManager.openModal({ id: modalId });
    }
    
    closeModal(modalId) {
        domManager.closeModal(modalId);
    }
    
    destroy() {
        // Clean up event listeners
        eventSystem.off(GameEvents.PLAYER_COLLECT_ITEM);
        eventSystem.off(GameEvents.SHOP_PURCHASE);
        eventSystem.off(GameEvents.MISSION_COMPLETE);
        
        // Clear notification timeout
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
    }
}