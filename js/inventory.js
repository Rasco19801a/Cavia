// Inventory module - handles player's inventory system
import { GAME_CONFIG } from './config.js';

export class Inventory {
    constructor(game) {
        this.game = game;
        this.items = [];
        this.isOpen = false;
        this.inventoryModal = null;
        this.inventoryButton = null;
        this.selectedItem = null;
        this.setupInventoryButton();
        this.setupInventoryModal();
        this.loadInventory();
    }
    
    setupInventoryButton() {
        // Create floating inventory button
        this.inventoryButton = document.createElement('button');
        this.inventoryButton.id = 'inventoryButton';
        this.inventoryButton.className = 'inventory-button';
        this.inventoryButton.innerHTML = '🎒';
        this.inventoryButton.title = 'Open Inventory';
        
        // Style the button
        this.inventoryButton.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            font-size: 30px;
            cursor: pointer;
            z-index: 100;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;
        
        // Add hover effect
        this.inventoryButton.addEventListener('mouseenter', () => {
            this.inventoryButton.style.transform = 'scale(1.1)';
            this.inventoryButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
        });
        
        this.inventoryButton.addEventListener('mouseleave', () => {
            this.inventoryButton.style.transform = 'scale(1)';
            this.inventoryButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
        
        // Click event
        this.inventoryButton.addEventListener('click', () => this.toggleInventory());
        
        document.body.appendChild(this.inventoryButton);
    }
    
    setupInventoryModal() {
        // Create inventory modal
        this.inventoryModal = document.createElement('div');
        this.inventoryModal.id = 'inventoryModal';
        this.inventoryModal.className = 'inventory-modal hidden';
        this.inventoryModal.innerHTML = `
            <div class="inventory-content">
                <h2>🎒 Mijn Rugzak</h2>
                <div class="inventory-grid" id="inventoryGrid"></div>
                <div class="inventory-info">
                    <div id="selectedItemInfo" class="selected-item-info hidden">
                        <h3 id="selectedItemName"></h3>
                        <p id="selectedItemDescription"></p>
                        <button id="useItemBtn" class="use-item-btn hidden">Gebruiken</button>
                        <button id="playMinigameBtn" class="play-minigame-btn hidden">Speel Minigame</button>
                        <button id="placeInHomeBtn" class="place-home-btn hidden">Plaats in Huis</button>
                    </div>
                </div>
                <button class="modal-close-btn" id="closeInventory">✖</button>
            </div>
        `;
        
        document.body.appendChild(this.inventoryModal);
        
        // Add click outside to close
        this.inventoryModal.addEventListener('click', (e) => {
            if (e.target === this.inventoryModal) {
                this.closeInventory();
            }
        });
        
        // Event listeners - use arrow functions to preserve 'this' context
        const closeBtn = document.getElementById('closeInventory');
        const useBtn = document.getElementById('useItemBtn');
        const playBtn = document.getElementById('playMinigameBtn');
        const placeBtn = document.getElementById('placeInHomeBtn');
        
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeInventory());
        if (useBtn) useBtn.addEventListener('click', () => this.useSelectedItem());
        if (playBtn) playBtn.addEventListener('click', () => this.playItemMinigame());
        if (placeBtn) placeBtn.addEventListener('click', () => this.placeItemInHome());
        
        // ESC key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeInventory();
            }
        });
    }
    
    addItem(itemData) {
        // Check if item already exists
        const existingItem = this.items.find(i => i.id === itemData.id);
        if (existingItem) {
            existingItem.quantity++;
            this.game.ui.showNotification(`${existingItem.name} toegevoegd aan rugzak! (${existingItem.quantity}x)`);
        } else {
            const item = {
                ...itemData,
                id: itemData.id || `item_${Date.now()}_${Math.random()}`,
                quantity: 1,
                minigame: this.getItemMinigame(itemData.id)
            };
            this.items.push(item);
            this.game.ui.showNotification(`${item.name} toegevoegd aan rugzak!`);
        }
        
        this.saveInventory();
        this.updateInventoryDisplay();
    }
    
    removeItem(itemId, quantity = 1) {
        const itemIndex = this.items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            this.items[itemIndex].quantity -= quantity;
            if (this.items[itemIndex].quantity <= 0) {
                this.items.splice(itemIndex, 1);
            }
            this.saveInventory();
            this.updateInventoryDisplay();
        }
    }
    
    getItem(itemId) {
        return this.items.find(i => i.id === itemId);
    }
    
    hasItem(itemId, quantity = 1) {
        const item = this.getItem(itemId);
        return item && item.quantity >= quantity;
    }
    
    toggleInventory() {
        if (this.isOpen) {
            this.closeInventory();
        } else {
            this.openInventory();
        }
    }
    
    openInventory() {
        // Check if modal exists
        if (!this.inventoryModal) {
            console.error('Inventory modal not found!');
            this.setupInventoryModal();
        }
        
        this.isOpen = true;
        this.inventoryModal.classList.remove('hidden');
        this.updateInventoryDisplay();
        
        // Focus on the modal for keyboard events
        this.inventoryModal.focus();
        
        // Log for debugging
        console.log('Inventory opened', {
            isOpen: this.isOpen,
            modalClassList: this.inventoryModal.classList.toString(),
            currentMissionPig: this.game.currentMissionPig
        });
    }
    
    closeInventory() {
        this.isOpen = false;
        if (this.inventoryModal) {
            this.inventoryModal.classList.add('hidden');
        }
        this.selectedItem = null;
        this.updateSelectedItemInfo();
        
        // If inventory was opened from mission, reopen mission modal
        if (this.game.currentMissionPig) {
            const missionPig = this.game.currentMissionPig;
            // Clear the reference first
            this.game.currentMissionPig = null;
            
            // Reopen mission modal after a short delay
            setTimeout(() => {
                if (this.game.guineaPigMissions) {
                    this.game.guineaPigMissions.showMissionModal(missionPig);
                }
            }, 200);
        }
    }
    
    updateInventoryDisplay() {
        const grid = document.getElementById('inventoryGrid');
        grid.innerHTML = '';
        
        this.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            if (this.selectedItem && this.selectedItem.id === item.id) {
                itemDiv.classList.add('selected');
            }
            
            itemDiv.innerHTML = `
                <div class="item-emoji">${item.emoji}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">${item.quantity}</div>
            `;
            
            itemDiv.addEventListener('click', () => this.selectItem(item));
            
            grid.appendChild(itemDiv);
        });
        
        // Add empty slots
        const emptySlots = 20 - this.items.length;
        for (let i = 0; i < emptySlots; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'inventory-item empty';
            grid.appendChild(emptyDiv);
        }
    }
    
    selectItem(item) {
        this.selectedItem = item;
        this.updateInventoryDisplay();
        this.updateSelectedItemInfo();
    }
    
    updateSelectedItemInfo() {
        const infoDiv = document.getElementById('selectedItemInfo');
        const nameEl = document.getElementById('selectedItemName');
        const descEl = document.getElementById('selectedItemDescription');
        const useBtn = document.getElementById('useItemBtn');
        const minigameBtn = document.getElementById('playMinigameBtn');
        const placeHomeBtn = document.getElementById('placeInHomeBtn');
        
        if (this.selectedItem) {
            infoDiv.classList.remove('hidden');
            nameEl.textContent = this.selectedItem.name;
            descEl.textContent = this.selectedItem.description;
            
            // Show appropriate buttons
            if (this.canUseItem(this.selectedItem)) {
                useBtn.classList.remove('hidden');
            } else {
                useBtn.classList.add('hidden');
            }
            
            if (this.selectedItem.minigame) {
                minigameBtn.classList.remove('hidden');
            } else {
                minigameBtn.classList.add('hidden');
            }

            // Show "Place in Home" button if in home world
            if (this.game.currentWorld === 'thuis') {
                placeHomeBtn.classList.remove('hidden');
            } else {
                placeHomeBtn.classList.add('hidden');
            }
        } else {
            infoDiv.classList.add('hidden');
        }
    }
    
    canUseItem(item) {
        // Check if item can be used in current context
        if (this.game.currentMissionPig) {
            // Check if this item is needed for the mission
            const pig = this.game.currentMissionPig;
            return pig.missionItem === item.id;
        }
        
        // Check for other use cases
        const usableItems = ['carrot', 'lettuce', 'cucumber', 'corn', 'hay_small', 'hay_medium', 'hay_large'];
        return usableItems.includes(item.id);
    }
    
    useSelectedItem() {
        if (!this.selectedItem || !this.canUseItem(this.selectedItem)) return;
        
        // If there's a current mission pig, give item to them
        if (this.game.currentMissionPig) {
            this.giveItemToMissionPig(this.selectedItem);
        } else {
            // Other use cases
            this.game.ui.showNotification(`${this.selectedItem.name} gebruikt!`);
            this.removeItem(this.selectedItem.id, 1);
        }
        
        // Update display
        if (this.selectedItem.quantity <= 1) {
            this.selectedItem = null;
        }
        this.updateInventoryDisplay();
        this.updateSelectedItemInfo();
    }

    placeItemInHome() {
        if (!this.selectedItem) return;

        // Add item to home inventory
        this.game.homeInventory.addItem(this.selectedItem);

        // Remove from player's inventory
        this.removeItem(this.selectedItem.id, 1);

        this.game.ui.showNotification(`${this.selectedItem.name} geplaatst in je huis!`);
        this.updateInventoryDisplay();
        this.updateSelectedItemInfo();
    }
    
    giveItemToMissionPig(item) {
        const pig = this.game.currentMissionPig;
        if (pig && pig.missionItem === item.id) {
            pig.missionProgress++;
            this.removeItem(item.id, 1);
            
            if (pig.missionProgress >= pig.missionTarget) {
                // Mission complete!
                this.game.ui.showNotification(`Missie voltooid! Je hebt ${GAME_CONFIG.MISSION_REWARD} wortels verdiend! 🎉`);
                this.game.player.carrots += GAME_CONFIG.MISSION_REWARD;
                this.game.ui.updateDisplay();
                
                // Update mission through guinea pig missions
                if (this.game.guineaPigMissions) {
                    this.game.guineaPigMissions.completeMission(pig);
                }
                
                // Close inventory and clear mission pig
                this.closeInventory();
                this.game.currentMissionPig = null;
            } else {
                this.game.ui.showNotification(`Goed zo! Nog ${pig.missionTarget - pig.missionProgress} ${item.name} te gaan!`);
                
                // Update mission modal if it exists
                if (this.game.guineaPigMissions) {
                    this.game.guineaPigMissions.updateMissionModal();
                }
            }
        }
    }

    
    getItemMinigame(itemId) {
        // Define minigames for certain items
        const minigames = {
            'puzzle': 'puzzle',
            'ball': 'catch',
            'blocks': 'stack',
            'bath': 'splash'
        };
        
        return minigames[itemId] || null;
    }
    
    playItemMinigame() {
        if (!this.selectedItem || !this.selectedItem.minigame) return;
        
        // Close inventory
        this.closeInventory();
        
        // Start appropriate minigame
        switch (this.selectedItem.minigame) {
            case 'puzzle':
                this.game.startPuzzleMinigame();
                break;
            case 'catch':
                this.game.startCatchMinigame();
                break;
            case 'stack':
                this.game.startStackMinigame();
                break;
            case 'splash':
                this.game.underwaterWorld.startSplashMinigame();
                break;
        }
    }
    
    saveInventory() {
        localStorage.setItem('guineaPigInventory', JSON.stringify(this.items));
    }
    
    loadInventory() {
        const saved = localStorage.getItem('guineaPigInventory');
        if (saved) {
            this.items = JSON.parse(saved);
        }
    }
}