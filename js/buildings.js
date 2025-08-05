// Buildings module - handles building creation and interiors
import { CONFIG } from './config.js';

// Utility function to draw rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
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
    ctx.fill();
}

export function createStadBuildings() {
    return [
        {
            x: 200, y: 300, w: 150, h: 200, 
            color: '#FF6B6B', name: 'Speelgoedwinkel',
            door: {x: 265, y: 440, w: 20, h: 60}
        },
        {
            x: 400, y: 250, w: 180, h: 250, 
            color: '#4ECDC4', name: 'Cavia Café',
            door: {x: 480, y: 440, w: 20, h: 60}
        },
        {
            x: 650, y: 280, w: 160, h: 220, 
            color: '#45B7D1', name: 'Dierenarts',
            door: {x: 720, y: 440, w: 20, h: 60}
        },
        {
            x: 900, y: 320, w: 140, h: 180, 
            color: '#96CEB4', name: 'Kapsalon',
            door: {x: 960, y: 440, w: 20, h: 60}
        }
    ];
}

export function createZwembadBuildings() {
    return [
        new Building(200, 300, 300, 300, '#87CEEB', 'Zwembad', 'zwembad'),
        new Building(600, 300, 300, 300, '#4682B4', 'Kleedkamer', 'kleedkamer'),
        new Building(1000, 300, 300, 300, '#20B2AA', 'Douches', 'douches')
    ];
}

// Create home world as a single large interior building
export function createThuisBuildings() {
    // Create a single building that represents the entire home interior
    return [
        new Building(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT, 'transparent', 'Thuis Interieur', 'thuis_interieur')
    ];
}

function drawShopInterior(ctx, name) {
    // Get shop items from the game's shop system
    const game = window.game;
    if (!game || !game.shop) return;
    
    const items = game.shop.getShopItems(name);
    game.shop.clearClickAreas();
    
    ctx.fillStyle = 'black';
    ctx.font = '20px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Welkom in de ' + name + '!', 400, 50);
    
    // Draw items in a grid - 2 columns to fit in 800px width
    items.forEach((item, index) => {
        const x = 150 + (index % 2) * 250;
        const y = 120 + Math.floor(index / 2) * 200;
        
        // Item background
        ctx.fillStyle = '#FFE4E1';
        ctx.fillRect(x, y, 200, 150);
        
        // Item emoji
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.emoji, x + 100, y + 60);
        
        // Item name
        ctx.fillStyle = 'black';
        ctx.font = '18px Nunito, sans-serif';
        ctx.fillText(item.name, x + 100, y + 90);
        
        // Item price
        ctx.font = '16px Nunito, sans-serif';
        ctx.fillText(`🥕 ${item.price}`, x + 100, y + 110);
        
        // Buy button
        const buttonY = y + 120;
        const buttonWidth = 80;
        const buttonHeight = 25;
        const buttonX = x + 60;
        
        if (game.player.carrots >= item.price) {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#999999';
        }
        drawRoundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Nunito, sans-serif';
        ctx.fillText(game.player.carrots >= item.price ? 'Kopen' : 'Te duur', buttonX + 40, buttonY + 17);
        
        // Store click area
        game.shop.clickAreas.push({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            item: item
        });
    });
}

