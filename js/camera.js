// Camera module - handles viewport and camera movement
import { CONFIG } from './config.js';

export class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
    }

    update(player, isInside, currentBuilding = null, currentWorld = null) {
        // Keep camera stationary in home world
        if (currentWorld === 'thuis') {
            this.x = 0;
            this.y = 0;
            return;
        }
        
        if (!isInside) {
            // Follow player with camera
            this.x = Math.max(0, Math.min(
                CONFIG.WORLD_WIDTH - this.canvas.width, 
                player.x - this.canvas.width / 2
            ));
            
            this.y = Math.max(0, Math.min(
                CONFIG.WORLD_HEIGHT - this.canvas.height, 
                player.y - this.canvas.height / 2
            ));
        } else {
            // Check if we're in a shop building
            const shopBuildings = ['Speelgoedwinkel', 'Groente Markt', 'Hooi Winkel', 'Speeltjes & Meer', 'Cavia Spa', 'Accessoires'];
            const isShop = currentBuilding && shopBuildings.includes(currentBuilding.name);
            
            if (isShop) {
                // Allow scrolling in shops - follow player with some limits
                const shopWidth = 800; // Standard shop interior width
                const shopHeight = 600; // Standard shop interior height
                
                this.x = Math.max(0, Math.min(
                    Math.max(0, shopWidth - this.canvas.width), 
                    player.x - this.canvas.width / 2
                ));
                
                this.y = Math.max(0, Math.min(
                    Math.max(0, shopHeight - this.canvas.height), 
                    player.y - this.canvas.height / 2
                ));
            } else {
                // Reset camera for other interior views
                this.x = 0;
                this.y = 0;
            }
        }
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