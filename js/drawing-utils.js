// Drawing Utilities module - reusable drawing functions
import { DRAW_CONFIG } from './config.js';

export class DrawingUtils {
    /**
     * Draw a guinea pig at the specified position
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} colors - Color configuration
     * @param {number} scale - Scale factor
     * @param {Object} options - Additional options
     */
    static drawGuineaPig(ctx, x, y, colors, scale = 1, options = {}) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        // Draw shadow if enabled
        if (options.shadow !== false) {
            this.drawShadow(ctx, 0, DRAW_CONFIG.SHADOW_OFFSET_Y, 30, 10);
        }
        
        // Draw body
        ctx.fillStyle = colors.body || '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(0, 0, DRAW_CONFIG.GUINEA_PIG_BODY_WIDTH, DRAW_CONFIG.GUINEA_PIG_BODY_HEIGHT, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw belly
        ctx.fillStyle = colors.belly || '#FFF5EE';
        ctx.beginPath();
        ctx.ellipse(0, 10, DRAW_CONFIG.GUINEA_PIG_BODY_WIDTH * 0.7, DRAW_CONFIG.GUINEA_PIG_BODY_HEIGHT * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw head
        ctx.fillStyle = colors.body || '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-DRAW_CONFIG.GUINEA_PIG_BODY_WIDTH * 0.6, -10, DRAW_CONFIG.GUINEA_PIG_HEAD_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ears
        ctx.fillStyle = colors.ears || '#FFB6C1';
        ctx.beginPath();
        ctx.arc(-DRAW_CONFIG.GUINEA_PIG_BODY_WIDTH * 0.7, -30, DRAW_CONFIG.GUINEA_PIG_EAR_SIZE, 0, Math.PI * 2);
        ctx.arc(-DRAW_CONFIG.GUINEA_PIG_BODY_WIDTH * 0.5, -30, DRAW_CONFIG.GUINEA_PIG_EAR_SIZE, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = colors.eyes || 'black';
        ctx.beginPath();
        ctx.arc(-DRAW_CONFIG.GUINEA_PIG_BODY_WIDTH * 0.7, -10, DRAW_CONFIG.GUINEA_PIG_EYE_SIZE, 0, Math.PI * 2);
        ctx.arc(-DRAW_CONFIG.GUINEA_PIG_BODY_WIDTH * 0.5, -10, DRAW_CONFIG.GUINEA_PIG_EYE_SIZE, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw nose
        ctx.fillStyle = colors.nose || '#FF69B4';
        ctx.beginPath();
        ctx.arc(-DRAW_CONFIG.GUINEA_PIG_BODY_WIDTH * 0.6, -5, DRAW_CONFIG.GUINEA_PIG_NOSE_SIZE, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw feet if visible
        if (options.showFeet) {
            ctx.fillStyle = colors.feet || '#FFB6C1';
            // Front feet
            ctx.beginPath();
            ctx.ellipse(-20, 35, 8, 5, 0, 0, Math.PI * 2);
            ctx.ellipse(-5, 35, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            // Back feet
            ctx.beginPath();
            ctx.ellipse(15, 35, 8, 5, 0, 0, Math.PI * 2);
            ctx.ellipse(30, 35, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    /**
     * Draw a shadow
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Shadow width
     * @param {number} height - Shadow height
     * @param {number} opacity - Shadow opacity (0-1)
     */
    static drawShadow(ctx, x, y, width, height, opacity = 0.2) {
        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    /**
     * Draw a rounded rectangle
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {number} radius - Corner radius
     * @param {Object} options - Fill and stroke options
     */
    static drawRoundedRect(ctx, x, y, width, height, radius, options = {}) {
        ctx.save();
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        
        if (options.fill) {
            ctx.fillStyle = options.fill;
            ctx.fill();
        }
        
        if (options.stroke) {
            ctx.strokeStyle = options.stroke;
            ctx.lineWidth = options.lineWidth || 1;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * Draw a button
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Button width
     * @param {number} height - Button height
     * @param {string} text - Button text
     * @param {Object} options - Style options
     */
    static drawButton(ctx, x, y, width, height, text, options = {}) {
        const bgColor = options.backgroundColor || '#4CAF50';
        const textColor = options.textColor || 'white';
        const borderColor = options.borderColor || '#45a049';
        const fontSize = options.fontSize || 16;
        const radius = options.radius || 5;
        
        // Draw button background
        this.drawRoundedRect(ctx, x, y, width, height, radius, {
            fill: bgColor,
            stroke: borderColor,
            lineWidth: 2
        });
        
        // Draw button text
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, y + height / 2);
        ctx.restore();
    }
    
    /**
     * Draw a progress bar
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Progress bar width
     * @param {number} height - Progress bar height
     * @param {number} progress - Progress value (0-1)
     * @param {Object} options - Style options
     */
    static drawProgressBar(ctx, x, y, width, height, progress, options = {}) {
        const bgColor = options.backgroundColor || '#E0E0E0';
        const fillColor = options.fillColor || '#4CAF50';
        const borderColor = options.borderColor || '#999';
        const radius = options.radius || height / 2;
        
        // Draw background
        this.drawRoundedRect(ctx, x, y, width, height, radius, {
            fill: bgColor,
            stroke: borderColor,
            lineWidth: 1
        });
        
        // Draw progress fill
        if (progress > 0) {
            const fillWidth = width * Math.min(1, Math.max(0, progress));
            this.drawRoundedRect(ctx, x, y, fillWidth, height, radius, {
                fill: fillColor
            });
        }
        
        // Draw text if provided
        if (options.text) {
            ctx.save();
            ctx.fillStyle = options.textColor || 'black';
            ctx.font = `${options.fontSize || 12}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(options.text, x + width / 2, y + height / 2);
            ctx.restore();
        }
    }
    
    /**
     * Draw a speech bubble
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Bubble width
     * @param {number} height - Bubble height
     * @param {string} text - Text to display
     * @param {Object} options - Style options
     */
    static drawSpeechBubble(ctx, x, y, width, height, text, options = {}) {
        const bgColor = options.backgroundColor || 'white';
        const borderColor = options.borderColor || 'black';
        const textColor = options.textColor || 'black';
        const fontSize = options.fontSize || 14;
        const padding = options.padding || 10;
        const tailSize = options.tailSize || 10;
        
        ctx.save();
        
        // Draw bubble background
        ctx.fillStyle = bgColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        this.drawRoundedRect(ctx, x, y, width, height, 10, {
            fill: bgColor,
            stroke: borderColor,
            lineWidth: 2
        });
        
        // Draw tail
        if (options.tailDirection) {
            ctx.beginPath();
            switch (options.tailDirection) {
                case 'bottom':
                    ctx.moveTo(x + width / 2 - tailSize, y + height);
                    ctx.lineTo(x + width / 2, y + height + tailSize);
                    ctx.lineTo(x + width / 2 + tailSize, y + height);
                    break;
                case 'top':
                    ctx.moveTo(x + width / 2 - tailSize, y);
                    ctx.lineTo(x + width / 2, y - tailSize);
                    ctx.lineTo(x + width / 2 + tailSize, y);
                    break;
                case 'left':
                    ctx.moveTo(x, y + height / 2 - tailSize);
                    ctx.lineTo(x - tailSize, y + height / 2);
                    ctx.lineTo(x, y + height / 2 + tailSize);
                    break;
                case 'right':
                    ctx.moveTo(x + width, y + height / 2 - tailSize);
                    ctx.lineTo(x + width + tailSize, y + height / 2);
                    ctx.lineTo(x + width, y + height / 2 + tailSize);
                    break;
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        // Draw text
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Word wrap if necessary
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > width - padding * 2) {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    lines.push(word);
                }
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        
        // Draw lines
        const lineHeight = fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = y + height / 2 - totalHeight / 2 + lineHeight / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, x + width / 2, startY + index * lineHeight);
        });
        
        ctx.restore();
    }
    
    /**
     * Draw a star
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} radius - Star radius
     * @param {number} points - Number of points
     * @param {Object} options - Style options
     */
    static drawStar(ctx, x, y, radius, points = 5, options = {}) {
        const innerRadius = radius * 0.5;
        const fillColor = options.fillColor || '#FFD700';
        const strokeColor = options.strokeColor || '#FFA500';
        
        ctx.save();
        ctx.translate(x, y);
        
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const r = i % 2 === 0 ? radius : innerRadius;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        
        ctx.fillStyle = fillColor;
        ctx.fill();
        
        if (options.stroke) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = options.lineWidth || 2;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * Draw a heart
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Heart size
     * @param {Object} options - Style options
     */
    static drawHeart(ctx, x, y, size, options = {}) {
        const fillColor = options.fillColor || '#FF69B4';
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 100, size / 100);
        
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.moveTo(0, 30);
        ctx.bezierCurveTo(-50, -20, -50, 10, -25, 10);
        ctx.bezierCurveTo(-25, 10, -25, -10, 0, 0);
        ctx.bezierCurveTo(25, -10, 25, 10, 25, 10);
        ctx.bezierCurveTo(50, 10, 50, -20, 0, 30);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}