function drawCafeInterior(ctx) {
    // Draw cafe name
    ctx.fillStyle = 'black';
    ctx.font = '20px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cavia Café - Gezellig samen zijn!', CONFIG.WORLD_WIDTH / 2, 50);
    
    // Tables spread out more
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(300 + i * 350, 250, 60, 0, Math.PI * 2);
        ctx.fill();
        
        // Chairs
        for (let j = 0; j < 4; j++) {
            const angle = j * Math.PI / 2;
            const chairX = 300 + i * 350 + Math.cos(angle) * 80;
            const chairY = 250 + Math.sin(angle) * 80;
            ctx.fillStyle = '#A0522D';
            ctx.beginPath();
            ctx.arc(chairX, chairY, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Counter
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(CONFIG.WORLD_WIDTH / 2 - 300, 400, 600, 100);
    
    // Coffee machine
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(CONFIG.WORLD_WIDTH / 2 - 50, 350, 100, 50);
    
    // Menu board
    ctx.fillStyle = '#228B22';
    ctx.fillRect(CONFIG.WORLD_WIDTH / 2 - 100, 80, 200, 100);
    ctx.fillStyle = 'white';
    ctx.fillRect(CONFIG.WORLD_WIDTH / 2 - 90, 90, 180, 80);
}

function drawVetInterior(ctx) {
    // Draw vet name
    ctx.fillStyle = 'black';
    ctx.font = '20px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Dierenarts - Dr. Fluffington', CONFIG.WORLD_WIDTH / 2, 50);
    
    // Examination table
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(CONFIG.WORLD_WIDTH / 2 - 150, 250, 300, 100);
    
    // Medical cabinets
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(200, 150, 150, 200);
    ctx.fillRect(CONFIG.WORLD_WIDTH - 350, 150, 150, 200);
    
    // Posters
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(400, 100, 120, 150);
    ctx.fillRect(CONFIG.WORLD_WIDTH - 520, 100, 120, 150);
    
    // Waiting chairs
    for (let i = 0; i < 8; i++) {
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(300 + i * 200, 450, 80, 80);
    }
}

function drawSalonInterior(ctx) {
    // Draw salon name
    ctx.fillStyle = 'black';
    ctx.font = '20px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Kapsalon Fluffy - Voor de mooiste cavia kapsels!', CONFIG.WORLD_WIDTH / 2, 50);
    
    // Salon chairs
    for (let i = 0; i < 6; i++) {
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(200 + i * 280, 300, 120, 150);
        
        // Mirrors
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(220 + i * 280, 180, 80, 100);
    }
    
    // Product shelves
    ctx.fillStyle = '#DDA0DD';
    ctx.fillRect(100, 150, 80, 250);
    ctx.fillRect(CONFIG.WORLD_WIDTH - 180, 150, 80, 250);
}

export function createDierenstadBuildings() {
    return [
        {
            x: 100, y: 300, w: 200, h: 250,
            color: '#FF8C00', name: 'Groente Markt',
            door: {x: 180, y: 490, w: 40, h: 60}
        },
        {
            x: 350, y: 320, w: 180, h: 230,
            color: '#32CD32', name: 'Hooi Winkel',
            door: {x: 425, y: 490, w: 30, h: 60}
        },
        {
            x: 580, y: 280, w: 220, h: 270,
            color: '#FFD700', name: 'Speeltjes & Meer',
            door: {x: 670, y: 490, w: 40, h: 60}
        },
        {
            x: 850, y: 310, w: 190, h: 240,
            color: '#FF69B4', name: 'Cavia Spa',
            door: {x: 930, y: 490, w: 30, h: 60}
        },
        {
            x: 1090, y: 290, w: 210, h: 260,
            color: '#9370DB', name: 'Accessoires',
            door: {x: 1175, y: 490, w: 40, h: 60}
        }
    ];
}

export function drawInterior(ctx, building) {
    // Background
    ctx.fillStyle = '#FFF8DC';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    
    // Floor
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, 500, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 500);
    
    // Exit sign
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(CONFIG.WORLD_WIDTH / 2 - 50, 520, 100, 50);
    ctx.fillStyle = 'white';
    ctx.font = '30px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', CONFIG.WORLD_WIDTH / 2, 555);
    
    // Draw specific interior based on building
    switch(building.name) {
        case 'Speelgoedwinkel':
            drawShopInterior(ctx, building.name);
            break;
        case 'Cavia Café':
            drawCafeInterior(ctx);
            break;
        case 'Dierenarts':
            drawVetInterior(ctx);
            break;
        case 'Kapsalon':
            drawSalonInterior(ctx);
            break;
        case 'Groente Markt':
            drawGroenteMarkt(ctx);
            break;
        case 'Hooi Winkel':
            drawHooiWinkel(ctx);
            break;
        case 'Speeltjes & Meer':
            drawSpeeltjesShop(ctx);
            break;
        case 'Cavia Spa':
            drawCaviaSpa(ctx);
            break;
        case 'Accessoires':
            drawAccessoiresShop(ctx);
            break;
        default:
            drawShopInterior(ctx, building.name);
    }
}

