// Customization module - handles guinea pig customization
export class Customization {
    constructor() {
        // Check if customization was already done
        const savedCustomization = Customization.loadCustomization();
        
        this.bodyColor = savedCustomization.bodyColor || '#D2691E';
        this.bellyColor = savedCustomization.bellyColor || '#F5DEB3';
        this.accessory = savedCustomization.accessory || 'none';
        
        this.canvas = document.getElementById('previewCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Available colors
        this.bodyColors = [
            '#D2691E', // Brown
            '#8B4513', // Dark Brown
            '#FFD700', // Gold
            '#FF8C00', // Orange
            '#DC143C', // Red
            '#FF69B4', // Pink
            '#9370DB', // Purple
            '#4169E1', // Blue
            '#228B22', // Green
            '#708090', // Gray
            '#000000', // Black
            '#FFFFFF'  // White
        ];
        
        this.bellyColors = [
            '#F5DEB3', // Wheat
            '#FFDEAD', // Navajo White
            '#FFE4B5', // Moccasin
            '#FFEBCD', // Blanched Almond
            '#FFF8DC', // Cornsilk
            '#FFFACD', // Lemon Chiffon
            '#FAFAD2', // Light Goldenrod
            '#FFB6C1', // Light Pink
            '#E6E6FA', // Lavender
            '#F0E68C'  // Khaki
        ];
        
        this.setupUI();
        this.drawPreview();
    }
    
    setupUI() {
        // Setup body color buttons
        const bodyColorsDiv = document.getElementById('bodyColors');
        this.bodyColors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.style.backgroundColor = color;
            btn.dataset.color = color;
            if (color === this.bodyColor) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('#bodyColors .color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.bodyColor = color;
                this.drawPreview();
            });
            
            bodyColorsDiv.appendChild(btn);
        });
        
        // Setup belly color buttons
        const bellyColorsDiv = document.getElementById('bellyColors');
        this.bellyColors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.style.backgroundColor = color;
            btn.dataset.color = color;
            if (color === this.bellyColor) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('#bellyColors .color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.bellyColor = color;
                this.drawPreview();
            });
            
            bellyColorsDiv.appendChild(btn);
        });
        
        // Setup accessory buttons
        document.querySelectorAll('.accessory-btn').forEach(btn => {
            if (btn.dataset.accessory === this.accessory) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.accessory-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.accessory = btn.dataset.accessory;
                this.drawPreview();
            });
        });
        
        // Setup start game button
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.saveCustomization();
            const customizationScreen = document.getElementById('customizationScreen');
            // Remove the screen entirely instead of just hiding it
            if (customizationScreen) {
                customizationScreen.style.display = 'none';
                // Also remove it from DOM after a short delay to ensure smooth transition
                setTimeout(() => {
                    customizationScreen.remove();
                }, 100);
            }
            
            window.dispatchEvent(new CustomEvent('startGame', {
                detail: {
                    bodyColor: this.bodyColor,
                    bellyColor: this.bellyColor,
                    accessory: this.accessory
                }
            }));
        });
    }
    
    drawPreview() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw guinea pig body
        ctx.fillStyle = this.bodyColor;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 60, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw belly
        ctx.fillStyle = this.bellyColor;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 10, 40, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw head
        ctx.fillStyle = this.bodyColor;
        ctx.beginPath();
        ctx.arc(centerX - 40, centerY - 10, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ears
        ctx.beginPath();
        ctx.arc(centerX - 50, centerY - 30, 8, 0, Math.PI * 2);
        ctx.arc(centerX - 30, centerY - 30, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(centerX - 45, centerY - 10, 3, 0, Math.PI * 2);
        ctx.arc(centerX - 35, centerY - 10, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw nose
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(centerX - 55, centerY - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw accessory
        this.drawAccessory(ctx, centerX, centerY);
    }
    
    drawAccessory(ctx, centerX, centerY) {
        switch(this.accessory) {
            case 'bow':
                // Draw bow
                ctx.fillStyle = '#FF1493';
                ctx.beginPath();
                // Left side of bow
                ctx.ellipse(centerX - 45, centerY - 35, 10, 8, -0.3, 0, Math.PI * 2);
                // Right side of bow
                ctx.ellipse(centerX - 35, centerY - 35, 10, 8, 0.3, 0, Math.PI * 2);
                ctx.fill();
                // Center of bow
                ctx.fillStyle = '#FF69B4';
                ctx.fillRect(centerX - 42, centerY - 38, 4, 6);
                break;
                
            case 'hat':
                // Draw top hat
                ctx.fillStyle = 'black';
                // Hat brim
                ctx.fillRect(centerX - 55, centerY - 35, 30, 3);
                // Hat top
                ctx.fillRect(centerX - 50, centerY - 45, 20, 10);
                break;
                
            case 'glasses':
                // Draw glasses
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                // Left lens
                ctx.beginPath();
                ctx.arc(centerX - 45, centerY - 10, 6, 0, Math.PI * 2);
                ctx.stroke();
                // Right lens
                ctx.beginPath();
                ctx.arc(centerX - 35, centerY - 10, 6, 0, Math.PI * 2);
                ctx.stroke();
                // Bridge
                ctx.beginPath();
                ctx.moveTo(centerX - 39, centerY - 10);
                ctx.lineTo(centerX - 41, centerY - 10);
                ctx.stroke();
                break;
        }
    }
    
    saveCustomization() {
        // Save to localStorage
        localStorage.setItem('caviaCustomization', JSON.stringify({
            bodyColor: this.bodyColor,
            bellyColor: this.bellyColor,
            accessory: this.accessory
        }));
    }
    
    static loadCustomization() {
        const saved = localStorage.getItem('caviaCustomization');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            bodyColor: '#D2691E',
            bellyColor: '#F5DEB3',
            accessory: 'none'
        };
    }
}