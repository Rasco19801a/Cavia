// Buildings module - handles building data and interior rendering
export class Building {
    constructor(x, y, w, h, name) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.name = name;
    }

    contains(x, y) {
        return x >= this.x && x <= this.x + this.w &&
               y >= this.y && y <= this.y + this.h;
    }

    draw(ctx) {
        // Building body
        ctx.fillStyle = '#696969';
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Windows
        ctx.fillStyle = '#FFD700';
        for (let y = this.y + 20; y < this.y + this.h - 30; y += 40) {
            for (let x = this.x + 20; x < this.x + this.w - 20; x += 35) {
                ctx.fillRect(x, y, 25, 30);
            }
        }

        // Name
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.w/2, this.y - 10);
    }
}

export function createStadBuildings() {
    return [
        new Building(100, 300, 200, 250, 'Hotel'),
        new Building(350, 320, 150, 230, 'Café'),
        new Building(550, 280, 180, 270, 'Huis 1'),
        new Building(780, 300, 160, 250, 'Winkel'),
        new Building(990, 310, 170, 240, 'Huis 2')
    ];
}

export function createDierenstadBuildings() {
    return [
        { x: 200, y: 350, w: 200, h: 250, color: '#FFB6C1', name: 'Kapper' },
        { x: 500, y: 350, w: 200, h: 250, color: '#90EE90', name: 'Supermarkt' },
        { x: 800, y: 350, w: 200, h: 250, color: '#87CEEB', name: 'Dierenwinkel' },
        { x: 1100, y: 350, w: 200, h: 250, color: '#FF6347', name: 'Ziekenhuis' }
    ];
}

export function drawInterior(ctx, currentBuilding) {
    // Room background
    ctx.fillStyle = '#F5DEB3';
    ctx.fillRect(0, 0, 800, 600);

    // Floor
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 400, 800, 200);

    // Exit area
    ctx.fillStyle = '#654321';
    ctx.fillRect(350, 500, 100, 100);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Uitgang', 400, 550);

    // Draw specific interior based on building type
    switch (currentBuilding.name) {
        case 'Hotel':
            drawHotelInterior(ctx);
            break;
        case 'Café':
            drawCafeInterior(ctx);
            break;
        case 'Huis 1':
        case 'Huis 2':
            drawHouseInterior(ctx);
            break;
        case 'Winkel':
            drawShopInterior(ctx);
            break;
        case 'Kapper':
            drawKapperInterior(ctx);
            break;
        case 'Supermarkt':
            drawSupermarktInterior(ctx);
            break;
        case 'Dierenwinkel':
            drawDierenwinkelInterior(ctx);
            break;
        case 'Ziekenhuis':
            drawZiekenhuisInterior(ctx);
            break;
    }
}

function drawHotelInterior(ctx) {
    // Reception desk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(300, 300, 200, 80);

    // Straw beds
    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(100 + i * 150, 200, 100, 60);
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(110 + i * 150, 210, 80, 40);
    }

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Helzingten Hotel - Speciaal voor dieren!', 400, 50);
}

