// Underwater World module - handles underwater mini-game
import { CONFIG } from './config.js';

export class UnderwaterWorld {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.carrots = [];
        this.goldfish = [];
        this.collectedCarrots = 0;
        this.playerY = 300;
        this.playerVelocityY = 0;
        this.bubbles = [];
        this.setupWorld();
    }
    
    setupWorld() {
        // Create carrots to collect
        this.carrots = [];
        for (let i = 0; i < 10; i++) {
            this.carrots.push({
                x: 200 + Math.random() * (CONFIG.WORLD_WIDTH - 400),
                y: 100 + Math.random() * 400,
                collected: false,
                size: 30
            });
        }
        
        // Create goldfish
        this.goldfish = [];
        for (let i = 0; i < 5; i++) {
            this.goldfish.push({
                x: Math.random() * CONFIG.WORLD_WIDTH,
                y: 100 + Math.random() * 400,
                speedX: 1 + Math.random() * 2,
                direction: Math.random() > 0.5 ? 1 : -1,
                size: 40,
                tailPhase: Math.random() * Math.PI * 2
            });
        }
        
        // Create bubbles
        this.bubbles = [];
        for (let i = 0; i < 20; i++) {
            this.bubbles.push({
                x: Math.random() * CONFIG.WORLD_WIDTH,
                y: Math.random() * CONFIG.WORLD_HEIGHT,
                size: 5 + Math.random() * 10,
                speed: 0.5 + Math.random() * 1.5
            });
        }
    }
    
    enter() {
        this.active = true;
        this.collectedCarrots = 0;
        this.playerY = 300;
        this.playerVelocityY = 0;
        this.setupWorld();
    }
    
    exit() {
        this.active = false;
        // Give carrots to player
        this.game.player.carrots += this.collectedCarrots * 5;
        this.game.ui.updateDisplay();
        alert(`Je hebt ${this.collectedCarrots} wortels verzameld! (+${this.collectedCarrots * 5} wortels)`);
    }
    
    update() {
        if (!this.active) return;
        
        // Update player physics
        this.playerVelocityY += 0.3; // Gravity
        this.playerY += this.playerVelocityY;
        
        // Constrain player
        if (this.playerY < 50) {
            this.playerY = 50;
            this.playerVelocityY = 0;
        }
        if (this.playerY > CONFIG.WORLD_HEIGHT - 100) {
            this.playerY = CONFIG.WORLD_HEIGHT - 100;
            this.playerVelocityY = 0;
        }
        
        // Update goldfish
        this.goldfish.forEach(fish => {
            fish.x += fish.speedX * fish.direction;
            fish.tailPhase += 0.1;
            
            // Bounce off edges
            if (fish.x < 0 || fish.x > CONFIG.WORLD_WIDTH) {
                fish.direction *= -1;
            }
        });
        
        // Update bubbles
        this.bubbles.forEach(bubble => {
            bubble.y -= bubble.speed;
            if (bubble.y < -20) {
                bubble.y = CONFIG.WORLD_HEIGHT + 20;
                bubble.x = Math.random() * CONFIG.WORLD_WIDTH;
            }
        });
        
        // Check carrot collection
        this.carrots.forEach(carrot => {
            if (!carrot.collected) {
                const distance = Math.sqrt(
                    Math.pow(this.game.player.x - carrot.x, 2) + 
                    Math.pow(this.playerY - carrot.y, 2)
                );
                
                if (distance < 40) {
                    carrot.collected = true;
                    this.collectedCarrots++;
                }
            }
        });
        
        // Check if all carrots collected
        if (this.collectedCarrots >= 10) {
            this.exit();
        }
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        // Draw underwater background
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.WORLD_HEIGHT);
        gradient.addColorStop(0, '#006994');
        gradient.addColorStop(1, '#00334d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
        
        // Draw sea floor
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(0, CONFIG.WORLD_HEIGHT - 50, CONFIG.WORLD_WIDTH, 50);
        
        // Draw seaweed
        for (let x = 100; x < CONFIG.WORLD_WIDTH; x += 200) {
            ctx.strokeStyle = '#2E8B57';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(x, CONFIG.WORLD_HEIGHT - 50);
            
            for (let y = CONFIG.WORLD_HEIGHT - 50; y > CONFIG.WORLD_HEIGHT - 200; y -= 20) {
                const wave = Math.sin((y + Date.now() * 0.001) * 0.05) * 20;
                ctx.lineTo(x + wave, y);
            }
            ctx.stroke();
        }
        
        // Draw bubbles
        this.bubbles.forEach(bubble => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        
        // Draw goldfish
        this.goldfish.forEach(fish => {
            ctx.save();
            ctx.translate(fish.x, fish.y);
            
            if (fish.direction < 0) {
                ctx.scale(-1, 1);
            }
            
            // Body
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.ellipse(0, 0, fish.size, fish.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Tail
            ctx.fillStyle = '#FF8C00';
            ctx.beginPath();
            const tailWave = Math.sin(fish.tailPhase) * 10;
            ctx.moveTo(-fish.size, 0);
            ctx.lineTo(-fish.size * 1.5, -20 + tailWave);
            ctx.lineTo(-fish.size * 1.5, 20 + tailWave);
            ctx.closePath();
            ctx.fill();
            
            // Eye
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(fish.size * 0.3, -fish.size * 0.2, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(fish.size * 0.3, -fish.size * 0.2, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
        
        // Draw carrots
        this.carrots.forEach(carrot => {
            if (!carrot.collected) {
                ctx.save();
                ctx.translate(carrot.x, carrot.y);
                ctx.rotate(Math.sin(Date.now() * 0.001) * 0.2);
                
                ctx.font = '40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('🥕', 0, 0);
                
                ctx.restore();
            }
        });
        
        // Draw player as swimming guinea pig
        ctx.save();
        ctx.translate(this.game.player.x, this.playerY);
        
        // Swimming animation
        const swimPhase = Math.sin(Date.now() * 0.005) * 5;
        ctx.rotate(swimPhase * 0.02);
        
        // Draw guinea pig body
        ctx.fillStyle = this.game.player.color || '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(-15, -5, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-20, -8, 3, 0, Math.PI * 2);
        ctx.arc(-10, -8, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(-15, -2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Swimming goggles
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-20, -8, 8, 0, Math.PI * 2);
        ctx.arc(-10, -8, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(-20, -8, 8, 0, Math.PI * 2);
        ctx.arc(-10, -8, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Draw UI
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Wortels: ${this.collectedCarrots}/10`, 20, 40);
        
        ctx.textAlign = 'center';
        ctx.fillText('Klik om te zwemmen! Verzamel alle wortels!', CONFIG.WORLD_WIDTH / 2, 40);
        
        // Draw exit button - make it more visible as a close button
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(CONFIG.WORLD_WIDTH - 60, 20, 40, 40);
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(CONFIG.WORLD_WIDTH - 50, 30);
        ctx.lineTo(CONFIG.WORLD_WIDTH - 30, 50);
        ctx.moveTo(CONFIG.WORLD_WIDTH - 30, 30);
        ctx.lineTo(CONFIG.WORLD_WIDTH - 50, 50);
        ctx.stroke();
    }
    
    handleClick(x, y) {
        if (!this.active) return;
        
        // Check exit button
        if (x >= CONFIG.WORLD_WIDTH - 60 && x <= CONFIG.WORLD_WIDTH - 20 && y >= 20 && y <= 60) {
            this.exit();
            return true;
        }
        
        // Swim up
        this.playerVelocityY = -8;
        return true;
    }
}