function drawGroenteMarkt(ctx) {
    // Get shop items from the game's shop system
    const game = window.game;
    if (!game || !game.shop) return;
    
    const items = game.shop.getShopItems('Groente Markt');
    game.shop.clearClickAreas(); // Clear previous click areas
    
    ctx.fillStyle = 'black';
    ctx.font = '20px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Verse Groenten voor je Cavia!', 400, 50);
    
    // Draw items in a grid - 2 columns to fit in 800px width
    items.forEach((item, index) => {
        const x = 150 + (index % 2) * 250;
        const y = 120 + Math.floor(index / 2) * 200;
        
        // Item background
        ctx.fillStyle = '#8FBC8F';
        ctx.fillRect(x, y, 200, 150);
        
        // Item emoji
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.emoji, x + 100, y + 60);
        
        // Item name
        ctx.fillStyle = 'black';
        ctx.font = '18px Nunito, sans-serif';
        ctx.fillText(item.name, x + 100, y + 90);
        
        // Item price
        ctx.font = '16px Nunito, sans-serif';
        ctx.fillText(`🥕 ${item.price}`, x + 100, y + 110);
        
        // Buy button
        const buttonY = y + 120;
        const buttonWidth = 80;
        const buttonHeight = 25;
        const buttonX = x + 60;
        
        if (game.player.carrots >= item.price) {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#999999';
        }
        drawRoundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Nunito, sans-serif';
        ctx.fillText(game.player.carrots >= item.price ? 'Kopen' : 'Te duur', buttonX + 40, buttonY + 17);
        
        // Store click area
        game.shop.clickAreas.push({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            item: item
        });
    });
}

function drawHooiWinkel(ctx) {
    const game = window.game;
    if (!game || !game.shop) return;
    
    const items = game.shop.getShopItems('Hooi Winkel');
    game.shop.clearClickAreas();
    
    ctx.fillStyle = 'black';
    ctx.font = '25px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Het Beste Hooi!', 400, 50);
    
    // Draw items - 2 columns to fit in 800px width
    items.forEach((item, index) => {
        const x = 150 + (index % 2) * 250;
        const y = 120 + Math.floor(index / 2) * 200;
        
        // Hay bale background
        ctx.fillStyle = '#F0E68C';
        ctx.fillRect(x, y, 200, 150);
        
        // Hay texture
        ctx.strokeStyle = '#DAA520';
        for (let j = 0; j < 5; j++) {
            ctx.beginPath();
            ctx.moveTo(x, y + 10 + j * 20);
            ctx.lineTo(x + 200, y + 10 + j * 20);
            ctx.stroke();
        }
        
        // Item emoji
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.emoji, x + 100, y + 60);
        
        // Item name
        ctx.fillStyle = 'black';
        ctx.font = '18px Nunito, sans-serif';
        ctx.fillText(item.name, x + 100, y + 90);
        
        // Item price
        ctx.font = '16px Nunito, sans-serif';
        ctx.fillText(`🥕 ${item.price}`, x + 100, y + 110);
        
        // Buy button
        const buttonY = y + 120;
        const buttonWidth = 80;
        const buttonHeight = 25;
        const buttonX = x + 60;
        
        if (game.player.carrots >= item.price) {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#999999';
        }
        drawRoundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Nunito, sans-serif';
        ctx.fillText(game.player.carrots >= item.price ? 'Kopen' : 'Te duur', buttonX + 40, buttonY + 17);
        
        // Store click area
        game.shop.clickAreas.push({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            item: item
        });
    });
}

