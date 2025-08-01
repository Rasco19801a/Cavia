// Shop module - handles shop system and purchasable items
export class Shop {
    constructor(game) {
        this.game = game;
        this.shopModal = null;
        this.currentShop = null;
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
        this.setupModal();
    }

    setupModal() {
        // Create shop modal
        this.shopModal = document.createElement('div');
        this.shopModal.id = 'shopModal';
        this.shopModal.className = 'shop-modal hidden';
        this.shopModal.innerHTML = `
            <div class="shop-content">
                <h2 id="shopTitle">Winkel</h2>
                <div class="shop-coins">
                    <span class="coin-icon">🪙</span>
                    <span id="shopCoinsAmount">0</span>
                </div>
                <div id="shopItems" class="shop-items-grid"></div>
                <button class="close-btn" id="closeShop">✖</button>
                <div id="shopMessage" class="shop-message hidden"></div>
            </div>
        `;
        document.body.appendChild(this.shopModal);

        // Event listeners
        document.getElementById('closeShop').addEventListener('click', () => this.closeShop());
        
        // ESC key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.shopModal.classList.contains('hidden')) {
                this.closeShop();
            }
        });
    }

    openShop(shopName) {
        this.currentShop = shopName;
        const items = this.shopItems[shopName];
        
        if (!items) {
            console.log('No items for shop:', shopName);
            return;
        }

        // Update shop title
        document.getElementById('shopTitle').textContent = shopName;
        
        // Update coins display
        document.getElementById('shopCoinsAmount').textContent = this.game.player.coins;
        
        // Clear and populate items
        const itemsContainer = document.getElementById('shopItems');
        itemsContainer.innerHTML = '';
        
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';
            itemDiv.innerHTML = `
                <div class="item-emoji">${item.emoji}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-price">
                    <span class="coin-icon">🪙</span>
                    <span>${item.price}</span>
                </div>
                <button class="buy-btn" data-item-id="${item.id}">Kopen</button>
            `;
            
            const buyBtn = itemDiv.querySelector('.buy-btn');
            buyBtn.addEventListener('click', () => this.buyItem(item));
            
            // Disable button if not enough coins
            if (this.game.player.coins < item.price) {
                buyBtn.disabled = true;
                buyBtn.textContent = 'Te duur';
            }
            
            itemsContainer.appendChild(itemDiv);
        });
        
        // Show modal
        this.shopModal.classList.remove('hidden');
    }

    buyItem(item) {
        if (this.game.player.coins < item.price) {
            this.showMessage('Je hebt niet genoeg muntjes!', 'error');
            return;
        }
        
        // Deduct coins
        this.game.player.addCoins(-item.price);
        
        // Add to inventory
        this.inventory.push(item);
        
        // Update coins display
        document.getElementById('shopCoinsAmount').textContent = this.game.player.coins;
        
        // Show success message
        this.showMessage(`Je hebt ${item.name} gekocht!`, 'success');
        
        // Update buy buttons
        this.updateBuyButtons();
        
        // If it's an accessory, apply it to the player
        if (this.currentShop === 'Accessoires' && ['bow', 'hat', 'glasses'].includes(item.id)) {
            this.game.player.accessory = item.id;
            this.showMessage(`${item.name} is nu opgezet!`, 'success');
        }
    }

    updateBuyButtons() {
        const items = this.shopItems[this.currentShop];
        const buyButtons = document.querySelectorAll('.buy-btn');
        
        buyButtons.forEach((btn, index) => {
            const item = items[index];
            if (this.game.player.coins < item.price) {
                btn.disabled = true;
                btn.textContent = 'Te duur';
            } else {
                btn.disabled = false;
                btn.textContent = 'Kopen';
            }
        });
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('shopMessage');
        messageDiv.textContent = message;
        messageDiv.className = `shop-message ${type}`;
        messageDiv.classList.remove('hidden');
        
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 2000);
    }

    closeShop() {
        this.shopModal.classList.add('hidden');
        this.currentShop = null;
    }
}