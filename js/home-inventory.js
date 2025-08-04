// Home Inventory module - handles items in the home world
import { CONFIG } from './config.js';

export class HomeInventory {
    constructor(game) {
        this.game = game;
        this.items = [];
        this.draggedItem = null;
        this.dragOffset = { x: 0, y: 0 };
        this.otherGuineaPigs = [];
        this.currentMissionPig = null;
        this.missionModal = null;
        this.isDragging = false; // Add flag to track dragging state
        this.dragStartTime = 0; // Track when drag started
        this.setupOtherGuineaPigs();
        this.setupMissionModal();
        this.loadProgress();
        
        // Reorganize any existing items to prevent overlapping
        if (this.items.length > 0) {
            this.reorganizeItems();
        }
    }
    
    setupOtherGuineaPigs() {
        // Create 3 other guinea pigs in the home - spaced out evenly
        this.otherGuineaPigs = [
            {
                id: 1,
                name: 'Ginger',
                x: 600,
                y: 480,
                color: {
                    body: '#FFFFFF',  // White body
                    belly: '#F5DEB3'  // Beige belly
                },
                mission: 'Ik heb zo\'n honger! Breng me 3 wortels!',
                missionProgress: 0,
                missionTarget: 3,
                missionItem: 'carrot',
                accessory: null
            },
            {
                id: 2,
                name: 'Chinto',
                x: 900,
                y: 480,
                color: {
                    body: '#FFFFFF',  // White body
                    belly: '#000000'  // Black belly
                },
                mission: 'Ik wil graag een mooie strik!',
                missionProgress: 0,
                missionTarget: 1,
                missionItem: 'bow',
                accessory: null
            },
            {
                id: 3,
                name: 'Luxy',
                x: 1200,
                y: 480,
                color: {
                    body: '#FFFFFF',  // White body
                    belly: '#8B4513'  // Brown belly
                },
                mission: 'Help me 2 stukken sla te vinden!',
                missionProgress: 0,
                missionTarget: 2,
                missionItem: 'lettuce',
                accessory: null
            }
        ];
    }
    
