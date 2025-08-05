// Home Item Manager module - handles item placement, dragging, and organization
import { CONFIG, UI_CONFIG, GAME_CONFIG } from './config.js';

export class HomeItemManager {
    constructor(game) {
        this.game = game;
        this.items = [];
        this.draggedItem = null;
        this.dragOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStartTime = 0;
        this.loadItems();
    }

    addItem(itemData) {
        // Calculate grid position to prevent overlapping
        const gridColumns = UI_CONFIG.GRID_COLUMNS;
        const gridSpacing = UI_CONFIG.GRID_SPACING;
        const startX = 200;
        const startY = 480;
        
        // Find the next available position
        const existingPositions = this.items.map(item => ({ x: item.x, y: item.y }));
        
        // Also consider guinea pig positions if available
        const guineaPigPositions = this.game.guineaPigMissions ? 
            this.game.guineaPigMissions.otherGuineaPigs.map(pig => ({ x: pig.x, y: pig.y })) : [];
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
            
            if (!isOccupied) {
                break;
            }
            
            gridIndex++;
            
            // Prevent infinite loop - if we've checked too many positions, just place it
            if (gridIndex > 100) {
                x = startX + Math.random() * 800;
                y = startY + Math.random() * 200;
                break;
            }
        }
        
        const item = {
            ...itemData,
            x: x,
            y: y,
            rotation: 0,
            scale: 1
        };
        
