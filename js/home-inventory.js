// Home Inventory module - handles items in the home world
import { CONFIG } from './config.js';

export class HomeInventory {
    constructor(game) {
        this.game = game;
        this.items = [];
        this.otherGuineaPigs = [];
        this.draggedItem = null;
        this.missionModal = null;
        this.setupOtherGuineaPigs();
        this.setupMissionModal();
        this.loadProgress();
    }
    
    setupOtherGuineaPigs() {
        // Create 3 other guinea pigs in the home
        this.otherGuineaPigs = [
            {
                id: 1,
                name: 'Ginger',
                x: 300,
                y: 500,
                color: '#8B4513',
                mission: 'Ik heb zo\'n honger! Breng me 3 wortels!',
                missionProgress: 0,
                missionTarget: 3,
                missionItem: 'carrot',
                accessory: null
            },
            {
                id: 2,
                name: 'Chinto',
                x: 700,
                y: 520,
                color: '#FFFFFF',
                mission: 'Ik wil graag een mooie strik!',
                missionProgress: 0,
                missionTarget: 1,
                missionItem: 'bow',
                accessory: null
            },
            {
                id: 3,
                name: 'Luxy',
                x: 1100,
                y: 510,
                color: '#696969',
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
                <button class="close-btn" id="closeMission">✖</button>
            </div>
        `;
        document.body.appendChild(this.missionModal);
        
        // Event listener for close button
        document.getElementById('closeMission').addEventListener('click', () => {
            this.missionModal.classList.add('hidden');
        });
        
        // Close on escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.missionModal.classList.contains('hidden')) {
                this.missionModal.classList.add('hidden');
            }
        });
    }
    
    addItem(itemData) {
        const item = {
            ...itemData,
            x: 100 + Math.random() * (CONFIG.WORLD_WIDTH - 200),
            y: 400 + Math.random() * 200,
            consumed: false
        };
        
        // Special handling for interactive items
        if (item.id === 'wheel') {
            item.x = CONFIG.WORLD_WIDTH / 2 - 100;
            item.y = 350;
            item.rotation = 0;
        } else if (item.id === 'tunnel') {
            item.x = 900;
            item.y = 450;
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
    
    draw(ctx) {
        // Draw items
        this.items.forEach(item => {
            if (!item.consumed) {
                ctx.save();
                
                // Check if this item is being dragged
                const isDragging = this.draggedItem === item;
                
                // Check if dragged item is over a guinea pig
                let isOverGuineaPig = false;
                if (isDragging) {
                    isOverGuineaPig = this.otherGuineaPigs.some(pig => {
                        const distance = Math.sqrt(Math.pow(item.x - pig.x, 2) + Math.pow(item.y - pig.y, 2));
                        return distance < 60;
                    });
                }
                
                // Apply scale if dragging or over guinea pig
                if (isDragging) {
                    const scale = isOverGuineaPig ? 1.3 : 1.1;
                    ctx.translate(item.x, item.y);
                    ctx.scale(scale, scale);
                    ctx.translate(-item.x, -item.y);
                }
                
                if (item.id === 'wheel') {
                    // Draw giant wheel
                    ctx.translate(item.x + 100, item.y + 100);
                    ctx.rotate(item.rotation);
                    
                    // Wheel structure
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 8;
                    ctx.beginPath();
                    ctx.arc(0, 0, 100, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Spokes
                    for (let i = 0; i < 8; i++) {
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(Math.cos(i * Math.PI / 4) * 100, Math.sin(i * Math.PI / 4) * 100);
                        ctx.stroke();
                    }
                    
                    // Running surface
                    ctx.fillStyle = '#DEB887';
                    for (let i = 0; i < 8; i++) {
                        ctx.fillRect(Math.cos(i * Math.PI / 4) * 80 - 10, Math.sin(i * Math.PI / 4) * 80 - 5, 20, 10);
                    }
                    
                    item.rotation += 0.02; // Rotate the wheel
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
            }
        });
        
        // Draw other guinea pigs
        this.otherGuineaPigs.forEach(pig => {
            ctx.save();
            ctx.translate(pig.x, pig.y);
            
            // Draw guinea pig body
            ctx.fillStyle = pig.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Head
            ctx.beginPath();
            ctx.arc(-25, -10, 20, 0, Math.PI * 2);
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
                ctx.fillText(`${pig.missionProgress}/${pig.missionTarget}`, 0, -35);
            }
            
            // Heart effect when happy
            if (pig.showHeart) {
                ctx.save();
                // Animate the heart floating up
                const heartY = -70 - (Date.now() % 3000) / 30; // Float up over 3 seconds
                ctx.font = '30px Arial';
                ctx.fillText('💖', 0, heartY);
                ctx.restore();
            }
            
            // Eating animation
            if (pig.isEating) {
                ctx.save();
                // Show munching effect
                const munchScale = 1 + Math.sin(Date.now() * 0.01) * 0.1;
                ctx.scale(munchScale, munchScale);
                ctx.font = '20px Arial';
                ctx.fillText('😋', -25, -35);
                ctx.restore();
            }
            
            ctx.restore();
        });
    }
    
    handleClick(x, y) {
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
        
        // Check if clicking on other guinea pigs
        const clickedPig = this.otherGuineaPigs.find(pig => {
            const distance = Math.sqrt(Math.pow(x - pig.x, 2) + Math.pow(y - pig.y, 2));
            return distance < 50;
        });
        
        if (clickedPig) {
            this.showMission(clickedPig);
            return true;
        }
        
        return false;
    }
    
    handleDragStart(x, y) {
        // Check if clicking on an item to drag it
        const clickedItem = this.items.find(item => {
            if (item.consumed) return false;
            
            const distance = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
            return distance < 40;
        });
        
        if (clickedItem && !clickedItem.consumed) {
            this.draggedItem = clickedItem;
            console.log('Started dragging item:', clickedItem.id, clickedItem.name);
            return true;
        }
        
        return false;
    }
    
    handleDragMove(x, y) {
        if (this.draggedItem) {
            this.draggedItem.x = x;
            this.draggedItem.y = y;
        }
    }
    
    handleDragEnd(x, y) {
        if (!this.draggedItem) return;
        
        console.log('Drag ended at:', x, y);
        console.log('Dragged item:', this.draggedItem);
        
        // Check if dropped on another guinea pig
        const targetPig = this.otherGuineaPigs.find(pig => {
            const distance = Math.sqrt(Math.pow(x - pig.x, 2) + Math.pow(y - pig.y, 2));
            console.log(`Distance to ${pig.name}: ${distance}`);
            return distance < 50;
        });
        
        console.log('Target pig:', targetPig);
        
        if (targetPig) {
            if (this.isEdible(this.draggedItem.id)) {
                console.log('Item is edible:', this.draggedItem.id);
                console.log('Pig wants:', targetPig.missionItem);
                console.log('Current progress:', targetPig.missionProgress, '/', targetPig.missionTarget);
                
                // Feed the guinea pig
                this.draggedItem.consumed = true;
                this.showEatingAnimation(this.draggedItem, targetPig);
                
                // Check mission progress
                if (targetPig.missionItem === this.draggedItem.id) {
                    targetPig.missionProgress++;
                    console.log(`Mission progress updated: ${targetPig.name} - ${targetPig.missionProgress}/${targetPig.missionTarget}`);
                    
                    // Save progress
                    this.saveProgress();
                    
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
                }
            } else if (this.isAccessory(this.draggedItem.id)) {
                // Put accessory on guinea pig
                targetPig.accessory = this.draggedItem.id;
                this.draggedItem.consumed = true;
                
                // Check mission progress
                if (targetPig.missionItem === this.draggedItem.id) {
                    this.completeMission(targetPig);
                }
            }
        }
        
        this.draggedItem = null;
    }
    
    isEdible(itemId) {
        const edibleItems = ['carrot', 'lettuce', 'cucumber', 'corn', 'hay_small', 'hay_medium', 'hay_large', 'hay_premium'];
        return edibleItems.includes(itemId);
    }
    
    isAccessory(itemId) {
        const accessories = ['bow', 'hat', 'glasses', 'necklace'];
        return accessories.includes(itemId);
    }
    
    showEatingAnimation(item, pig = null) {
        // Simple eating animation feedback
        const target = pig || this.game.player;
        
        // Show eating animation on the guinea pig
        if (pig) {
            pig.isEating = true;
            setTimeout(() => {
                pig.isEating = false;
            }, 1000);
            
            // Show notification about eating
            if (this.game.ui && this.game.ui.showNotification) {
                this.game.ui.showNotification(`${pig.name} eet ${item.name}! 😊`);
            }
        }
    }
    
    showMission(pig) {
        // Show mission dialog
        document.getElementById('missionPigName').textContent = pig.name;
        document.getElementById('missionText').textContent = pig.mission;
        document.getElementById('progressText').textContent = `Voortgang: ${pig.missionProgress}/${pig.missionTarget}`;
        
        // Update progress bar
        const progressPercentage = (pig.missionProgress / pig.missionTarget) * 100;
        document.getElementById('progressFill').style.width = progressPercentage + '%';
        
        // Show modal
        this.missionModal.classList.remove('hidden');
    }
    
    completeMission(pig) {
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
        
        // Give new mission
        const newMissions = [
            { mission: 'Ik wil graag 2 komkommers!', item: 'cucumber', target: 2 },
            { mission: 'Breng me een hoed!', item: 'hat', target: 1 },
            { mission: 'Ik heb 3 mais nodig!', item: 'corn', target: 3 }
        ];
        
        const newMission = newMissions[Math.floor(Math.random() * newMissions.length)];
        pig.mission = newMission.mission;
        pig.missionItem = newMission.item;
        pig.missionTarget = newMission.target;
        pig.missionProgress = 0;
    }
    
    startMazeGame() {
        alert('Doolhof spel! Tap om je cavia door het doolhof te leiden!');
        // TODO: Implement maze mini-game
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
        
        // Update wheel rotation if it exists
        const wheel = this.items.find(item => item.id === 'wheel');
        if (wheel && this.checkPlayerInWheel()) {
            wheel.rotation += 0.05;
        }
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