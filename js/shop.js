// Shop module - handles shop system and purchasable items
export class Shop {
    constructor(game) {
        this.game = game;
        this.shopItems = {
            'Speelgoedwinkel': [
                { id: 'ball', name: 'Bal', price: 10, emoji: '⚽', description: 'Een leuke bal om mee te spelen' },
                { id: 'teddy', name: 'Knuffelbeer', price: 15, emoji: '🧸', description: 'Een zachte knuffel' },
                { id: 'blocks', name: 'Blokken', price: 20, emoji: '🧱', description: 'Bouwblokken voor creativiteit' },
                { id: 'puzzle', name: 'Puzzel', price: 25, emoji: '🧩', description: 'Een uitdagende puzzel' }
            ],
            'Groente Markt': [
                { id: 'carrot', name: 'Wortel', price: 5, emoji: '🥕', description: 'Verse wortels voor je cavia' },
                { id: 'lettuce', name: 'Sla', price: 3, emoji: '🥬', description: 'Knapperige sla' },
                { id: 'cucumber', name: 'Komkommer', price: 4, emoji: '🥒', description: 'Sappige komkommer' },
                { id: 'corn', name: 'Mais', price: 6, emoji: '🌽', description: 'Zoete mais' }
            ],
            'Hooi Winkel': [
                { id: 'hay_small', name: 'Klein Hooi Pakket', price: 8, emoji: '🌾', description: 'Vers hooi voor een week' },
                { id: 'hay_medium', name: 'Middel Hooi Pakket', price: 15, emoji: '🌾', description: 'Vers hooi voor twee weken' },
                { id: 'hay_large', name: 'Groot Hooi Pakket', price: 25, emoji: '🌾', description: 'Vers hooi voor een maand' },
                { id: 'hay_premium', name: 'Premium Hooi', price: 35, emoji: '🌾', description: 'Extra zacht premium hooi' }
            ],
            'Speeltjes & Meer': [
                { id: 'tunnel', name: 'Speeltunnel', price: 30, emoji: '🎪', description: 'Een tunnel om doorheen te rennen' },
                { id: 'wheel', name: 'Loopwiel', price: 40, emoji: '🎡', description: 'Een wiel om in te rennen' },
                { id: 'house', name: 'Speelhuisje', price: 50, emoji: '🏠', description: 'Een gezellig huisje' },
                { id: 'slide', name: 'Glijbaan', price: 35, emoji: '🛝', description: 'Een kleine glijbaan' }
            ],
            'Cavia Spa': [
                { id: 'shampoo', name: 'Cavia Shampoo', price: 12, emoji: '🧴', description: 'Zachte shampoo voor cavias' },
                { id: 'brush', name: 'Borstel', price: 8, emoji: '🪮', description: 'Zachte borstel voor de vacht' },
                { id: 'bath', name: 'Badbehandeling', price: 20, emoji: '🛁', description: 'Ontspannend badje' },
                { id: 'massage', name: 'Massage', price: 30, emoji: '💆', description: 'Relaxerende massage' }
            ],
            'Accessoires': [
                { id: 'bow', name: 'Strik', price: 10, emoji: '🎀', description: 'Een mooie strik' },
                { id: 'hat', name: 'Hoed', price: 15, emoji: '🎩', description: 'Een stijlvolle hoed' },
                { id: 'glasses', name: 'Bril', price: 20, emoji: '👓', description: 'Hippe bril' },
                { id: 'necklace', name: 'Ketting', price: 25, emoji: '💎', description: 'Glinsterende ketting' }
            ]
        };
        this.inventory = [];
        this.purchasedItems = new Set(); // Track purchased item IDs
        this.clickAreas = []; // Store clickable areas for items
    }

    buyItem(item) {
        console.log('Before purchase - Carrots:', this.game.player.carrots);
        if (this.game.player.carrots >= item.price) {
            this.game.player.carrots -= item.price;
            console.log('After purchase - Carrots:', this.game.player.carrots);
            this.inventory.push(item);
            this.purchasedItems.add(item.id); // Track purchased item
            
            // Add item to player inventory
            this.game.inventory.addItem(item);
            
            this.game.ui.showNotification(`${item.name} gekocht!`);
            
            // Update UI
            this.game.ui.updateDisplay();
            console.log('UI updateDisplay called');
            
            // Handle immediate use items
            if (this.game.currentBuilding && this.game.currentBuilding.name === 'Accessoires' && ['bow', 'hat', 'glasses'].includes(item.id)) {
                this.game.player.accessory = item.id;
                this.game.ui.showNotification(`${item.name} is nu opgezet!`);
            }
            
            // Don't start minigame automatically for bath treatment
            // The minigame should only start when entering the water pool in the swimming pool world
        } else {
            this.game.ui.showNotification('Niet genoeg wortels!');
        }
    }

    hasPurchased(itemId) {
        return this.purchasedItems.has(itemId);
    }

    isShopBuilding(buildingName) {
        return this.shopItems.hasOwnProperty(buildingName);
    }

    getShopItems(shopName) {
        return this.shopItems[shopName] || [];
    }

    // Check if a click is on a shop item
    handleClick(x, y) {
        for (const area of this.clickAreas) {
            if (x >= area.x && x <= area.x + area.width &&
                y >= area.y && y <= area.y + area.height) {
                this.buyItem(area.item);
                return true;
            }
        }
        return false;
    }

    // Clear click areas when leaving shop
    clearClickAreas() {
        this.clickAreas = [];
    }
}