    setupMissionModal() {
        // Create mission modal
        this.missionModal = document.createElement('div');
        this.missionModal.id = 'missionModal';
        this.missionModal.className = 'mission-modal hidden';
        this.missionModal.innerHTML = `
            <div class="mission-content">
                <h2 id="missionPigName">Missie</h2>
                <div class="mission-pig-icon">🐹</div>
                <p id="missionText"></p>
                <div class="mission-progress">
                    <div class="progress-bar">
                        <div id="progressFill" class="progress-fill"></div>
                    </div>
                    <p id="progressText"></p>
                </div>
                <button class="inventory-select-btn" id="selectFromInventory">Selecteer uit Rugzak 🎒</button>
                <button class="close-btn" id="closeMission">✖</button>
            </div>
        `;
        document.body.appendChild(this.missionModal);
        
        // Event listener for close button
        document.getElementById('closeMission').addEventListener('click', () => {
            this.missionModal.classList.add('hidden');
            this.currentMissionPig = null;
        });
        
        // Event listener for inventory select button
        document.getElementById('selectFromInventory').addEventListener('click', () => {
            // Store current mission pig in game object for inventory to access
            this.game.currentMissionPig = this.currentMissionPig;
            // Open inventory
            this.game.inventory.openInventory();
            // Close mission modal
            this.missionModal.classList.add('hidden');
        });
        
        // Close on escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.missionModal.classList.contains('hidden')) {
                this.missionModal.classList.add('hidden');
                this.currentMissionPig = null;
            }
        });
    }
    
    addItem(itemData) {
        // Calculate grid position to prevent overlapping
        const gridColumns = 8; // Number of columns in the grid
        const gridSpacing = 150; // Space between items
        const startX = 200; // Starting X position
        const startY = 480; // Starting Y position - now on the ground
        
        // Find the next available position
        const existingPositions = this.items.map(item => ({ x: item.x, y: item.y }));
        
        // Also consider guinea pig positions to avoid overlapping with them
        const guineaPigPositions = this.otherGuineaPigs.map(pig => ({ x: pig.x, y: pig.y }));
        const allOccupiedPositions = [...existingPositions, ...guineaPigPositions];
        
        let gridIndex = 0;
        let x, y;
        
        // Find an empty grid position
        while (true) {
            const col = gridIndex % gridColumns;
            const row = Math.floor(gridIndex / gridColumns);
            x = startX + (col * gridSpacing);
            y = startY + (row * gridSpacing);
            
            // Check if this position is already occupied
            const isOccupied = allOccupiedPositions.some(pos => 
                Math.abs(pos.x - x) < 100 && Math.abs(pos.y - y) < 100
            );
            
            if (!isOccupied || gridIndex > 50) { // Safety limit
                break;
            }
            
            gridIndex++;
        }
        
        const item = {
            ...itemData,
            x: x,
            y: y,
            consumed: false
        };
        
        // Special handling for interactive items - place them at specific positions
        if (item.id === 'wheel') {
            item.x = CONFIG.WORLD_WIDTH / 2 - 100;
            item.y = 250; // Move up to avoid overlap
        } else if (item.id === 'tunnel') {
            item.x = 1100;
            item.y = 350;
        }
        
        this.items.push(item);
        console.log('Item added to home inventory:', item);
        this.logInventory();
    }
    
    logInventory() {
        console.log('Current home inventory items:');
        this.items.forEach((item, index) => {
            console.log(`${index}: ${item.id} - ${item.name} at (${Math.round(item.x)}, ${Math.round(item.y)}) - consumed: ${item.consumed}`);
        });
    }
    
    reorganizeItems() {
        // Reorganize all items to prevent overlapping
        const gridColumns = 8; // Number of columns in the grid
        const gridSpacing = 150; // Space between items
        const startX = 200; // Starting X position
        const startY = 480; // Starting Y position - on the ground
        
        // Get guinea pig positions to avoid
        const guineaPigPositions = this.otherGuineaPigs.map(pig => ({ x: pig.x, y: pig.y }));
        
        // Sort items by their current position to maintain some order
        this.items.sort((a, b) => {
            if (Math.abs(a.y - b.y) < 50) {
                return a.x - b.x;
            }
            return a.y - b.y;
        });
        
        // Reassign positions
        this.items.forEach((item, index) => {
            // Skip special items that have fixed positions
            if (item.id === 'wheel' || item.id === 'tunnel') {
                return;
            }
            
            let gridIndex = index;
            let x, y;
            let attempts = 0;
            
            // Find an empty grid position
            while (attempts < 100) {
                const col = gridIndex % gridColumns;
                const row = Math.floor(gridIndex / gridColumns);
                x = startX + (col * gridSpacing);
                y = startY + (row * gridSpacing);
                
                // Check if this position conflicts with guinea pigs
                const conflictsWithPig = guineaPigPositions.some(pos => 
                    Math.abs(pos.x - x) < 100 && Math.abs(pos.y - y) < 100
                );
                
                // Check if this position conflicts with other already placed items
                const conflictsWithItem = this.items.slice(0, index).some(otherItem => 
                    otherItem.id !== 'wheel' && otherItem.id !== 'tunnel' &&
                    Math.abs(otherItem.x - x) < 100 && Math.abs(otherItem.y - y) < 100
                );
                
                if (!conflictsWithPig && !conflictsWithItem) {
                    break;
                }
                
                gridIndex++;
                attempts++;
            }
            
            // Update item position
            item.x = x;
            item.y = y;
        });
        
        console.log('Items reorganized to prevent overlapping');
        this.logInventory();
    }
    
    draw(ctx) {
        // Don't draw floor and walls here - the living room interior is already drawn in drawThuis()
        // The home world has its own detailed interior design
        
        // Draw other guinea pigs first (before items so they appear behind)
        this.otherGuineaPigs.forEach(pig => {
            const screenX = pig.x - this.game.camera.x;
            const screenY = pig.y - this.game.camera.y;
            
            // Check if this pig is a potential drop target
            let isDropTarget = false;
            if (this.draggedItem && this.draggedItem.x && this.draggedItem.y) {
                const distance = Math.sqrt(
                    Math.pow(this.draggedItem.x - pig.x, 2) + 
                    Math.pow(this.draggedItem.y - pig.y, 2)
                );
                isDropTarget = distance < 100; // Slightly larger than drop radius for visual feedback
            }
            
            // Draw drop zone indicator if dragging
            if (isDropTarget) {
                ctx.save();
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#4ECDC4';
                ctx.beginPath();
                ctx.arc(screenX, screenY, 80, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                
                // Draw pulsing effect
                const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 0.8;
                ctx.strokeStyle = '#4ECDC4';
                ctx.lineWidth = 3;
                ctx.globalAlpha = pulse;
                ctx.beginPath();
                ctx.arc(screenX, screenY, 85, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
            
            // Draw guinea pig body
            ctx.save();
            ctx.translate(pig.x, pig.y);
            
            // Check if an item is being dragged over this pig
            let scale = 1;
            if (this.draggedItem) {
                const distance = Math.sqrt(
                    Math.pow(this.draggedItem.x - pig.x, 2) + 
                    Math.pow(this.draggedItem.y - pig.y, 2)
                );
                if (distance < 80) { // Increased detection radius
                    scale = 1.2; // Scale up when item is near
                }
            }
            
            // Apply scale
            ctx.scale(scale, scale);
            
            // Draw guinea pig body
            ctx.fillStyle = pig.color.body;
            ctx.beginPath();
            ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw belly
            ctx.fillStyle = pig.color.belly;
            ctx.beginPath();
            ctx.ellipse(0, 10, 25, 15, 0, 0, Math.PI);
            ctx.fill();
            
            // Head
            ctx.fillStyle = pig.color.body;
            ctx.beginPath();
            ctx.arc(-25, -10, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Ears
            ctx.fillStyle = pig.color.body;
            // Left ear
            ctx.beginPath();
            ctx.ellipse(-35, -25, 8, 12, -0.3, 0, Math.PI * 2);
            ctx.fill();
            // Right ear
            ctx.beginPath();
            ctx.ellipse(-15, -25, 8, 12, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner ears
            ctx.fillStyle = '#FFB6C1';
            // Left inner ear
            ctx.beginPath();
            ctx.ellipse(-35, -25, 4, 6, -0.3, 0, Math.PI * 2);
            ctx.fill();
            // Right inner ear
            ctx.beginPath();
            ctx.ellipse(-15, -25, 4, 6, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(-30, -15, 3, 0, Math.PI * 2);
            ctx.arc(-20, -15, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Nose
            ctx.fillStyle = '#FFB6C1';
            ctx.beginPath();
            ctx.arc(-25, -5, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Eating animation
            if (pig.isEating) {
                ctx.fillStyle = '#FF6B6B';
                ctx.beginPath();
                ctx.arc(-25, 0, 5, 0, Math.PI);
                ctx.fill();
            }
            
            // Accessory
            if (pig.accessory) {
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                const accessoryEmoji = {
                    'bow': '🎀',
                    'hat': '🎩',
                    'glasses': '👓',
                    'necklace': '💎'
                }[pig.accessory];
                ctx.fillText(accessoryEmoji, -25, -30);
            }
            
            // Name
            ctx.fillStyle = '#333';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(pig.name, 0, -50);
            
            // Mission progress
            if (pig.missionProgress < pig.missionTarget) {
                ctx.fillStyle = '#666';
                ctx.font = '14px Arial';
                const missionEmoji = this.getMissionEmoji(pig.missionItem);
                ctx.fillText(`${missionEmoji} ${pig.missionProgress}/${pig.missionTarget}`, 0, 50);
            }
            
            ctx.restore();
        });
        
        // Draw items
        this.items.filter(item => !item.consumed).forEach(item => {
            ctx.save();
            
            // Check if this item is being dragged
            const isDragging = this.draggedItem === item;
            
            // Apply transformations
            const scale = item.scale || (isDragging ? 1.1 : 1);
            const opacity = item.opacity !== undefined ? item.opacity : (isDragging ? 0.8 : 1);
            
            ctx.translate(item.x, item.y);
            ctx.scale(scale, scale);
            ctx.translate(-item.x, -item.y);
            ctx.globalAlpha = opacity;
            
            if (item.id === 'wheel') {
                // Draw giant ferris wheel (reuzenrad)
                ctx.translate(item.x + 100, item.y + 100);
                ctx.rotate(item.rotation || 0);
                
                // Main wheel structure
                ctx.strokeStyle = '#4A5568';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(0, 0, 120, 0, Math.PI * 2);
                ctx.stroke();
                
                // Inner circle
                ctx.beginPath();
                ctx.arc(0, 0, 30, 0, Math.PI * 2);
                ctx.stroke();
                
                // Spokes
                ctx.lineWidth = 4;
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI / 4);
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
                    ctx.lineTo(Math.cos(angle) * 120, Math.sin(angle) * 120);
                    ctx.stroke();
                }
                
                // Support structure
                ctx.strokeStyle = '#2D3748';
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(-100, 120);
                ctx.lineTo(0, 0);
                ctx.lineTo(100, 120);
                ctx.stroke();
                
                // Base
                ctx.fillStyle = '#4A5568';
                ctx.fillRect(-120, 120, 240, 20);
                
                // Draw baskets/gondolas
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI / 4) + (item.rotation || 0);
                    const basketX = Math.cos(angle) * 120;
                    const basketY = Math.sin(angle) * 120;
                    
                    ctx.save();
                    ctx.translate(basketX, basketY);
                    // Keep basket upright
                    ctx.rotate(-(item.rotation || 0));
                    
                    // Basket
                    ctx.fillStyle = '#E53E3E';
                    ctx.fillRect(-20, -10, 40, 30);
                    
                    // Basket bottom
                    ctx.fillStyle = '#C53030';
                    ctx.fillRect(-20, 20, 40, 5);
                    
                    // Connection bar
                    ctx.strokeStyle = '#4A5568';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(0, -10);
                    ctx.lineTo(0, -20);
                    ctx.stroke();
                    
                    // Check if guinea pig is in this basket (bottom basket when i === 6)
                    if (item.guineaPigRiding && i === 6) {
                        // Draw guinea pig in basket
                        ctx.fillStyle = this.game.player.color || '#8B4513';
                        ctx.beginPath();
                        ctx.ellipse(0, 5, 15, 12, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Guinea pig head
                        ctx.beginPath();
                        ctx.arc(-8, 0, 8, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Eyes
                        ctx.fillStyle = '#000';
                        ctx.beginPath();
                        ctx.arc(-10, -2, 2, 0, Math.PI * 2);
                        ctx.arc(-6, -2, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    ctx.restore();
                }
                
                // Rotate the wheel if guinea pig is riding
                if (item.guineaPigRiding) {
                    item.rotation = (item.rotation || 0) + 0.01;
                }
            } else if (item.id === 'tunnel') {
                // Draw tunnel/maze house
                ctx.translate(item.x, item.y);
                
                // House structure
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(0, 0, 200, 150);
                
                // Roof
                ctx.fillStyle = '#DC143C';
                ctx.beginPath();
                ctx.moveTo(-20, 0);
                ctx.lineTo(100, -50);
                ctx.lineTo(220, 0);
                ctx.closePath();
                ctx.fill();
                
                // Entrance
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(100, 100, 30, 0, Math.PI * 2);
                ctx.fill();
                
                // Maze hint
                ctx.fillStyle = '#FFF';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Doolhof', 100, 75);
            } else {
                // Draw regular items
                ctx.translate(item.x, item.y);
                
                // Add shadow if dragging
                if (isDragging) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                    ctx.shadowBlur = 10;
                    ctx.shadowOffsetX = 5;
                    ctx.shadowOffsetY = 5;
                }
                
                ctx.font = '40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(item.emoji, 0, 0);
                
                // Item name
                ctx.font = '14px Arial';
                ctx.fillStyle = '#333';
                ctx.fillText(item.name, 0, 20);
            }
            
            ctx.restore();
        });
    }
    
    handleClick(x, y) {
        console.log('Click at:', x, y);
        
        // Don't handle clicks if we're dragging
        if (this.isDragging) {
            return false;
        }
        
        // Check if clicking on ferris wheel
        const wheel = this.items.find(item => 
            item.id === 'wheel' && 
            x >= item.x && x <= item.x + 200 && 
            y >= item.y && y <= item.y + 240
        );
        
        if (wheel) {
            // Toggle guinea pig riding
            wheel.guineaPigRiding = !wheel.guineaPigRiding;
            if (wheel.guineaPigRiding) {
                // Show notification
                if (this.game.ui && this.game.ui.showNotification) {
                    this.game.ui.showNotification('🎡 Je cavia gaat een ritje maken in het reuzenrad! 🎡');
                }
            }
            return true;
        }
        
        // Check if clicking on tunnel
        const tunnel = this.items.find(item => 
            item.id === 'tunnel' && 
            x >= item.x && x <= item.x + 200 && 
            y >= item.y && y <= item.y + 150
        );
        
        if (tunnel) {
            this.startMazeGame();
            return true;
        }
        
        // Only show mission modal if it's a quick click (not a drag attempt)
        const clickedPig = this.otherGuineaPigs.find(pig => {
            const distance = Math.sqrt(Math.pow(x - pig.x, 2) + Math.pow(y - pig.y, 2));
            return distance < 50;
        });
        
        if (clickedPig && !this.draggedItem) {
            // Small delay to ensure it's not a drag
            setTimeout(() => {
                if (!this.isDragging && !this.draggedItem) {
                    this.showMission(clickedPig);
                }
            }, 100);
            return true;
        }
        
        return false;
    }
    
    handleDragStart(x, y) {
        // Check if clicking on an item to drag it
        const item = this.items.find(item => {
            if (item.consumed) return false;
            const distance = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
            return distance < 30;
        });
        
        if (item) {
            this.draggedItem = item;
            this.dragOffset.x = x - item.x;
            this.dragOffset.y = y - item.y;
            this.isDragging = true;
            this.dragStartTime = Date.now();
            console.log('Started dragging:', item);
            return true;
        }
        
        return false;
    }
    
    handleDragMove(x, y) {
        if (this.draggedItem) {
            this.draggedItem.x = x - this.dragOffset.x;
            this.draggedItem.y = y - this.dragOffset.y;
        }
    }
    
    handleDragEnd(x, y) {
        if (!this.draggedItem) {
            this.isDragging = false;
            return;
        }
        
        console.log('Drag ended at:', x, y);
        console.log('Dragged item:', this.draggedItem);
        
        // Check if dropped on another guinea pig (increased detection radius)
        const targetPig = this.otherGuineaPigs.find(pig => {
            const distance = Math.sqrt(Math.pow(x - pig.x, 2) + Math.pow(y - pig.y, 2));
            console.log(`Distance to ${pig.name}: ${distance}`);
            return distance < 80; // Increased from 50 to 80
        });
        
        console.log('Target pig:', targetPig);
        
        if (targetPig) {
            // Check if it's a water bath being dropped
            if (this.draggedItem.id === 'bath') {
                // Start water bath minigame
                this.startWaterBathGame(targetPig);
                // Don't consume the bath item
                this.draggedItem = null;
                this.isDragging = false;
                return;
            }
            
            if (this.isEdible(this.draggedItem.id)) {
                console.log('Item is edible:', this.draggedItem.id);
                console.log('Pig wants:', targetPig.missionItem);
                console.log('Current progress:', targetPig.missionProgress, '/', targetPig.missionTarget);
                
                // Feed the guinea pig - DONT set consumed yet, let animation handle it
                // this.draggedItem.consumed = true; // REMOVED - let animation handle this
                
                // Check mission progress BEFORE animation
                if (targetPig.missionItem === this.draggedItem.id) {
                    targetPig.missionProgress++;
                    console.log(`Mission progress updated: ${targetPig.name} - ${targetPig.missionProgress}/${targetPig.missionTarget}`);
                    
                    // Save progress immediately
                    this.saveProgress();
                    
                    // Update mission modal if open with immediate visual feedback
                    if (this.currentMissionPig && this.currentMissionPig.id === targetPig.id) {
                        this.updateMissionModal();
                    }
                    
                    // Force immediate re-render to show updated progress
                    if (this.game && this.game.draw) {
                        this.game.draw();
                    }
                    
                    // Show progress feedback
                    if (this.game.ui && this.game.ui.showNotification) {
                        if (targetPig.missionProgress < targetPig.missionTarget) {
                            this.game.ui.showNotification(`${targetPig.name}: Nog ${targetPig.missionTarget - targetPig.missionProgress} ${this.draggedItem.name} te gaan! 🐹`);
                        }
                    }
                    
                    if (targetPig.missionProgress >= targetPig.missionTarget) {
                        this.completeMission(targetPig);
                    }
                } else {
                    console.log(`Item mismatch: dragged ${this.draggedItem.id}, pig wants ${targetPig.missionItem}`);
                    // Still show eating animation even if it's not the mission item
                    if (this.game.ui && this.game.ui.showNotification) {
                        this.game.ui.showNotification(`${targetPig.name} eet ${this.draggedItem.name}! 😊`);
                    }
                }
                
                // Show eating animation - this will handle item removal
                this.showEatingAnimation(this.draggedItem, targetPig);
                
                // DONT Remove consumed item here - let animation handle it
                // this.items = this.items.filter(item => item !== this.draggedItem); // REMOVED
            } else if (this.isAccessory(this.draggedItem.id)) {
                // Put accessory on guinea pig
                targetPig.accessory = this.draggedItem.id;
                
                // Mark as consumed and remove immediately for accessories
                this.draggedItem.consumed = true;
                
                // Check mission progress
                if (targetPig.missionItem === this.draggedItem.id) {
                    this.completeMission(targetPig);
                }
                
                // Save progress
                this.saveProgress();
                
                // Show feedback
                if (this.game.ui && this.game.ui.showNotification) {
                    this.game.ui.showNotification(`${targetPig.name} draagt nu een ${this.draggedItem.name}! 🎀`);
                }
                
                // Remove consumed item from array immediately for accessories
                this.items = this.items.filter(item => item !== this.draggedItem);
            }
        }
        
        // Reset dragging state
        this.draggedItem = null;
        this.isDragging = false;
    }
    
    isEdible(itemId) {
        const edibleItems = ['carrot', 'lettuce', 'cucumber', 'corn', 'hay_small', 'hay_medium', 'hay_large', 'hay_premium', 'endive', 'celery', 'spinach'];
        return edibleItems.includes(itemId);
    }
    
    isAccessory(itemId) {
        const accessories = ['bow', 'hat', 'glasses', 'necklace'];
        return accessories.includes(itemId);
    }
    
    getMissionEmoji(itemId) {
        const emojis = {
            'carrot': '🥕',
            'lettuce': '🥬',
            'cucumber': '🥒',
            'corn': '🌽',
            'hay_small': '🌾',
            'hay_medium': '🌾',
            'hay_large': '🌾',
            'hay_premium': '🌾',
            'bow': '🎀',
            'hat': '🎩',
            'glasses': '👓',
            'necklace': '💎'
        };
        return emojis[itemId] || '❓';
    }
    
    showEatingAnimation(item, pig = null) {
        // Simple eating animation feedback
        const target = pig || this.game.player;
        
        // Show eating animation on the guinea pig
        if (pig) {
            pig.isEating = true;
            
            // Create a simple disappearing effect
            const startTime = Date.now();
            const duration = 500; // milliseconds
            const startX = item.x;
            const startY = item.y;
            const targetX = pig.x;
            const targetY = pig.y;
            
            // Animation loop
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Interpolate position
                item.x = startX + (targetX - startX) * progress;
                item.y = startY + (targetY - startY) * progress;
                
                // Scale down
                item.scale = 1 - (progress * 0.8);
                
                // Fade out
                item.opacity = 1 - progress;
                
                // Continue animation if not finished
                if (progress < 1) {
                    if (this.game && this.game.draw) {
                        this.game.draw();
                    }
                    requestAnimationFrame(animate);
                } else {
                    // Animation complete - remove item
                    item.consumed = true;
                    this.items = this.items.filter(i => i !== item);
                    pig.isEating = false;
                    
                    // Final render
                    if (this.game && this.game.draw) {
                        this.game.draw();
                    }
                }
            };
            
            // Start animation
            animate();
        }
    }
    
    showMission(pig) {
        // Show mission dialog
        document.getElementById('missionPigName').textContent = pig.name;
        document.getElementById('missionText').textContent = pig.mission;
        document.getElementById('progressText').textContent = `Voortgang: ${pig.missionProgress}/${pig.missionTarget}`;
        
        // Update progress bar
        const progressPercentage = (pig.missionProgress / pig.missionTarget) * 100;
        const progressFill = document.getElementById('progressFill');
        
        // Reset transition and width first
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        
        // Force reflow
        progressFill.offsetHeight;
        
        // Now animate to the correct width
        progressFill.style.transition = 'width 0.5s ease-in-out';
        progressFill.style.width = progressPercentage + '%';
        progressFill.style.backgroundColor = ''; // Reset to default color
        
        // Show modal
        this.missionModal.classList.remove('hidden');
        
        // Store reference to current mission pig
        this.currentMissionPig = pig;
    }
    
    updateMissionModal() {
        if (this.currentMissionPig && !this.missionModal.classList.contains('hidden')) {
            console.log('Updating mission modal for:', this.currentMissionPig.name);
            console.log('Progress:', this.currentMissionPig.missionProgress, '/', this.currentMissionPig.missionTarget);
            
            // Update progress text
            const progressText = document.getElementById('progressText');
            if (progressText) {
                progressText.textContent = `Voortgang: ${this.currentMissionPig.missionProgress}/${this.currentMissionPig.missionTarget}`;
            } else {
                console.error('progressText element not found!');
            }
            
            // Update progress bar with animation
            const progressPercentage = (this.currentMissionPig.missionProgress / this.currentMissionPig.missionTarget) * 100;
            const progressFill = document.getElementById('progressFill');
            
            if (progressFill) {
                console.log('Setting progress bar to:', progressPercentage + '%');
                // Add transition for smooth animation
                progressFill.style.transition = 'width 0.5s ease-in-out';
                progressFill.style.width = progressPercentage + '%';
                
                // Check if mission is complete
                if (this.currentMissionPig.missionProgress >= this.currentMissionPig.missionTarget) {
                    setTimeout(() => {
                        progressFill.style.backgroundColor = '#4CAF50';
                    }, 500);
                }
            } else {
                console.error('progressFill element not found!');
            }
        }
    }
    
    createItemDisappearAnimation(item) {
        // Create a visual effect for item disappearing
        const animationDuration = 500; // milliseconds
        const startTime = Date.now();
        
        // Store original position
        const originalX = item.x;
        const originalY = item.y;
        
        // Animation function
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // Move item towards pig's mouth with a curve
            item.y = originalY - (progress * 30); // Move up
            item.scale = 1 - (progress * 0.5); // Shrink
            item.opacity = 1 - progress; // Fade out
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    completeMission(pig) {
        console.log(`Mission completed for ${pig.name}!`);
        
        // Update mission modal to show completion
        this.updateMissionModal();
        
        // Show completion in modal if it's open
        if (this.currentMissionPig && this.currentMissionPig.id === pig.id && !this.missionModal.classList.contains('hidden')) {
            const progressFill = document.getElementById('progressFill');
            if (progressFill) {
                progressFill.style.width = '100%';
                progressFill.style.backgroundColor = '#4CAF50';
            }
            
            const missionText = document.getElementById('missionText');
            if (missionText) {
                missionText.innerHTML = pig.mission + '<br><strong style="color: #4CAF50;">✓ Voltooid!</strong>';
            }
        }
        
        // Show heart emoticon and happy message
        if (this.game.ui && this.game.ui.showNotification) {
            this.game.ui.showNotification(`💖 ${pig.name} is heel blij! 💖`);
        }
        
        // Add heart effect to the guinea pig
        pig.showHeart = true;
        setTimeout(() => {
            pig.showHeart = false;
        }, 3000); // Show heart for 3 seconds
        
        this.game.player.carrots += 50; // Reward
        
        // Update UI immediately
        if (this.game.ui) {
            this.game.ui.updateDisplay();
        }
        
        // Force re-render
        if (this.game && this.game.draw) {
            this.game.draw();
        }
        
        // Wait a bit before giving new mission
        setTimeout(() => {
            // Give new mission
            const newMissions = [
                { mission: 'Ik wil graag 2 komkommers!', item: 'cucumber', target: 2 },
                { mission: 'Breng me een hoed!', item: 'hat', target: 1 },
                { mission: 'Ik heb 3 mais nodig!', item: 'corn', target: 3 },
                { mission: 'Help me 2 stukken sla te vinden!', item: 'lettuce', target: 2 },
                { mission: 'Ik heb zo\'n honger! Breng me 3 wortels!', item: 'carrot', target: 3 }
            ];
            
            const newMission = newMissions[Math.floor(Math.random() * newMissions.length)];
            pig.mission = newMission.mission;
            pig.missionItem = newMission.item;
            pig.missionTarget = newMission.target;
            pig.missionProgress = 0;
            
            // Save the new mission
            this.saveProgress();
            
            // Update the mission modal if it's still open
            if (this.currentMissionPig === pig && !this.missionModal.classList.contains('hidden')) {
                document.getElementById('missionText').textContent = pig.mission;
                this.updateMissionModal();
            }
            
            // Show notification about new mission
            if (this.game.ui && this.game.ui.showNotification) {
                this.game.ui.showNotification(`${pig.name} heeft een nieuwe missie!`);
            }
        }, 3000); // Give new mission after 3 seconds
    }
    
    startWaterBathGame(pig) {
        console.log('Starting water bath game with:', pig.name);
        
        // Create a simple water bath minigame
        const modal = document.createElement('div');
        modal.className = 'minigame-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const gameContainer = document.createElement('div');
        gameContainer.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 15px;
            position: relative;
            max-width: 500px;
            width: 90%;
        `;
        
        gameContainer.innerHTML = `
            <h2 style="text-align: center; color: #333; margin-bottom: 10px;">🛁 Waterbad Minigame - ${pig.name} 🛁</h2>
            <p style="text-align: center; color: #666; margin-bottom: 20px;">Help ${pig.name} een lekker badje nemen!</p>
            <div id="bathGameContainer" style="text-align: center; margin: 20px 0;">
                <canvas id="bathGameCanvas" width="400" height="300" style="border: 2px solid #4ECDC4; border-radius: 10px; max-width: 100%;"></canvas>
            </div>
            <p id="bathGameInstructions" style="text-align: center; color: #666;">Klik op de bubbels om ze te laten knappen! 🫧</p>
            <p id="bathGameScore" style="text-align: center; font-size: 20px; color: #333; font-weight: bold;">Score: 0</p>
            <button id="closeBathGame" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: #E53E3E;
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 20px;
                cursor: pointer;
            ">✖</button>
        `;
        
        modal.appendChild(gameContainer);
        document.body.appendChild(modal);
        
        const canvas = document.getElementById('bathGameCanvas');
        const ctx = canvas.getContext('2d');
        let score = 0;
        let bubbles = [];
        let gameActive = true;
        
        // Create bubbles
        function createBubble() {
            bubbles.push({
                x: Math.random() * (canvas.width - 40) + 20,
                y: canvas.height,
                radius: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 1,
                popped: false
            });
        }
        
        // Game loop
        function gameLoop() {
            if (!gameActive) return;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw water
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
            
            // Draw guinea pig in bath
            ctx.fillStyle = pig.color.body;
            ctx.beginPath();
            ctx.ellipse(canvas.width / 2, canvas.height * 0.65, 40, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw bubbles
            bubbles = bubbles.filter(bubble => {
                if (bubble.popped || bubble.y < -bubble.radius) return false;
                
                bubble.y -= bubble.speed;
                
                // Draw bubble
                ctx.strokeStyle = '#4ECDC4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.stroke();
                
                // Add shine
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                return true;
            });
            
            // Create new bubbles randomly
            if (Math.random() < 0.03) {
                createBubble();
            }
            
            requestAnimationFrame(gameLoop);
        }
        
        // Handle clicks
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            bubbles.forEach(bubble => {
                const dist = Math.sqrt(Math.pow(x - bubble.x, 2) + Math.pow(y - bubble.y, 2));
                if (dist < bubble.radius && !bubble.popped) {
                    bubble.popped = true;
                    score++;
                    document.getElementById('bathGameScore').textContent = `Score: ${score}`;
                    
                    // Add pop effect
                    ctx.fillStyle = 'rgba(78, 205, 196, 0.3)';
                    ctx.beginPath();
                    ctx.arc(bubble.x, bubble.y, bubble.radius * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        });
        
        // Close button
        document.getElementById('closeBathGame').addEventListener('click', () => {
            gameActive = false;
            modal.remove();
            
            // Give reward based on score
            if (score > 0) {
                const reward = score * 2;
                this.game.player.carrots += reward;
                this.game.ui.updateDisplay();
                this.game.ui.showNotification(`${pig.name} heeft genoten van het badje! Je krijgt ${reward} wortels! 🛁✨`);
                
                // Add temporary happiness effect to pig
                pig.showHeart = true;
                setTimeout(() => {
                    pig.showHeart = false;
                }, 3000);
            }
        });
        
        // Start the game
        gameLoop();
    }
    
    startMazeGame() {
        // Create maze minigame modal
        const modal = document.createElement('div');
        modal.className = 'minigame-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const gameContainer = document.createElement('div');
        gameContainer.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 15px;
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        // Title
        const title = document.createElement('h2');
        title.textContent = '🌀 Doolhof Spel - Help je cavia de uitgang vinden! 🌀';
        title.style.cssText = `
            text-align: center;
            color: #333;
            margin-bottom: 20px;
        `;
        gameContainer.appendChild(title);
        
        // Create maze canvas
        const mazeCanvas = document.createElement('canvas');
        mazeCanvas.width = 600;
        mazeCanvas.height = 600;
        mazeCanvas.style.cssText = `
            border: 3px solid #333;
            cursor: pointer;
            display: block;
            margin: 0 auto;
        `;
        gameContainer.appendChild(mazeCanvas);
        
        // Score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.style.cssText = `
            text-align: center;
            font-size: 20px;
            margin-top: 10px;
            color: #333;
        `;
        scoreDisplay.textContent = 'Tijd: 0s';
        gameContainer.appendChild(scoreDisplay);
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #E53E3E;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
        `;
        
        gameContainer.appendChild(closeBtn);
        modal.appendChild(gameContainer);
        document.body.appendChild(modal);
        
        // Maze game logic
        const ctx = mazeCanvas.getContext('2d');
        const cellSize = 30;
        const mazeWidth = 20;
        const mazeHeight = 20;
        
        // Simple maze generation
        const maze = [];
        for (let y = 0; y < mazeHeight; y++) {
            maze[y] = [];
            for (let x = 0; x < mazeWidth; x++) {
                // Create walls and paths
                if (x === 0 || y === 0 || x === mazeWidth - 1 || y === mazeHeight - 1) {
                    maze[y][x] = 1; // Wall
                } else if (Math.random() < 0.3 && !(x === 1 && y === 1) && !(x === mazeWidth - 2 && y === mazeHeight - 2)) {
                    maze[y][x] = 1; // Random walls
                } else {
                    maze[y][x] = 0; // Path
                }
            }
        }
        
        // Ensure start and end are clear
        maze[1][1] = 0;
        maze[mazeHeight - 2][mazeWidth - 2] = 0;
        
        // Create a clear path from start to end
        let pathX = 1, pathY = 1;
        while (pathX < mazeWidth - 2 || pathY < mazeHeight - 2) {
            maze[pathY][pathX] = 0;
            if (Math.random() < 0.5 && pathX < mazeWidth - 2) {
                pathX++;
            } else if (pathY < mazeHeight - 2) {
                pathY++;
            } else {
                pathX++;
            }
            maze[pathY][pathX] = 0;
        }
        
        // Player position
        let playerX = 1;
        let playerY = 1;
        let startTime = Date.now();
        let gameWon = false;
        
        // Draw maze function
        const drawMaze = () => {
            ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
            
            // Draw maze
            for (let y = 0; y < mazeHeight; y++) {
                for (let x = 0; x < mazeWidth; x++) {
                    if (maze[y][x] === 1) {
                        // Wall
                        ctx.fillStyle = '#2D3748';
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    } else {
                        // Path
                        ctx.fillStyle = '#F7FAFC';
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    }
                }
            }
            
            // Draw exit
            ctx.fillStyle = '#48BB78';
            ctx.fillRect((mazeWidth - 2) * cellSize, (mazeHeight - 2) * cellSize, cellSize, cellSize);
            ctx.fillStyle = '#FFF';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🏁', (mazeWidth - 2) * cellSize + cellSize/2, (mazeHeight - 2) * cellSize + cellSize/2 + 5);
            
            // Draw player (guinea pig)
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.arc(playerX * cellSize + cellSize/2, playerY * cellSize + cellSize/2, cellSize/3, 0, Math.PI * 2);
            ctx.fill();
            
            // Update time
            if (!gameWon) {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                scoreDisplay.textContent = `Tijd: ${elapsed}s`;
            }
        };
        
        // Handle movement
        const movePlayer = (dx, dy) => {
            if (gameWon) return;
            
            const newX = playerX + dx;
            const newY = playerY + dy;
            
            // Check bounds and walls
            if (newX >= 0 && newX < mazeWidth && newY >= 0 && newY < mazeHeight && maze[newY][newX] === 0) {
                playerX = newX;
                playerY = newY;
                
                // Check if reached exit
                if (playerX === mazeWidth - 2 && playerY === mazeHeight - 2) {
                    gameWon = true;
                    const finalTime = Math.floor((Date.now() - startTime) / 1000);
                    scoreDisplay.textContent = `🎉 Gewonnen! Tijd: ${finalTime}s 🎉`;
                    
                    // Reward
                    this.game.player.carrots += 20;
                    if (this.game.ui) {
                        this.game.ui.updateDisplay();
                        this.game.ui.showNotification('🎉 Je hebt het doolhof uitgespeeld! +20 wortels! 🎉');
                    }
                }
                
                drawMaze();
            }
        };
        
        // Keyboard controls
        const handleKeyPress = (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    movePlayer(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    movePlayer(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    movePlayer(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    movePlayer(1, 0);
                    break;
            }
        };
        
        // Touch/click controls
        mazeCanvas.addEventListener('click', (e) => {
            const rect = mazeCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cellX = Math.floor(x / cellSize);
            const cellY = Math.floor(y / cellSize);
            
            // Move towards clicked cell
            if (cellX > playerX) movePlayer(1, 0);
            else if (cellX < playerX) movePlayer(-1, 0);
            else if (cellY > playerY) movePlayer(0, 1);
            else if (cellY < playerY) movePlayer(0, -1);
        });
        
        window.addEventListener('keydown', handleKeyPress);
        
        // Close button functionality
        closeBtn.addEventListener('click', () => {
            window.removeEventListener('keydown', handleKeyPress);
            modal.remove();
        });
        
        // Initial draw
        drawMaze();
    }
    
    checkPlayerInWheel() {
        const wheel = this.items.find(item => item.id === 'wheel');
        if (!wheel || wheel.consumed) return false;
        
        const distance = Math.sqrt(
            Math.pow(this.game.player.x - (wheel.x + 100), 2) + 
            Math.pow(this.game.player.y - (wheel.y + 100), 2)
        );
        
        return distance < 80; // Player is in the wheel
    }
    
    update() {
        // Remove consumed items from the items array
        this.items = this.items.filter(item => !item.consumed);
    }

    saveProgress() {
        localStorage.setItem('otherGuineaPigs', JSON.stringify(this.otherGuineaPigs));
        console.log('Guinea pig progress saved.');
    }

    loadProgress() {
        const savedPigs = localStorage.getItem('otherGuineaPigs');
        if (savedPigs) {
            try {
                const savedData = JSON.parse(savedPigs);
                // Merge saved progress with default data
                this.otherGuineaPigs.forEach((pig, index) => {
                    const savedPig = savedData.find(sp => sp.id === pig.id);
                    if (savedPig) {
                        pig.missionProgress = savedPig.missionProgress || 0;
                        pig.accessory = savedPig.accessory || null;
                        pig.showHeart = savedPig.showHeart || false;
                    }
                });
                console.log('Guinea pig progress loaded:', this.otherGuineaPigs);
            } catch (e) {
                console.error('Error loading progress:', e);
            }
        }
    }
}