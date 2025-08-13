// Underwater World module - handles underwater minigame
import { CONFIG, UNDERWATER_CONFIG, ANIMATION_CONFIG, GAME_CONFIG } from './config.js';

export class UnderwaterWorld {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.collectedCarrots = 0;
        this.playerX = CONFIG.WORLD_WIDTH / 2;
        this.playerY = UNDERWATER_CONFIG.PLAYER_START_Y;
        this.velocity = { x: 0, y: 0 };
        this.carrots = [];
        this.fish = [];
        this.bubbles = [];
        this.setupUnderwaterElements();
    }
    
    setupUnderwaterElements() {
        // Create carrots to collect
        for (let i = 0; i < UNDERWATER_CONFIG.FISH_COUNT; i++) {
            this.carrots.push({
                x: 200 + Math.random() * (CONFIG.WORLD_WIDTH - 400),
                y: 100 + Math.random() * 400,
                collected: false,
                size: UNDERWATER_CONFIG.FISH_SIZE
            });
        }
        
        // Create decorative fish
        this.fish = [
            {
                x: 300,
                y: 100 + Math.random() * 400,
                speed: 1,
                direction: 1,
                size: UNDERWATER_CONFIG.SHARK_SIZE,
                color: '#FF6347',
                type: 'normal',
                tailPhase: 0
            }
        ];
        
        // Create bubbles
        for (let i = 0; i < UNDERWATER_CONFIG.BUBBLE_COUNT; i++) {
            this.bubbles.push({
                x: Math.random() * CONFIG.WORLD_WIDTH,
                y: Math.random() * CONFIG.WORLD_HEIGHT,
                size: UNDERWATER_CONFIG.BUBBLE_MIN_SIZE + Math.random() * (UNDERWATER_CONFIG.BUBBLE_MAX_SIZE - UNDERWATER_CONFIG.BUBBLE_MIN_SIZE),
                speed: 0.5 + Math.random() * 1.5
            });
        }
    }
    
    activate() {
        this.active = true;
        this.collectedCarrots = 0;
        this.playerX = CONFIG.WORLD_WIDTH / 2;
        this.playerY = UNDERWATER_CONFIG.PLAYER_START_Y;
        this.velocity = { x: 0, y: 0 };
        this.setupUnderwaterElements();
    }
    
    deactivate() {
        this.active = false;
    }
    
    update() {
        if (!this.active) return;
        
        // Apply simple physics
        this.velocity.y += 0.3; // Gravity
        this.playerX += this.velocity.x;
        this.playerY += this.velocity.y;
        
        // Friction
        this.velocity.x *= 0.95;
        this.velocity.y *= 0.95;
        
        // Keep player in bounds
        if (this.playerY < UNDERWATER_CONFIG.MIN_Y) {
            this.playerY = UNDERWATER_CONFIG.MIN_Y;
            this.velocity.y = 0;
        }
        if (this.playerY > CONFIG.WORLD_HEIGHT - UNDERWATER_CONFIG.MAX_Y_OFFSET) {
            this.playerY = CONFIG.WORLD_HEIGHT - UNDERWATER_CONFIG.MAX_Y_OFFSET;
            this.velocity.y = 0;
        }
        
        // Update fish
        this.fish.forEach(fish => {
            fish.x += fish.speed * fish.direction;
            fish.tailPhase += 0.1;
            
            if (fish.x < -50 || fish.x > CONFIG.WORLD_WIDTH + 50) {
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
                    Math.pow(this.playerX - carrot.x, 2) + 
                    Math.pow(this.playerY - carrot.y, 2)
                );
                
                if (distance < UNDERWATER_CONFIG.COLLECT_DISTANCE) {
                    carrot.collected = true;
                    this.collectedCarrots++;
                    this.game.ui.showNotification('Wortel verzameld!');
                }
            }
        });
        
        // Check win condition
        if (this.collectedCarrots >= UNDERWATER_CONFIG.CARROTS_TO_COLLECT) {
            this.game.ui.showNotification('Gefeliciteerd! Je hebt alle wortels verzameld!');
            this.game.player.addCarrots(GAME_CONFIG.CARROT_REWARD);
            this.deactivate();
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
        this.fish.forEach(fish => {
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
        ctx.translate(this.playerX, this.playerY);
        
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
        ctx.beginPath();
        ctx.arc(CONFIG.WORLD_WIDTH - 40, 40, 20, 0, Math.PI * 2);
        ctx.fill();
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
        const dx = x - (CONFIG.WORLD_WIDTH - 40);
        const dy = y - 40;
        if (Math.sqrt(dx * dx + dy * dy) <= 20) {
            this.deactivate();
            return true;
        }
        
        // Swim up
        this.velocity.y = -8;
        return true;
    }
}