        this.items.push(item);
        this.saveItems();
        return item;
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            this.saveItems();
        }
    }

    reorganizeItems() {
        const gridColumns = UI_CONFIG.GRID_COLUMNS;
        const gridSpacing = UI_CONFIG.GRID_SPACING;
        const startX = 200;
        const startY = 480;
        
        // Sort items by type for better organization
        this.items.sort((a, b) => {
            if (a.type === b.type) return 0;
            return a.type < b.type ? -1 : 1;
        });
        
        // Animate items to new positions
        this.items.forEach((item, index) => {
            const col = index % gridColumns;
            const row = Math.floor(index / gridColumns);
            const targetX = startX + (col * gridSpacing);
            const targetY = startY + (row * gridSpacing);
            
            // Store original position
            item.animateFromX = item.x;
            item.animateFromY = item.y;
            item.animateToX = targetX;
            item.animateToY = targetY;
            item.animateStartTime = Date.now();
            item.animating = true;
        });
        
        // Save after reorganization
        setTimeout(() => {
            this.items.forEach(item => {
                item.x = item.animateToX;
                item.y = item.animateToY;
                item.animating = false;
            });
            this.saveItems();
        }, GAME_CONFIG.REORGANIZE_ANIMATION_DURATION);
    }

    updateAnimations() {
        this.items.forEach(item => {
            if (item.animating) {
                const elapsed = Date.now() - item.animateStartTime;
                const progress = Math.min(elapsed / GAME_CONFIG.REORGANIZE_ANIMATION_DURATION, 1);
                
                // Ease-out animation
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                item.x = item.animateFromX + (item.animateToX - item.animateFromX) * easeOut;
                item.y = item.animateFromY + (item.animateToY - item.animateFromY) * easeOut;
                
                if (progress >= 1) {
                    item.animating = false;
                }
            }
        });
    }

    handleDragStart(x, y) {
        // Check if clicking on an item
        for (const item of this.items) {
            if (this.isPointInItem(x, y, item)) {
                this.draggedItem = item;
                this.dragOffset.x = x - item.x;
                this.dragOffset.y = y - item.y;
                this.isDragging = true;
                this.dragStartTime = Date.now();
                
                // Move dragged item to end of array so it renders on top
                const index = this.items.indexOf(item);
                this.items.splice(index, 1);
                this.items.push(item);
                
                return true;
            }
        }
        return false;
    }

    handleDragMove(x, y) {
        if (this.draggedItem && this.isDragging) {
            this.draggedItem.x = x - this.dragOffset.x;
            this.draggedItem.y = y - this.dragOffset.y;
        }
    }

    handleDragEnd(x, y) {
        if (this.draggedItem) {
            // Check if dropped on a guinea pig (for missions)
            if (this.game.guineaPigMissions) {
                for (const pig of this.game.guineaPigMissions.otherGuineaPigs) {
                    // Check if pig is close enough
                    const distance = Math.sqrt(Math.pow(x - pig.x, 2) + Math.pow(y - pig.y, 2));
                    if (distance < 60) {
                        // Try to give item to pig for mission
                        if (this.game.guineaPigMissions.handleMissionItem(this.draggedItem, pig)) {
                            // Remove the item if it was used for the mission
                            this.items = this.items.filter(item => item !== this.draggedItem);
                            this.saveItems();
                            this.game.ui.updateDisplay();
                        } else {
                            // Item not needed for mission
                            this.game.ui.showNotification('Deze cavia heeft dit item niet nodig!');
                            // Return item to original position
                            this.draggedItem.x = this.dragStartX;
                            this.draggedItem.y = this.dragStartY;
                        }
                        return;
                    }
                }
            }
            
            // Save new position
            this.saveItems();
            this.draggedItem = null;
            this.isDragging = false;
        }
    }

    isPointInItem(x, y, item) {
        const size = UI_CONFIG.ITEM_SIZE;
        return x >= item.x - size/2 && x <= item.x + size/2 &&
               y >= item.y - size/2 && y <= item.y + size/2;
    }

    drawItems(ctx, camera) {
        this.items.forEach(item => {
            ctx.save();
            // Don't apply camera offset here - it's already applied by game's camera transform
            ctx.translate(item.x, item.y);
            
            // Apply scale for dragged item
            if (item === this.draggedItem) {
                ctx.scale(UI_CONFIG.HOVER_SCALE, UI_CONFIG.HOVER_SCALE);
            }
            
            // Draw shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(0, 5, 30, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw item based on type
            this.drawItemByType(ctx, item);
            
            ctx.restore();
        });
    }

    drawItemByType(ctx, item) {
        const size = UI_CONFIG.ITEM_SIZE;
        
        switch(item.type) {
            case 'carrot':
                // Draw carrot
                ctx.fillStyle = '#FF6B35';
                ctx.beginPath();
                ctx.moveTo(0, -size/2);
                ctx.lineTo(-size/4, size/2);
                ctx.lineTo(size/4, size/2);
                ctx.closePath();
                ctx.fill();
                
                // Carrot leaves
                ctx.fillStyle = '#228B22';
                ctx.beginPath();
                ctx.arc(0, -size/2, size/4, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'lettuce':
                // Draw lettuce
                ctx.fillStyle = '#90EE90';
                ctx.beginPath();
                ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                ctx.fill();
                
                // Inner leaves
                ctx.fillStyle = '#228B22';
                ctx.beginPath();
                ctx.arc(0, 0, size/3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'bow':
                // Draw bow
                ctx.fillStyle = item.color || '#FF69B4';
                ctx.beginPath();
                ctx.moveTo(-size/2, 0);
                ctx.lineTo(0, -size/3);
                ctx.lineTo(size/2, 0);
                ctx.lineTo(size/3, size/3);
                ctx.lineTo(0, size/4);
                ctx.lineTo(-size/3, size/3);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'hat':
                // Draw hat
                ctx.fillStyle = item.color || '#4B0082';
                ctx.fillRect(-size/2, 0, size, size/4);
                ctx.fillRect(-size/3, -size/2, size*2/3, size/2);
                break;
                
            case 'glasses':
                // Draw glasses
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(-size/4, 0, size/4, 0, Math.PI * 2);
                ctx.arc(size/4, 0, size/4, 0, Math.PI * 2);
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 0);
                ctx.stroke();
                break;
                
            case 'ball':
                // Draw ball
                ctx.fillStyle = item.color || '#FF0000';
                ctx.beginPath();
                ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                ctx.fill();
                
                // Ball pattern
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                ctx.moveTo(-size/2, 0);
                ctx.lineTo(size/2, 0);
                ctx.stroke();
                break;
                
            case 'house':
                // Draw small house
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-size/2, 0, size, size/2);
                
                // Roof
                ctx.fillStyle = '#DC143C';
                ctx.beginPath();
                ctx.moveTo(-size/2 - 10, 0);
                ctx.lineTo(0, -size/2);
                ctx.lineTo(size/2 + 10, 0);
                ctx.closePath();
                ctx.fill();
                
                // Door
                ctx.fillStyle = '#654321';
                ctx.fillRect(-size/6, size/4, size/3, size/4);
                break;
                
            case 'bed':
                // Draw bed
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-size/2, 0, size, size/3);
                
                // Pillow
                ctx.fillStyle = '#FFB6C1';
                ctx.fillRect(-size/2 + 5, -size/6, size/3, size/4);
                
                // Blanket
                ctx.fillStyle = '#87CEEB';
                ctx.fillRect(-size/2 + size/3, -size/8, size*2/3 - 5, size/2);
                break;
                
            default:
                // Generic item
                ctx.fillStyle = '#999';
                ctx.fillRect(-size/2, -size/2, size, size);
                break;
        }
        
        // Draw item name on hover
        if (item === this.draggedItem || this.isMouseOverItem(item)) {
            ctx.fillStyle = 'black';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.name || item.type, 0, -size/2 - 10);
        }
    }

    isMouseOverItem(item) {
        if (!this.game.mouseX || !this.game.mouseY) return false;
        const worldX = this.game.mouseX + this.game.camera.x;
        const worldY = this.game.mouseY + this.game.camera.y;
        return this.isPointInItem(worldX, worldY, item);
    }

    saveItems() {
        const saveData = {
            items: this.items.map(item => ({
                type: item.type,
                name: item.name,
                x: item.x,
                y: item.y,
                color: item.color
            }))
        };
        localStorage.setItem('homeItems', JSON.stringify(saveData));
    }

    loadItems() {
        const savedData = localStorage.getItem('homeItems');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.items) {
                    this.items = data.items;
                }
            } catch (e) {
                console.error('Failed to load home items:', e);
            }
        }
    }
}