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
            this.currentMissionPig = null;
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
        // Draw floor
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, CONFIG.WORLD_HEIGHT - 100, CONFIG.WORLD_WIDTH, 100);
        
        // Draw walls
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 100);
        
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
            
            // Apply scale if dragging or animating
            if (isDragging) {
                const scale = 1.1;
                ctx.translate(item.x, item.y);
                ctx.scale(scale, scale);
                ctx.translate(-item.x, -item.y);
                ctx.globalAlpha = 0.8; // Make slightly transparent when dragging
            } else if (item.scale || item.opacity) {
                // Apply animation properties
                const scale = item.scale || 1;
                const opacity = item.opacity !== undefined ? item.opacity : 1;
                ctx.translate(item.x, item.y);
                ctx.scale(scale, scale);
                ctx.translate(-item.x, -item.y);
                ctx.globalAlpha = opacity;
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
        });
    }
    
    handleClick(x, y) {
        console.log('Click at:', x, y);
        
        // Don't handle clicks if we're dragging
        if (this.isDragging) {
            return false;
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
                
                // Feed the guinea pig
                this.draggedItem.consumed = true;
                this.showEatingAnimation(this.draggedItem, targetPig);
                
                // Check mission progress
                if (targetPig.missionItem === this.draggedItem.id) {
                    targetPig.missionProgress++;
                    console.log(`Mission progress updated: ${targetPig.name} - ${targetPig.missionProgress}/${targetPig.missionTarget}`);
                    
                    // Save progress immediately
                    this.saveProgress();
                    
                    // Update mission modal if open with immediate visual feedback
                    if (this.currentMissionPig && this.currentMissionPig.id === targetPig.id) {
                        this.updateMissionModal();
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
                
                // Remove consumed item from array immediately
                this.items = this.items.filter(item => item !== this.draggedItem);
            } else if (this.isAccessory(this.draggedItem.id)) {
                // Put accessory on guinea pig
                targetPig.accessory = this.draggedItem.id;
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
                
                // Remove consumed item from array immediately
                this.items = this.items.filter(item => item !== this.draggedItem);
            }
        }
        
        // Reset dragging state
        this.draggedItem = null;
        this.isDragging = false;
    }
    
    isEdible(itemId) {
        const edibleItems = ['carrot', 'lettuce', 'cucumber', 'corn', 'hay_small', 'hay_medium', 'hay_large', 'hay_premium'];
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
            
            // Create disappearing animation for the item
            this.createItemDisappearAnimation(item);
            
            setTimeout(() => {
                pig.isEating = false;
                // Remove the item from the items array after animation completes
                this.items = this.items.filter(i => i !== item);
            }, 500);
            
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
            // Update progress text
            document.getElementById('progressText').textContent = `Voortgang: ${this.currentMissionPig.missionProgress}/${this.currentMissionPig.missionTarget}`;
            
            // Update progress bar with animation
            const progressPercentage = (this.currentMissionPig.missionProgress / this.currentMissionPig.missionTarget) * 100;
            const progressFill = document.getElementById('progressFill');
            
            // Add transition for smooth animation
            progressFill.style.transition = 'width 0.5s ease-in-out';
            progressFill.style.width = progressPercentage + '%';
            
            // Check if mission is complete
            if (this.currentMissionPig.missionProgress >= this.currentMissionPig.missionTarget) {
                setTimeout(() => {
                    progressFill.style.backgroundColor = '#4CAF50';
                }, 500);
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
        // Update mission modal to show completion
        this.updateMissionModal();
        
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
        this.game.ui.updateDisplay();
        
        // Wait a bit before giving new mission
        setTimeout(() => {
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
            
            // Update the mission modal if it's still open
            if (this.currentMissionPig === pig && !this.missionModal.classList.contains('hidden')) {
                document.getElementById('missionText').textContent = pig.mission;
                this.updateMissionModal();
            }
            
            // Show notification about new mission
            this.game.ui.showNotification(`${pig.name} heeft een nieuwe missie!`);
        }, 2000); // Give new mission after 2 seconds
    }
    
    startWaterBathGame(pig) {
        console.log('Starting water bath game with:', pig.name);
        
        // Create a simple water bath minigame
        const modal = document.createElement('div');
        modal.className = 'mission-modal';
        modal.innerHTML = `
            <div class="mission-content">
                <h2>🛁 Waterbad Minigame - ${pig.name}</h2>
                <p>Help ${pig.name} een lekker badje nemen!</p>
                <div id="bathGameContainer" style="text-align: center; margin: 20px 0;">
                    <canvas id="bathGameCanvas" width="400" height="300" style="border: 2px solid #4ECDC4; border-radius: 10px;"></canvas>
                </div>
                <p id="bathGameInstructions">Klik op de bubbels om ze te laten knappen! 🫧</p>
                <p id="bathGameScore">Score: 0</p>
                <button id="closeBathGame" class="close-button">Sluiten</button>
            </div>
        `;
        
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
            document.body.removeChild(modal);
            
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