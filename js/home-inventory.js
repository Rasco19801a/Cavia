// Home Inventory module - coordinates home world functionality
import { CONFIG, UI_CONFIG, GAME_CONFIG } from './config.js';
import { GuineaPigMissions } from './guinea-pig-missions.js';
import { HomeItemManager } from './home-item-manager.js';

export class HomeInventory {
    constructor(game) {
        this.game = game;
        this.guineaPigMissions = new GuineaPigMissions(game);
        this.itemManager = new HomeItemManager(game);
        
        // Expose missions for game to access
        this.game.guineaPigMissions = this.guineaPigMissions;
        
        // Hamster wheel properties
        this.hamsterWheel = {
            x: 1500,
            y: 500,
            radius: 80,
            rotation: 0,
            spinning: false,
            spinSpeed: 0,
            lastSpinTime: 0
        };
        
        this.loadProgress();
    }
    
    addItem(itemData) {
        return this.itemManager.addItem(itemData);
    }
    
    reorganizeItems() {
        this.itemManager.reorganizeItems();
    }
    
    draw(ctx) {
        // Draw hamster wheel
        this.drawHamsterWheel(ctx);
        
        // Draw items
        this.itemManager.drawItems(ctx, this.game.camera);
        
        // Draw other guinea pigs
        this.guineaPigMissions.drawGuineaPigs(ctx, this.game.camera);
    }
    
    drawHamsterWheel(ctx) {
        ctx.save();
        ctx.translate(
            this.hamsterWheel.x - this.game.camera.x, 
            this.hamsterWheel.y - this.game.camera.y
        );
        
        // Rotate wheel if spinning
        ctx.rotate(this.hamsterWheel.rotation);
        
        // Draw wheel
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(0, 0, this.hamsterWheel.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw spokes
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
                Math.cos(angle) * this.hamsterWheel.radius,
                Math.sin(angle) * this.hamsterWheel.radius
            );
            ctx.stroke();
        }
        
        // Draw running surface
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 4;
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const nextAngle = ((i + 1) / 16) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.hamsterWheel.radius - 10, angle, nextAngle);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Draw "Press SPACE to run!" hint if player is in wheel
        if (this.checkPlayerInWheel()) {
            ctx.fillStyle = 'black';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                'Druk op SPATIE om te rennen!', 
                this.hamsterWheel.x - this.game.camera.x,
                this.hamsterWheel.y - this.game.camera.y - 120
            );
        }
    }
    
    handleClick(x, y) {
        // Check guinea pig clicks first
        if (this.guineaPigMissions.checkGuineaPigClick(x, y)) {
            return true;
        }
        
        return false;
    }
    
    handleDragStart(x, y) {
        return this.itemManager.handleDragStart(x, y);
    }
    
    handleDragMove(x, y) {
        this.itemManager.handleDragMove(x, y);
    }
    
    handleDragEnd(x, y) {
        this.itemManager.handleDragEnd(x, y);
    }
    
    checkPlayerInWheel() {
        const distance = Math.sqrt(
            Math.pow(this.game.player.x - this.hamsterWheel.x, 2) +
            Math.pow(this.game.player.y - this.hamsterWheel.y, 2)
        );
        return distance < this.hamsterWheel.radius;
    }
    
    update() {
        // Update item animations
        this.itemManager.updateAnimations();
        
        // Update hamster wheel
        if (this.hamsterWheel.spinning) {
            this.hamsterWheel.rotation += this.hamsterWheel.spinSpeed;
            this.hamsterWheel.spinSpeed *= 0.95; // Friction
            
            if (this.hamsterWheel.spinSpeed < 0.01) {
                this.hamsterWheel.spinning = false;
                this.hamsterWheel.spinSpeed = 0;
            }
            
            // Award carrots based on spinning
            const now = Date.now();
            if (now - this.hamsterWheel.lastSpinTime > 1000) {
                this.game.player.carrots += 1;
                this.hamsterWheel.lastSpinTime = now;
                this.game.ui.updateDisplay();
            }
        }
    }
    
    spinWheel() {
        if (this.checkPlayerInWheel()) {
            this.hamsterWheel.spinning = true;
            this.hamsterWheel.spinSpeed = Math.min(this.hamsterWheel.spinSpeed + 0.1, 0.5);
        }
    }
    
    saveProgress() {
        const saveData = {
            missions: this.guineaPigMissions.saveProgress()
        };
        localStorage.setItem('homeInventoryProgress', JSON.stringify(saveData));
    }
    
    loadProgress() {
        const savedData = localStorage.getItem('homeInventoryProgress');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.missions) {
                    this.guineaPigMissions.loadProgress(data.missions);
                }
            } catch (e) {
                console.error('Failed to load home inventory progress:', e);
            }
        }
    }
    
    // Delegate methods for backward compatibility
    get items() {
        return this.itemManager.items;
    }
    
    get otherGuineaPigs() {
        return this.guineaPigMissions.otherGuineaPigs;
    }
    
    get currentMissionPig() {
        return this.guineaPigMissions.currentMissionPig;
    }
    
    set currentMissionPig(value) {
        this.guineaPigMissions.currentMissionPig = value;
    }
}