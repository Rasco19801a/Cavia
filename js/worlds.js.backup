// Worlds module - handles rendering of different world environments
import { CONFIG } from './config.js';

// Background cache system for static elements
const backgroundCache = new Map();

function getOrCreateBackgroundCanvas(worldType, width, height) {
    const cacheKey = `${worldType}_${width}_${height}`;
    
    if (backgroundCache.has(cacheKey)) {
        return backgroundCache.get(cacheKey);
    }
    
    // Create off-screen canvas for background
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = width;
    bgCanvas.height = height;
    const bgCtx = bgCanvas.getContext('2d');
    
    // Draw static background elements based on world type
    switch(worldType) {
        case 'natuur':
            drawNatuurBackground(bgCtx);
            break;
        case 'jungle':
            drawJungleBackground(bgCtx);
            break;
        case 'dierenstad':
            drawDierenstadBackground(bgCtx);
            break;
        case 'paarden':
            drawPaardenBackground(bgCtx);
            break;
        // Add more world types as needed
    }
    
    backgroundCache.set(cacheKey, bgCanvas);
    return bgCanvas;
}

// Clear cache when needed (e.g., on window resize)
export function clearBackgroundCache() {
    backgroundCache.clear();
}

// Background drawing functions for static elements
function drawNatuurBackground(ctx) {
    // Draw flowers once on the background
    const flowerPositions = [];
    
    // Generate and store flower positions
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * CONFIG.WORLD_WIDTH;
        const y = 520 + Math.random() * 200;
        const color = ['#FF69B4', '#FFD700', '#FF6347', '#DA70D6'][i % 4];
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Add small shadow for depth
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(x + 1, y + 1, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawJungleBackground(ctx) {
    // Fixed flower positions for jungle
    const flowerPositions = [
        {x: 100, y: 670},
        {x: 250, y: 680},
        {x: 400, y: 665},
        {x: 550, y: 690},
        {x: 700, y: 675},
        {x: 850, y: 685},
        {x: 1000, y: 660},
        {x: 1150, y: 695},
        {x: 1300, y: 670},
        {x: 1450, y: 680}
    ];

    // Exotic flowers
    flowerPositions.forEach((pos, i) => {
        const x = pos.x;
        const y = pos.y;

        ctx.fillStyle = ['#FF1493', '#FF69B4', '#FFD700', '#FF4500'][i % 4];
        for (let j = 0; j < 5; j++) {
            const angle = (j * 72) * Math.PI / 180;
            ctx.beginPath();
            ctx.ellipse(
                x + Math.cos(angle) * 10,
                y + Math.sin(angle) * 10,
                8, 4, angle, 0, Math.PI * 2
            );
            ctx.fill();
        }

        // Flower center
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPaardenBackground(ctx) {
    // Some flowers in the grass
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * CONFIG.WORLD_WIDTH;
        const y = 520 + Math.random() * 200;
        
        // Flower stem
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 10);
        ctx.stroke();
        
        // Flower petals
        ctx.fillStyle = ['#FF69B4', '#FFD700', '#FF6347', '#DA70D6'][i % 4];
        ctx.beginPath();
        ctx.arc(x, y - 10, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawWorld(ctx, worldType, buildings) {
    switch(worldType) {
        case 'stad':
            drawStad(ctx, buildings);
            break;
        case 'natuur':
            drawNatuur(ctx);
            break;
        case 'strand':
            drawStrand(ctx);
            break;
        case 'winter':
            drawWinter(ctx);
            break;
        case 'woestijn':
            drawWoestijn(ctx);
            break;
        case 'jungle':
            drawJungle(ctx);
            break;
        case 'zwembad':
            drawZwembad(ctx);
            break;
        case 'dierenstad':
            drawDierenstad(ctx, buildings);
            break;
        case 'paarden':
            drawPaarden(ctx);
            break;
        case 'thuis':
            drawThuis(ctx);
            break;
    }
}

function drawStad(ctx, buildings) {
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, 550);

    // Street
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(0, 550, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 550);

    // Draw buildings
    buildings.forEach(building => building.draw(ctx));
}

function drawNatuur(ctx) {
    // Get or create background canvas with static elements
    const bgCanvas = getOrCreateBackgroundCanvas('natuur', CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

    // Grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 500, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 500);

    // Trees
    for (let i = 0; i < 10; i++) {
        const x = 200 + i * 150;
        const trunkHeight = 40;
        const y = 500 - trunkHeight; // Align trunk bottom with grass

        // Tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 10, y, 20, trunkHeight);

        // Tree leaves
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x, y - 20, 30, 0, Math.PI * 2);
        ctx.fill();
    }

    // Pond
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(600, 600, 300, 150);

    // Draw the background canvas with flowers
    ctx.drawImage(bgCanvas, 0, 0);
}

function drawStrand(ctx) {
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, 400);

    // Sea with waves
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(0, 400, CONFIG.WORLD_WIDTH, 200);

    // Wave effect
    ctx.fillStyle = '#5F9EA0';
    for (let x = 0; x < CONFIG.WORLD_WIDTH; x += 100) {
        ctx.beginPath();
        ctx.arc(x + 50, 400, 50, 0, Math.PI);
        ctx.fill();
    }

    // Beach
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(0, 600, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 600);

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(1500, 100, 50, 0, Math.PI * 2);
    ctx.fill();

    // Sun rays
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(1500 + Math.cos(angle) * 60, 100 + Math.sin(angle) * 60);
        ctx.lineTo(1500 + Math.cos(angle) * 80, 100 + Math.sin(angle) * 80);
        ctx.stroke();
    }

    // Beach umbrella
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.arc(400, 650, 60, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(395, 650, 10, 80);

    // Sunbed
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(350, 700, 100, 60);

    // Sandcastle
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(600, 680, 80, 60);
    ctx.beginPath();
    ctx.moveTo(600, 680);
    ctx.lineTo(640, 640);
    ctx.lineTo(680, 680);
    ctx.fill();

    // Shells
    for (let i = 0; i < 10; i++) {
        ctx.fillStyle = ['#FFF0F5', '#FFE4E1', '#FFDAB9'][i % 3];
        ctx.beginPath();
        ctx.arc(800 + i * 50, 720 + (i % 2) * 20, 8, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawWinter(ctx) {
    // Sky
    ctx.fillStyle = '#B0E0E6';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

    // Snow ground
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 500, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 500);

    // Mountain
    ctx.fillStyle = '#DCDCDC';
    ctx.beginPath();
    ctx.moveTo(0, 500);
    ctx.lineTo(500, 200);
    ctx.lineTo(1000, 500);
    ctx.fill();

    // Snow on mountain
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(350, 300);
    ctx.lineTo(500, 200);
    ctx.lineTo(650, 300);
    ctx.fill();

    // Igloo
    ctx.fillStyle = '#F0F8FF';
    ctx.beginPath();
    ctx.arc(300, 600, 80, Math.PI, 0);
    ctx.fill();

    // Igloo entrance
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(280, 580, 40, 40);

    // Penguins
    for (let i = 0; i < 5; i++) {
        const x = 500 + i * 100;
        const y = 650;

        // Body
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(x, y, 20, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(x, y + 5, 15, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x - 5, y - 15);
        ctx.lineTo(x + 5, y - 15);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x - 5, y - 25, 2, 0, Math.PI * 2);
        ctx.arc(x + 5, y - 25, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Snowflakes
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * CONFIG.WORLD_WIDTH,
            Math.random() * 500,
            Math.random() * 3 + 1,
            0, Math.PI * 2
        );
        ctx.fill();
    }
}

function drawWoestijn(ctx) {
    // Sky
    ctx.fillStyle = '#87CEFA';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, 400);

    // Desert sand
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(0, 400, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 400);

    // Sand dunes
    ctx.fillStyle = '#DEB887';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(i * 400, 600, 200, 0, Math.PI);
        ctx.fill();
    }

    // Pyramid
    ctx.fillStyle = '#DEB887';
    ctx.beginPath();
    ctx.moveTo(600, 300);
    ctx.lineTo(400, 600);
    ctx.lineTo(800, 600);
    ctx.fill();

    // Pyramid entrance
    ctx.fillStyle = '#654321';
    ctx.fillRect(580, 500, 40, 100);

    // Pyramid details
    ctx.strokeStyle = '#D2691E';
    ctx.lineWidth = 2;
    for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(600 - i * 40, 300 + i * 60);
        ctx.lineTo(600 + i * 40, 300 + i * 60);
        ctx.stroke();
    }

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(1600, 100, 60, 0, Math.PI * 2);
    ctx.fill();

    // Cacti
    for (let i = 0; i < 4; i++) {
        const x = 1000 + i * 150;
        ctx.fillStyle = '#228B22';
        
        // Main trunk
        ctx.fillRect(x, 500, 30, 100);
        
        // Arms
        ctx.fillRect(x - 20, 520, 20, 40);
        ctx.fillRect(x + 30, 540, 20, 40);
    }

    // Oasis
    ctx.fillStyle = '#4682B4';
    ctx.beginPath();
    ctx.ellipse(1400, 650, 100, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Palm trees around oasis
    for (let i = 0; i < 3; i++) {
        const x = 1350 + i * 50;
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, 580, 15, 60);
        
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x + 7, 580, 25, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Cave on the right side
    const caveX = 1700;
    const caveY = 450;
    const caveWidth = 150;
    const caveHeight = 150;
    
    // Cave rock formation
    ctx.fillStyle = '#8B7355';
    ctx.beginPath();
    ctx.moveTo(caveX - 20, caveY + caveHeight);
    ctx.lineTo(caveX - 10, caveY - 20);
    ctx.lineTo(caveX + caveWidth + 10, caveY - 20);
    ctx.lineTo(caveX + caveWidth + 20, caveY + caveHeight);
    ctx.closePath();
    ctx.fill();
    
    // Cave entrance
    ctx.fillStyle = '#2F2F2F';
    ctx.beginPath();
    ctx.ellipse(caveX + caveWidth/2, caveY + caveHeight/2, caveWidth/2 - 10, caveHeight/2 - 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cave entrance shadow
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.ellipse(caveX + caveWidth/2, caveY + caveHeight/2, caveWidth/2 - 20, caveHeight/2 - 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw play button if tunnel is purchased, otherwise show lock
    if (window.game && window.game.shop) {
        if (window.game.shop.hasPurchased('tunnel')) {
            const buttonX = caveX + caveWidth/2 - 50;
            const buttonY = caveY + caveHeight + 20;
            const buttonWidth = 100;
            const buttonHeight = 40;
            
            // Check if hovering
            let isHovering = false;
            if (window.game.mouseX !== undefined && window.game.mouseY !== undefined) {
                const rect = window.game.canvas.getBoundingClientRect();
                const mouseX = window.game.mouseX || 0;
                const mouseY = window.game.mouseY || 0;
                const worldCoords = window.game.camera.screenToWorld(mouseX - rect.left, mouseY - rect.top);
                
                isHovering = worldCoords.x >= buttonX && 
                            worldCoords.x <= buttonX + buttonWidth &&
                            worldCoords.y >= buttonY && 
                            worldCoords.y <= buttonY + buttonHeight;
            }
            
            // Button background with hover effect
            ctx.fillStyle = isHovering ? '#FF8C00' : '#FF6347';
            ctx.beginPath();
            ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight/2);
            ctx.fill();
            
            // Button border
            ctx.strokeStyle = isHovering ? '#FF4500' : '#CD5C5C';
            ctx.lineWidth = isHovering ? 3 : 2;
            ctx.beginPath();
            ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight/2);
            ctx.stroke();
            
            // Button shadow when hovering
            if (isHovering) {
                ctx.shadowColor = 'rgba(255, 69, 0, 0.5)';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight/2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            
            // Button text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🌀 Doolhof', buttonX + buttonWidth/2, buttonY + buttonHeight/2);
        } else {
            // Draw lock icon on cave
            ctx.save();
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.fillText('🔒', caveX + caveWidth/2, caveY + caveHeight/2);
            ctx.strokeText('🔒', caveX + caveWidth/2, caveY + caveHeight/2);
            
            // Draw text below lock
            ctx.font = '14px Nunito, sans-serif';
            ctx.fillStyle = '#FFF';
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;
            ctx.strokeText('Speeltunnel nodig', caveX + caveWidth/2, caveY + caveHeight + 20);
            ctx.fillText('Speeltunnel nodig', caveX + caveWidth/2, caveY + caveHeight + 20);
            ctx.restore();
        }
    }
}

function drawJungle(ctx) {
    // Get or create background canvas with static elements
    const bgCanvas = getOrCreateBackgroundCanvas('jungle', CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    
    // Background
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

    // Jungle floor
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, 700, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 700);

    // Fixed tree positions
    const treePositions = [
        {x: 150, y: 400},
        {x: 300, y: 350},
        {x: 450, y: 500},
        {x: 600, y: 300},
        {x: 750, y: 450},
        {x: 900, y: 380},
        {x: 1050, y: 520},
        {x: 1200, y: 320},
        {x: 1350, y: 480},
        {x: 200, y: 550},
        {x: 500, y: 380},
        {x: 800, y: 350},
        {x: 1100, y: 400},
        {x: 1300, y: 330},
        {x: 100, y: 450}
    ];

    // Large trees
    treePositions.forEach(pos => {
        const x = pos.x;
        const y = pos.y;

        // Tree trunk
        ctx.fillStyle = '#654321';
        ctx.fillRect(x - 15, y, 30, 100);

        // Tree canopy
        ctx.fillStyle = '#006400';
        ctx.beginPath();
        ctx.arc(x, y - 20, 40, 0, Math.PI * 2);
        ctx.fill();

        // Vines
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 20, y);
        ctx.quadraticCurveTo(x + 30, y + 50, x + 20, y + 100);
        ctx.stroke();
    });

    // Monkeys
    for (let i = 0; i < 3; i++) {
        const x = 300 + i * 400;
        const y = 400;

        // Body
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(x, y - 20, 10, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x + 15, y);
        ctx.quadraticCurveTo(x + 30, y - 10, x + 25, y - 25);
        ctx.stroke();
    }

    // Draw the background canvas with flowers
    ctx.drawImage(bgCanvas, 0, 0);
}

function drawZwembad(ctx) {
    // Building interior
    ctx.fillStyle = '#F0F8FF';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

    // Floor tiles
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(0, 700, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 700);

    // Tile pattern
    ctx.strokeStyle = '#5F9EA0';
    ctx.lineWidth = 1;
    for (let x = 0; x < CONFIG.WORLD_WIDTH; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 700);
        ctx.lineTo(x, CONFIG.WORLD_HEIGHT);
        ctx.stroke();
    }
    for (let y = 700; y < CONFIG.WORLD_HEIGHT; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CONFIG.WORLD_WIDTH, y);
        ctx.stroke();
    }

    // Pools
    const pools = [
        {x: 200, y: 400, w: 200, h: 150, color: '#DAA520', name: 'Stro'},
        {x: 500, y: 400, w: 200, h: 150, color: '#00CED1', name: 'Water'},
        {x: 800, y: 400, w: 200, h: 150, color: '#F4A460', name: 'Zand'},
        {x: 1100, y: 400, w: 200, h: 150, color: '#E0FFFF', name: 'Bubbel'}
    ];

    pools.forEach(pool => {
        // Pool shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(pool.x + 5, pool.y + 5, pool.w, pool.h);

        // Pool
        ctx.fillStyle = pool.color;
        ctx.fillRect(pool.x, pool.y, pool.w, pool.h);

        // Pool edge
        ctx.strokeStyle = '#B0C4DE';
        ctx.lineWidth = 3;
        ctx.strokeRect(pool.x, pool.y, pool.w, pool.h);

        // Pool name
        ctx.fillStyle = 'black';
        ctx.font = '16px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pool.name + ' bad', pool.x + pool.w/2, pool.y - 10);
        
        // Special effect for water pool if player has badbehandeling
        if (pool.name === 'Water' && window.game && window.game.shop && window.game.shop.hasPurchased('bath')) {
            // Add sparkle effect
            ctx.save();
            const time = Date.now() * 0.001;
            for (let i = 0; i < 3; i++) {
                const sparkleX = pool.x + pool.w/2 + Math.cos(time + i * 2) * 50;
                const sparkleY = pool.y + pool.h/2 + Math.sin(time + i * 2) * 30;
                ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.5 + 0.5 * Math.sin(time * 3 + i)) + ')';
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            
            // Add "Ready to swim!" text
            ctx.fillStyle = '#00FF00';
            ctx.font = 'bold 14px Nunito, sans-serif';
            ctx.fillText('✨ Klaar om te zwemmen! ✨', pool.x + pool.w/2, pool.y + pool.h + 20);
            
            // Add "Start Minigame" button
            const buttonWidth = 150;
            const buttonHeight = 40;
            const buttonX = pool.x + pool.w/2 - buttonWidth/2;
            const buttonY = pool.y + pool.h + 40;
            
            // Check if hovering
            let isHovering = false;
            if (window.game && window.game.waterBathButton) {
                const rect = window.game.canvas.getBoundingClientRect();
                const mouseX = window.game.mouseX || 0;
                const mouseY = window.game.mouseY || 0;
                const worldCoords = window.game.camera.screenToWorld(mouseX - rect.left, mouseY - rect.top);
                
                isHovering = worldCoords.x >= buttonX && 
                            worldCoords.x <= buttonX + buttonWidth &&
                            worldCoords.y >= buttonY && 
                            worldCoords.y <= buttonY + buttonHeight;
            }
            
            // Button background with hover effect
            ctx.fillStyle = isHovering ? '#5179F1' : '#4169E1';
            ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
            
            // Button border
            ctx.strokeStyle = isHovering ? '#3EA0FF' : '#1E90FF';
            ctx.lineWidth = isHovering ? 3 : 2;
            ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
            
            // Button shadow when hovering
            if (isHovering) {
                ctx.shadowColor = 'rgba(30, 144, 255, 0.5)';
                ctx.shadowBlur = 10;
                ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
                ctx.shadowBlur = 0;
            }
            
            // Button text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Start Minigame', pool.x + pool.w/2, buttonY + buttonHeight/2);
            
            // Store button coordinates for click detection
            if (window.game) {
                window.game.waterBathButton = {
                    x: buttonX,
                    y: buttonY,
                    width: buttonWidth,
                    height: buttonHeight
                };
            }
        } else if (pool.name === 'Water') {
            // Add lock icon if badbehandeling not purchased
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 20px Nunito, sans-serif';
            ctx.fillText('🔒', pool.x + pool.w/2, pool.y + pool.h/2);
            ctx.font = '12px Nunito, sans-serif';
            ctx.fillStyle = '#333333';
            ctx.fillText('Badbehandeling nodig', pool.x + pool.w/2, pool.y + pool.h + 20);
        }
    });

    // Diving board
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(450, 350, 100, 50);
    ctx.fillStyle = '#1E90FF';
    ctx.fillRect(470, 340, 60, 10);

    // Lounge chairs
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(100 + i * 300, 600, 60, 80);
        ctx.fillStyle = '#FF7F50';
        ctx.fillRect(110 + i * 300, 610, 40, 60);
    }
}

function drawDierenstad(ctx, buildings) {
    // Sky with sunset colors
    ctx.fillStyle = '#FFE4B5';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, 600);

    // Ground
    ctx.fillStyle = '#D2691E';
    ctx.fillRect(0, 600, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 600);

    // Sidewalk
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 580, CONFIG.WORLD_WIDTH, 20);

    // Shops
    buildings.forEach(shop => {
        // Shop building
        ctx.fillStyle = shop.color;
        ctx.fillRect(shop.x, shop.y, shop.w, shop.h);

        // Shop window
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(shop.x + 20, shop.y + 50, shop.w - 40, shop.h - 100);

        // Shop door
        ctx.fillStyle = '#654321';
        ctx.fillRect(shop.x + shop.w/2 - 30, shop.y + shop.h - 60, 60, 60);

        // Shop sign
        ctx.fillStyle = 'white';
        ctx.fillRect(shop.x + 10, shop.y + 10, shop.w - 20, 30);

        // Shop name
        ctx.fillStyle = 'black';
        ctx.font = '18px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(shop.name, shop.x + shop.w/2, shop.y + 30);
    });

    // Street lamps
    for (let i = 0; i < 6; i++) {
        const x = 150 + i * 300;
        
        // Lamp post
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x, 500, 10, 100);
        
        // Lamp
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + 5, 490, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    // Decorative trees
    for (let i = 0; i < 5; i++) {
        const x = 50 + i * 400;
        
        // Tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, 550, 20, 50);
        
        // Tree leaves
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x + 10, 540, 30, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawThuis(ctx) {
    // Modern home interior background
    // Walls - warm gray
    ctx.fillStyle = '#E8E0D5';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    
    // Wooden floor
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(0, 550, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 550);
    
    // Floor boards detail
    ctx.strokeStyle = '#6B5637';
    ctx.lineWidth = 2;
    for (let x = 0; x < CONFIG.WORLD_WIDTH; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 550);
        ctx.lineTo(x, CONFIG.WORLD_HEIGHT);
        ctx.stroke();
    }
    
    // 1. BANK (SOFA) - Left side, front-facing view
    // Main sofa body
    ctx.fillStyle = '#4169E1'; // Royal blue sofa
    ctx.fillRect(50, 420, 250, 100);
    
    // Sofa back
    ctx.fillStyle = '#1E90FF';
    ctx.fillRect(50, 350, 250, 80);
    
    // Sofa cushions
    ctx.fillStyle = '#6495ED';
    // Seat cushions
    ctx.fillRect(60, 440, 70, 70);
    ctx.fillRect(140, 440, 70, 70);
    ctx.fillRect(220, 440, 70, 70);
    // Back cushions
    ctx.fillRect(60, 360, 70, 60);
    ctx.fillRect(140, 360, 70, 60);
    ctx.fillRect(220, 360, 70, 60);
    
    // Sofa arms
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(40, 350, 20, 170);
    ctx.fillRect(290, 350, 20, 170);
    
    // Decorative pillows
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.arc(100, 400, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#98D8C8';
    ctx.beginPath();
    ctx.arc(250, 400, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // 2. OPENHAARD (FIREPLACE) - Center-left
    // Fireplace base
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(400, 350, 200, 200);
    
    // Fireplace opening
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(430, 400, 140, 120);
    
    // Fire
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.moveTo(450, 500);
    ctx.quadraticCurveTo(470, 450, 450, 420);
    ctx.quadraticCurveTo(500, 440, 480, 480);
    ctx.quadraticCurveTo(520, 430, 510, 470);
    ctx.quadraticCurveTo(550, 440, 530, 500);
    ctx.closePath();
    ctx.fill();
    
    // Fire glow
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(470, 480);
    ctx.quadraticCurveTo(490, 450, 480, 440);
    ctx.quadraticCurveTo(510, 455, 500, 480);
    ctx.closePath();
    ctx.fill();
    
    // Mantel
    ctx.fillStyle = '#654321';
    ctx.fillRect(390, 340, 220, 20);
    
    // 3. BED - Center
    // Bed frame
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(700, 300, 200, 250);
    
    // Mattress
    ctx.fillStyle = '#F0E68C';
    ctx.fillRect(710, 310, 180, 230);
    
    // Pillow
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(720, 320, 160, 50);
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 2;
    ctx.strokeRect(720, 320, 160, 50);
    
    // Blanket
    ctx.fillStyle = '#9370DB';
    ctx.fillRect(710, 370, 180, 170);
    // Blanket pattern
    ctx.strokeStyle = '#8A2BE2';
    ctx.lineWidth = 3;
    for (let y = 390; y < 540; y += 30) {
        ctx.beginPath();
        ctx.moveTo(710, y);
        ctx.lineTo(890, y);
        ctx.stroke();
    }
    
    // Headboard
    ctx.fillStyle = '#654321';
    ctx.fillRect(700, 250, 200, 60);
    
    // 4. TV - Center-right
    // TV Stand
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(1000, 450, 200, 100);
    
    // Television
    ctx.fillStyle = '#000000';
    ctx.fillRect(1025, 320, 150, 100);
    // TV Screen
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(1035, 330, 130, 80);
    // TV reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(1035, 330, 130, 40);
    
    // TV stand shelves
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(1000, 500);
    ctx.lineTo(1200, 500);
    ctx.stroke();
    
    // 5. STOEL (CHAIR) - Right side
    // Chair seat
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(1300, 440, 80, 80);
    
    // Chair back
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(1300, 380, 80, 70);
    
    // Chair legs
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(1305, 520, 10, 30);
    ctx.fillRect(1365, 520, 10, 30);
    ctx.fillRect(1305, 380, 10, 60);
    ctx.fillRect(1365, 380, 10, 60);
    
    // Chair cushion
    ctx.fillStyle = '#FFE4E1';
    ctx.fillRect(1310, 450, 60, 60);
    
    // DECORATIVE ELEMENTS
    
    // Windows (3 windows across the back wall)
    for (let i = 0; i < 3; i++) {
        const x = 150 + i * 400;
        
        // Window frame
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(x, 100, 180, 200);
        
        // Window glass with sky view
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(x + 10, 110, 160, 180);
        
        // Window dividers
        ctx.strokeStyle = '#4A4A4A';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(x + 90, 110);
        ctx.lineTo(x + 90, 290);
        ctx.moveTo(x + 10, 200);
        ctx.lineTo(x + 170, 200);
        ctx.stroke();
        
        // Simple curtains
        ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
        ctx.fillRect(x, 100, 30, 200);
        ctx.fillRect(x + 150, 100, 30, 200);
    }
    
    // Rug under sofa
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(30, 520, 300, 100);
    // Rug pattern
    ctx.strokeStyle = '#A52A2A';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 530, 280, 80);
    ctx.strokeRect(50, 540, 260, 60);
    
    // Small side table next to sofa
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(320, 460, 40, 60);
    // Table top
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(315, 455, 50, 5);
    
    // Lamp on side table
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(330, 435, 20, 20);
    ctx.fillStyle = '#FFF8DC';
    ctx.beginPath();
    ctx.moveTo(320, 435);
    ctx.lineTo(360, 435);
    ctx.lineTo(350, 415);
    ctx.lineTo(330, 415);
    ctx.closePath();
    ctx.fill();
    
    // Coffee table in front of TV
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(1050, 540, 100, 8);
    // Table legs
    ctx.fillRect(1060, 548, 8, 25);
    ctx.fillRect(1132, 548, 8, 25);
    
    // Plant near window
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(620, 480, 40, 70);
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(640, 450, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(620, 460, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(660, 460, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Picture frames on wall
    // Above fireplace
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(470, 200, 60, 80);
    ctx.fillStyle = '#F0E68C';
    ctx.fillRect(475, 205, 50, 70);
    
    // Above bed
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(770, 150, 60, 80);
    ctx.fillStyle = '#E6E6FA';
    ctx.fillRect(775, 155, 50, 70);
    
    // Bookshelf next to TV
    ctx.fillStyle = '#654321';
    ctx.fillRect(920, 300, 60, 250);
    // Shelves
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 4;
    for (let y = 350; y < 550; y += 50) {
        ctx.beginPath();
        ctx.moveTo(920, y);
        ctx.lineTo(980, y);
        ctx.stroke();
    }
    // Books
    const bookColors = ['#FF0000', '#0000FF', '#008000', '#FFD700', '#800080'];
    let bookY = 355;
    for (let shelf = 0; shelf < 4; shelf++) {
        let bookX = 925;
        for (let book = 0; book < 5; book++) {
            ctx.fillStyle = bookColors[book];
            ctx.fillRect(bookX, bookY, 8, 40);
            bookX += 10;
        }
        bookY += 50;
    }
    
    // Title removed
    
    // Instructions removed
}

function drawPaarden(ctx) {
    // Get or create background canvas with static elements
    const bgCanvas = getOrCreateBackgroundCanvas('paarden', CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    
    // Grass
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, 500, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 500);
    
    // Wooden fence along the back
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8;
    // Horizontal rails
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.lineTo(CONFIG.WORLD_WIDTH, 420);
    ctx.moveTo(0, 460);
    ctx.lineTo(CONFIG.WORLD_WIDTH, 460);
    ctx.stroke();
    
    // Vertical posts
    for (let x = 50; x < CONFIG.WORLD_WIDTH; x += 150) {
        ctx.beginPath();
        ctx.moveTo(x, 400);
        ctx.lineTo(x, 480);
        ctx.stroke();
    }
    
    // Hay bales
    ctx.fillStyle = '#DAA520';
    // Large hay bale
    ctx.fillRect(200, 460, 80, 60);
    ctx.fillStyle = '#B8860B';
    ctx.fillRect(200, 470, 80, 5);
    ctx.fillRect(200, 485, 80, 5);
    ctx.fillRect(200, 500, 80, 5);
    
    // Small hay bale
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(1400, 480, 60, 40);
    ctx.fillStyle = '#B8860B';
    ctx.fillRect(1400, 485, 60, 3);
    ctx.fillRect(1400, 495, 60, 3);
    ctx.fillRect(1400, 505, 60, 3);
    
    // Water trough
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(800, 480, 120, 40);
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(805, 485, 110, 30);
    
    // Trees in background
    for (let i = 0; i < 5; i++) {
        const x = 100 + i * 400;
        const trunkHeight = 60;
        const y = 500 - trunkHeight; // Align trunk bottom with grass

        // Tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 15, y, 30, trunkHeight);
        
        // Tree leaves
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x, y - 30, 40, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw the background canvas with flowers
    ctx.drawImage(bgCanvas, 0, 0);
}