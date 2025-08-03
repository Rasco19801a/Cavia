// Buildings module - handles building creation and interiors
import { CONFIG } from './config.js';

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
        {
            x: 500, y: 400, w: 200, h: 150, 
            color: '#00CED1', name: 'Duik in het Water!',
            door: {x: 580, y: 475, w: 40, h: 40},
            isWaterPool: true  // Special flag to identify this as the water pool
        }
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
    
    // Draw items in a grid
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
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
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
    // Draw café name
    ctx.fillStyle = 'black';
    ctx.font = '16px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cavia Café - Gezelligheid!', 400, 50);
    
    // Tables
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(150 + i * 200, 200, 80, 80);
        
        // Chairs
        ctx.fillStyle = '#654321';
        ctx.fillRect(160 + i * 200, 180, 20, 20);
        ctx.fillRect(200 + i * 200, 180, 20, 20);
        ctx.fillRect(160 + i * 200, 280, 20, 20);
        ctx.fillRect(200 + i * 200, 280, 20, 20);
    }
    
    // Counter
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(250, 400, 300, 100);
    
    // Coffee machine
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(350, 350, 100, 50);
    
    // Menu board
    ctx.fillStyle = '#228B22';
    ctx.fillRect(300, 80, 200, 100);
    ctx.fillStyle = 'white';
    ctx.fillRect(310, 90, 180, 80);
}

function drawVetInterior(ctx) {
    // Draw vet name
    ctx.fillStyle = 'black';
    ctx.font = '20px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Dierenarts - Dr. Fluffington', 400, 50);
    
    // Examination table
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(300, 250, 200, 100);
    
    // Medical cabinets
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(100, 150, 100, 200);
    ctx.fillRect(600, 150, 100, 200);
    
    // Posters
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(250, 100, 80, 100);
    ctx.fillRect(470, 100, 80, 100);
    
    // Waiting chairs
    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(150 + i * 120, 450, 60, 60);
    }
}

function drawSalonInterior(ctx) {
    // Draw salon name
    ctx.fillStyle = 'black';
    ctx.font = '12px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Kapsalon Fluffy - Voor de mooiste cavia kapsels!', 400, 50);
    
    // Salon chairs
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(200 + i * 150, 300, 80, 100);
        
        // Mirrors
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(210 + i * 150, 200, 60, 80);
    }
    
    // Product shelves
    ctx.fillStyle = '#DDA0DD';
    ctx.fillRect(100, 150, 80, 250);
    ctx.fillRect(620, 150, 80, 250);
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
    ctx.fillRect(0, 0, 800, 600);
    
    // Floor
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, 500, 800, 100);
    
    // Exit sign
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(350, 520, 100, 50);
    ctx.fillStyle = 'white';
    ctx.font = '30px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', 400, 555);
    
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
    
    // Draw items in a grid
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
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
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
    
    // Draw items
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
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
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
    ctx.font = '16px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Speeltjes voor Blije Cavia\'s!', 400, 50);
    
    // Draw items
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
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
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
    
    // Draw items
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
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
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
    
    // Draw items
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
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
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