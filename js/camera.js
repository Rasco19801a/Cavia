// Camera module - handles viewport and camera movement
import { CONFIG } from './config.js';

export class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
    }

    update(player, isInside, currentBuilding = null) {
        // Always follow player with camera, both in worlds and shops
        this.x = Math.max(0, Math.min(
            CONFIG.WORLD_WIDTH - this.canvas.width, 
            player.x - this.canvas.width / 2
        ));
        
        this.y = Math.max(0, Math.min(
            CONFIG.WORLD_HEIGHT - this.canvas.height, 
            player.y - this.canvas.height / 2
        ));
    }

    applyTransform(ctx) {
        ctx.translate(-this.x, -this.y);
    }

    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    isInView(x, y, width = 0, height = 0) {
        return x + width >= this.x && 
               x <= this.x + this.canvas.width &&
               y + height >= this.y && 
               y <= this.y + this.canvas.height;
    }
}