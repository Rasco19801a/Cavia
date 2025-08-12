// Player module - handles cavia character
import { CONFIG, DEFAULT_CAVIA_COLORS } from './config.js';

export class Player {
    constructor(customization = {}) {
        this.x = CONFIG.PLAYER_START_X;
        this.y = CONFIG.PLAYER_START_Y;
        this.speed = CONFIG.PLAYER_SPEED;
        this.targetX = null;
        this.targetY = null;
        this.carrots = 0; // Starting carrots set to 0
        
        // Apply customization or use defaults
        this.colors = {
            body: customization.bodyColor || DEFAULT_CAVIA_COLORS.body,
            belly: customization.bellyColor || DEFAULT_CAVIA_COLORS.belly,
            ears: customization.bodyColor || DEFAULT_CAVIA_COLORS.ears,
            feet: customization.bodyColor || DEFAULT_CAVIA_COLORS.feet,
            nose: DEFAULT_CAVIA_COLORS.nose,
            eyes: DEFAULT_CAVIA_COLORS.eyes
        };
        
        this.accessory = customization.accessory || 'none';
    }

    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    clearTarget() {
        this.targetX = null;
        this.targetY = null;
    }

    moveToTarget() {
        if (this.targetX === null || this.targetY === null) return;

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            this.clearTarget();
        }
    }

    moveWithKeys(keys) {
        if (keys['ArrowLeft']) {
            this.x -= this.speed;
            this.clearTarget();
        }
        if (keys['ArrowRight']) {
            this.x += this.speed;
            this.clearTarget();
        }
        if (keys['ArrowUp']) {
            this.y -= this.speed;
            this.clearTarget();
        }
        if (keys['ArrowDown']) {
            this.y += this.speed;
            this.clearTarget();
        }
    }

    constrainToBounds(minX, maxX, minY, maxY) {
        this.x = Math.max(minX, Math.min(maxX, this.x));
        this.y = Math.max(minY, Math.min(maxY, this.y));
    }
    
    addCarrots(amount) {
        this.carrots += amount;
        // Dispatch event for UI update
        window.dispatchEvent(new CustomEvent('carrotsUpdated', { detail: { carrots: this.carrots } }));
    }

    setColor(part, color) {
        if (this.colors.hasOwnProperty(part)) {
            this.colors[part] = color;
        }
    }

    draw(ctx, scale = 0.5, feetScale = 1) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(scale, scale);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 35, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly
        ctx.fillStyle = this.colors.belly;
        ctx.beginPath();
        ctx.ellipse(0, 10, 25, 15, 0, 0, Math.PI);
        ctx.fill();

        // Head
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.ellipse(0, -20, 30, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = this.colors.ears;
        ctx.beginPath();
        ctx.ellipse(-15, -30, 10, 15, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(15, -30, 10, 15, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Feet
        ctx.fillStyle = this.colors.feet;
        ctx.beginPath();
        ctx.ellipse(-20, 20, 10 * feetScale, 15 * feetScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(20, 20, 10 * feetScale, 15 * feetScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-10, -20, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, -20, 3, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = this.colors.nose;
        ctx.beginPath();
        ctx.ellipse(0, -10, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw accessory
        this.drawAccessory(ctx);

        ctx.restore();
    }
    
    drawAccessory(ctx) {
        switch(this.accessory) {
            case 'bow':
                // Draw bow
                ctx.fillStyle = '#FF1493';
                ctx.beginPath();
                // Left side of bow
                ctx.ellipse(-5, -40, 8, 6, -0.3, 0, Math.PI * 2);
                // Right side of bow
                ctx.ellipse(5, -40, 8, 6, 0.3, 0, Math.PI * 2);
                ctx.fill();
                // Center of bow
                ctx.fillStyle = '#FF69B4';
                ctx.fillRect(-3, -42, 6, 4);
                break;
                
            case 'hat':
                // Draw top hat
                ctx.fillStyle = 'black';
                // Hat brim
                ctx.fillRect(-20, -45, 40, 4);
                // Hat top
                ctx.fillRect(-15, -60, 30, 15);
                break;
                
            case 'glasses':
                // Draw glasses
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                // Left lens
                ctx.beginPath();
                ctx.arc(-10, -20, 5, 0, Math.PI * 2);
                ctx.stroke();
                // Right lens
                ctx.beginPath();
                ctx.arc(10, -20, 5, 0, Math.PI * 2);
                ctx.stroke();
                // Bridge
                ctx.beginPath();
                ctx.moveTo(-5, -20);
                ctx.lineTo(5, -20);
                ctx.stroke();
                break;
        }
    }

    drawTarget(ctx, cameraX, cameraY) {
        if (this.targetX === null || this.targetY === null) return;

        ctx.save();
        ctx.translate(-cameraX, -cameraY);
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.targetX, this.targetY, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}