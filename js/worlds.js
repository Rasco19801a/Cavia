// Worlds module - handles rendering of different world environments
import { CONFIG } from './config.js';

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
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

    // Grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 500, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 500);

    // Trees
    for (let i = 0; i < 10; i++) {
        const x = 200 + i * 150;
        const y = 450;

        // Tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 10, y, 20, 40);

        // Tree leaves
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x, y - 20, 30, 0, Math.PI * 2);
        ctx.fill();
    }

    // Pond
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(600, 600, 300, 150);

    // Flowers
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * CONFIG.WORLD_WIDTH;
        const y = 520 + Math.random() * 200;
        
        ctx.fillStyle = ['#FF69B4', '#FFD700', '#FF6347', '#DA70D6'][i % 4];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
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
}

function drawJungle(ctx) {
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

    // Fixed flower positions
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
    
    // Fireplace (left side)
    // Fireplace base
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(50, 350, 200, 200);
    
    // Fireplace opening
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(80, 400, 140, 120);
    
    // Fire
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.moveTo(100, 500);
    ctx.quadraticCurveTo(120, 450, 100, 420);
    ctx.quadraticCurveTo(150, 440, 130, 480);
    ctx.quadraticCurveTo(170, 430, 160, 470);
    ctx.quadraticCurveTo(200, 440, 180, 500);
    ctx.closePath();
    ctx.fill();
    
    // Fire glow
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(120, 480);
    ctx.quadraticCurveTo(140, 450, 130, 440);
    ctx.quadraticCurveTo(160, 455, 150, 480);
    ctx.closePath();
    ctx.fill();
    
    // Mantel
    ctx.fillStyle = '#654321';
    ctx.fillRect(40, 340, 220, 20);
    
    // Windows (3 large modern windows)
    for (let i = 0; i < 3; i++) {
        const x = 350 + i * 300;
        
        // Window frame
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(x, 100, 180, 250);
        
        // Window glass with sky view
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(x + 10, 110, 160, 230);
        
        // Window dividers
        ctx.strokeStyle = '#4A4A4A';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(x + 90, 110);
        ctx.lineTo(x + 90, 340);
        ctx.moveTo(x + 10, 225);
        ctx.lineTo(x + 170, 225);
        ctx.stroke();
        
        // Curtains
        ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
        ctx.fillRect(x, 100, 30, 250);
        ctx.fillRect(x + 150, 100, 30, 250);
    }
    
    // Regular front-facing sofa (center)
    // Main sofa body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(550, 420, 350, 100);
    
    // Sofa back
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(550, 380, 350, 60);
    
    // Sofa cushions
    ctx.fillStyle = '#A0522D';
    // Seat cushions
    ctx.fillRect(560, 440, 105, 70);
    ctx.fillRect(675, 440, 105, 70);
    ctx.fillRect(790, 440, 100, 70);
    // Back cushions
    ctx.fillRect(560, 385, 105, 50);
    ctx.fillRect(675, 385, 105, 50);
    ctx.fillRect(790, 385, 100, 50);
    
    // Sofa arms
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(540, 380, 20, 130);
    ctx.fillRect(890, 380, 20, 130);
    
    // Throw pillows
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.arc(620, 430, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#98D8C8';
    ctx.beginPath();
    ctx.arc(830, 430, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Coffee table
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(600, 540, 250, 8);
    // Table legs
    ctx.fillRect(610, 548, 8, 30);
    ctx.fillRect(832, 548, 8, 30);
    
    // TV Stand (right side)
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(1000, 450, 250, 100);
    
    // Television
    ctx.fillStyle = '#000000';
    ctx.fillRect(1025, 300, 200, 120);
    // TV Screen
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(1035, 310, 180, 100);
    // TV reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(1035, 310, 180, 50);
    
    // Game console
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(1060, 460, 60, 40);
    // Console details
    ctx.fillStyle = '#000080';
    ctx.fillRect(1065, 465, 50, 5);
    ctx.fillRect(1065, 475, 50, 5);
    
    // Controllers
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(1130, 470, 30, 20);
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(1165, 470, 30, 20);
    
    // Bed (left corner near fireplace)
    // Bed frame
    ctx.fillStyle = '#654321';
    ctx.fillRect(300, 200, 180, 220);
    
    // Mattress
    ctx.fillStyle = '#F0E68C';
    ctx.fillRect(310, 210, 160, 200);
    
    // Pillow
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(320, 220, 140, 40);
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 2;
    ctx.strokeRect(320, 220, 140, 40);
    
    // Blanket
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(310, 260, 160, 150);
    // Blanket pattern
    ctx.strokeStyle = '#5A9FCF';
    ctx.lineWidth = 3;
    for (let y = 280; y < 410; y += 30) {
        ctx.beginPath();
        ctx.moveTo(310, y);
        ctx.lineTo(470, y);
        ctx.stroke();
    }
    
    // Bedside table
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(490, 350, 50, 70);
    // Drawer
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(495, 360, 40, 25);
    ctx.strokeRect(495, 390, 40, 25);
    // Drawer handles
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(515, 372, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(515, 402, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Lamp on bedside table
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(505, 330, 20, 20);
    ctx.fillStyle = '#FFF8DC';
    ctx.beginPath();
    ctx.moveTo(495, 330);
    ctx.lineTo(535, 330);
    ctx.lineTo(525, 310);
    ctx.lineTo(505, 310);
    ctx.closePath();
    ctx.fill();
    
    // Guinea pig cage area (near windows, more visible)
    // Cage base
    ctx.fillStyle = '#696969';
    ctx.fillRect(950, 380, 200, 150);
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 3;
    ctx.strokeRect(950, 380, 200, 150);
    
    // Cage bars
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 2;
    for (let x = 960; x < 1150; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 380);
        ctx.lineTo(x, 530);
        ctx.stroke();
    }
    
    // Bedding in cage
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(955, 480, 190, 45);
    
    // Water bottle
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(1130, 400, 15, 40);
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(1132, 440, 11, 5);
    
    // Food bowl
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.arc(980, 500, 15, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    
    // Chair (near bed)
    ctx.fillStyle = '#228B22';
    ctx.fillRect(350, 440, 80, 80);
    ctx.fillRect(350, 420, 80, 40);
    // Chair legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(355, 520, 8, 30);
    ctx.fillRect(417, 520, 8, 30);
    
    // Plants
    // Large floor plant (left)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(50, 480, 40, 70);
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(70, 450, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, 460, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(90, 460, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Small plant on coffee table
    ctx.fillStyle = '#696969';
    ctx.fillRect(720, 520, 20, 20);
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.arc(730, 515, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Hanging plant (near window)
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(800, 100);
    ctx.lineTo(800, 200);
    ctx.stroke();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(780, 200, 40, 30);
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(800, 210, 25, 0, Math.PI * 2);
    ctx.fill();
    // Hanging vines
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(785, 230);
    ctx.quadraticCurveTo(780, 250, 785, 270);
    ctx.moveTo(800, 230);
    ctx.quadraticCurveTo(800, 250, 805, 270);
    ctx.moveTo(815, 230);
    ctx.quadraticCurveTo(820, 250, 815, 270);
    ctx.stroke();
    
    // Rug under coffee table
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(550, 520, 350, 120);
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(570, 530, 310, 100);
    // Rug pattern
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(580, 540, 290, 80);
    
    // Wall art/paintings
    // Painting 1
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(100, 150, 100, 120);
    ctx.fillStyle = '#FFE4B5';
    ctx.fillRect(110, 160, 80, 100);
    
    // Painting 2
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(1200, 150, 120, 100);
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(1210, 160, 100, 80);
    
    // Title
    ctx.fillStyle = '#4B0082';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏠 Thuis 🏠', CONFIG.WORLD_WIDTH / 2, 60);
    
    // Instructions
    ctx.fillStyle = '#333';
    ctx.font = '20px Arial';
    ctx.fillText('Klik op eetbare items om ze te voeren - Sleep items naar andere cavia\'s', CONFIG.WORLD_WIDTH / 2, 90);
}