function drawCafeInterior(ctx) {
    // Tables
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(200 + i * 200, 250, 40, 0, Math.PI * 2);
        ctx.fill();

        // Chairs
        for (let j = 0; j < 4; j++) {
            const angle = (j * 90) * Math.PI / 180;
            const cx = 200 + i * 200 + Math.cos(angle) * 60;
            const cy = 250 + Math.sin(angle) * 60;
            ctx.fillStyle = '#654321';
            ctx.beginPath();
            ctx.arc(cx, cy, 15, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Counter
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(50, 100, 700, 50);

    // Food
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(100, 110, 30, 30);
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('Hooi', 115, 105);

    ctx.fillStyle = 'white';
    ctx.fillRect(200, 110, 30, 30);
    ctx.fillStyle = 'black';
    ctx.fillText('Suiker', 215, 105);
}

function drawHouseInterior(ctx) {
    // Couch
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(100, 250, 150, 80);
    ctx.fillRect(80, 270, 20, 60);
    ctx.fillRect(250, 270, 20, 60);

    // Table
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(350, 280, 100, 60);

    // Bookshelf
    ctx.fillStyle = '#654321';
    ctx.fillRect(550, 150, 80, 200);
    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = ['#FF6347', '#4169E1', '#32CD32', '#FFD700'][i];
        ctx.fillRect(560, 160 + i * 45, 60, 35);
    }

    // Kitchen area
    ctx.fillStyle = '#DCDCDC';
    ctx.fillRect(50, 50, 200, 80);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(100, 90, 20, 0, Math.PI * 2);
    ctx.arc(150, 90, 20, 0, Math.PI * 2);
    ctx.arc(200, 90, 20, 0, Math.PI * 2);
    ctx.fill();
}

function drawShopInterior(ctx) {
    // Shelves
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(100 + i * 250, 150, 200, 30);
        ctx.fillRect(100 + i * 250, 250, 200, 30);
        ctx.fillRect(100 + i * 250, 350, 200, 30);
    }

    // Products
    const products = ['🥕', '🥬', '🌾', '🥜', '🍎', '🌻'];
    let productIndex = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            ctx.font = '30px Arial';
            ctx.fillText(products[productIndex % products.length], 
                        150 + i * 250, 140 + j * 100);
            productIndex++;
        }
    }

    // Counter
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(300, 450, 200, 50);
}

function drawKapperInterior(ctx) {
    // Styling chairs
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(150 + i * 200, 250, 80, 100);
        
        // Mirror
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(150 + i * 200, 100, 80, 120);
    }

    // Hair products shelf
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(50, 50, 700, 30);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dierenkapper - Maak je vacht mooi!', 400, 30);
}

function drawSupermarktInterior(ctx) {
    // Aisles
    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#DCDCDC';
        ctx.fillRect(100 + i * 150, 100, 100, 250);
    }

    // Products
    const items = ['🥕', '🥬', '🌽', '🥒', '🍓', '🥜'];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            ctx.font = '25px Arial';
            ctx.fillText(items[(i + j) % items.length], 
                        130 + i * 150, 150 + j * 80);
        }
    }

    // Checkout
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(250, 400, 300, 80);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText('Kassa', 400, 440);
}

function drawDierenwinkelInterior(ctx) {
    // Pet supplies
    ctx.fillStyle = '#8B4513';
    // Beds section
    ctx.fillRect(50, 100, 150, 150);
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(60, 110, 130, 130);

    // Toys section
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(250, 100, 150, 150);
    ctx.font = '50px Arial';
    ctx.fillText('🎾', 300, 180);

    // Food section
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(450, 100, 150, 150);
    ctx.font = '30px Arial';
    ctx.fillText('🌾🥕🥬', 480, 180);

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('Bedden', 125, 90);
    ctx.fillText('Speelgoed', 325, 90);
    ctx.fillText('Voedsel', 525, 90);
}

function drawZiekenhuisInterior(ctx) {
    // Reception
    ctx.fillStyle = '#DCDCDC';
    ctx.fillRect(300, 350, 200, 80);

    // Waiting area chairs
    for (let i = 0; i < 6; i++) {
        ctx.fillStyle = '#4682B4';
        ctx.fillRect(100 + (i % 3) * 100, 200 + Math.floor(i / 3) * 80, 60, 60);
    }

    // Medical beds
    for (let i = 0; i < 2; i++) {
        ctx.fillStyle = 'white';
        ctx.fillRect(500 + i * 120, 150, 100, 60);
        ctx.strokeStyle = '#808080';
        ctx.strokeRect(500 + i * 120, 150, 100, 60);
    }

    // Red cross
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(390, 50, 20, 60);
    ctx.fillRect(370, 70, 60, 20);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dierenziekenhuis', 400, 30);
}