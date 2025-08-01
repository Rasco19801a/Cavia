// Home Inventory module - handles items in the home world
import { CONFIG } from './config.js';

export class HomeInventory {
    constructor(game) {
        this.game = game;
        this.items = [];
        this.otherGuineaPigs = [];
        this.draggedItem = null;
        this.setupOtherGuineaPigs();
    }
    
    setupOtherGuineaPigs() {
        // Create 3 other guinea pigs in the home
        this.otherGuineaPigs = [
            {
                id: 1,
                name: 'Fluffy',
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
                name: 'Snowy',
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
                name: 'Pepper',
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
    }
    
    draw(ctx) {
        // Draw items
        this.items.forEach(item => {
            if (!item.consumed) {
                ctx.save();
                
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
            
            ctx.restore();
        });
    }
    
    handleClick(x, y) {
        // Check if clicking on edible items
        const clickedItem = this.items.find(item => {
            if (item.consumed) return false;
            
            const distance = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
            return distance < 40 && this.isEdible(item.id);
        });
        
        if (clickedItem) {
            // Guinea pig eats the item
            clickedItem.consumed = true;
            this.game.player.health = Math.min(100, this.game.player.health + 10);
            this.showEatingAnimation(clickedItem);
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
        // Check if starting drag on an item
        const draggedItem = this.items.find(item => {
            if (item.consumed || item.id === 'wheel' || item.id === 'tunnel') return false;
            
            const distance = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
            return distance < 40;
        });
        
        if (draggedItem) {
            this.draggedItem = draggedItem;
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
        
        // Check if dropped on another guinea pig
        const targetPig = this.otherGuineaPigs.find(pig => {
            const distance = Math.sqrt(Math.pow(x - pig.x, 2) + Math.pow(y - pig.y, 2));
            return distance < 50;
        });
        
        if (targetPig) {
            if (this.isEdible(this.draggedItem.id)) {
                // Feed the guinea pig
                this.draggedItem.consumed = true;
                this.showEatingAnimation(this.draggedItem, targetPig);
                
                // Check mission progress
                if (targetPig.missionItem === this.draggedItem.id) {
                    targetPig.missionProgress++;
                    if (targetPig.missionProgress >= targetPig.missionTarget) {
                        this.completeMission(targetPig);
                    }
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
        console.log(`${target.name || 'Player'} ate ${item.name}!`);
    }
    
    showMission(pig) {
        // Show mission dialog
        alert(`${pig.name}: "${pig.mission}"\n\nVoortgang: ${pig.missionProgress}/${pig.missionTarget}`);
    }
    
    completeMission(pig) {
        alert(`Missie voltooid! ${pig.name} is heel blij!`);
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
}