function drawSpeeltjesShop(ctx) {
    const game = window.game;
    if (!game || !game.shop) return;
    
    const items = game.shop.getShopItems('Speeltjes & Meer');
    game.shop.clearClickAreas();
    
    ctx.fillStyle = 'black';
    ctx.font = '20px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Speeltjes voor Blije Cavia\'s!', 400, 50);
    
    // Draw items - 2 columns to fit in 800px width
    items.forEach((item, index) => {
        const x = 150 + (index % 2) * 250;
        const y = 120 + Math.floor(index / 2) * 200;
        
        // Item background
        ctx.fillStyle = '#FFE4B5';
        ctx.fillRect(x, y, 200, 150);
        
        // Item emoji
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.emoji, x + 100, y + 60);
        
        // Item name
        ctx.fillStyle = 'black';
        ctx.font = '18px Nunito, sans-serif';
        ctx.fillText(item.name, x + 100, y + 90);
        
        // Item price
        ctx.font = '16px Nunito, sans-serif';
        ctx.fillText(`🥕 ${item.price}`, x + 100, y + 110);
        
        // Buy button
        const buttonY = y + 120;
        const buttonWidth = 80;
        const buttonHeight = 25;
        const buttonX = x + 60;
        
        if (game.player.carrots >= item.price) {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#999999';
        }
        drawRoundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Nunito, sans-serif';
        ctx.fillText(game.player.carrots >= item.price ? 'Kopen' : 'Te duur', buttonX + 40, buttonY + 17);
        
        // Store click area
        game.shop.clickAreas.push({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            item: item
        });
    });
}

function drawCaviaSpa(ctx) {
    const game = window.game;
    if (!game || !game.shop) return;
    
    const items = game.shop.getShopItems('Cavia Spa');
    game.shop.clearClickAreas();
    
    ctx.fillStyle = 'black';
    ctx.font = '50px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Spa', 400, 80);
    
    // Draw items - 2 columns to fit in 800px width
    items.forEach((item, index) => {
        const x = 150 + (index % 2) * 250;
        const y = 120 + Math.floor(index / 2) * 200;
        
        // Spa background
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(x, y, 200, 150);
        
        // Item emoji
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.emoji, x + 100, y + 60);
        
        // Item name
        ctx.fillStyle = 'black';
        ctx.font = '18px Nunito, sans-serif';
        ctx.fillText(item.name, x + 100, y + 90);
        
        // Item price
        ctx.font = '16px Nunito, sans-serif';
        ctx.fillText(`🥕 ${item.price}`, x + 100, y + 110);
        
        // Buy button
        const buttonY = y + 120;
        const buttonWidth = 80;
        const buttonHeight = 25;
        const buttonX = x + 60;
        
        if (game.player.carrots >= item.price) {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#999999';
        }
        drawRoundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Nunito, sans-serif';
        ctx.fillText(game.player.carrots >= item.price ? 'Kopen' : 'Te duur', buttonX + 40, buttonY + 17);
        
        // Store click area
        game.shop.clickAreas.push({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            item: item
        });
    });
    
    ctx.fillStyle = 'black';
    ctx.font = '16px Nunito, sans-serif';
    ctx.fillText('Ontspan en geniet!', 400, 480);
}

function drawAccessoiresShop(ctx) {
    const game = window.game;
    if (!game || !game.shop) return;
    
    const items = game.shop.getShopItems('Accessoires');
    game.shop.clearClickAreas();
    
    ctx.fillStyle = 'black';
    ctx.font = '20px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Pimp je Cavia!', 400, 50);
    
    // Draw items - 2 columns to fit in 800px width
    items.forEach((item, index) => {
        const x = 150 + (index % 2) * 250;
        const y = 120 + Math.floor(index / 2) * 200;
        
        // Item background
        ctx.fillStyle = '#E6E6FA';
        ctx.fillRect(x, y, 200, 150);
        
        // Item emoji
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.emoji, x + 100, y + 60);
        
        // Item name
        ctx.fillStyle = 'black';
        ctx.font = '18px Nunito, sans-serif';
        ctx.fillText(item.name, x + 100, y + 90);
        
        // Item price
        ctx.font = '16px Nunito, sans-serif';
        ctx.fillText(`🥕 ${item.price}`, x + 100, y + 110);
        
        // Buy button
        const buttonY = y + 120;
        const buttonWidth = 80;
        const buttonHeight = 25;
        const buttonX = x + 60;
        
        if (game.player.carrots >= item.price) {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#999999';
        }
        drawRoundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Nunito, sans-serif';
        ctx.fillText(game.player.carrots >= item.price ? 'Kopen' : 'Te duur', buttonX + 40, buttonY + 17);
        
        // Store click area
        game.shop.clickAreas.push({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            item: item
        });
    });
}