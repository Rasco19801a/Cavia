// UI module - handles user interface elements
import { AVAILABLE_COLORS, COLOR_PARTS } from './config.js';

export class UI {
    constructor(player) {
        this.player = player;
        this.setupColorPicker();
        // Delay world selector setup to ensure DOM is ready
        setTimeout(() => this.setupWorldSelector(), 100);
        
        // Also try to set it up immediately in case DOM is already ready
        this.setupWorldSelector();
    }

    setupColorPicker() {
        const picker = document.getElementById('colorPicker');
        picker.innerHTML = ''; // Clear existing content

        COLOR_PARTS.forEach(part => {
            const partDiv = document.createElement('div');
            partDiv.innerHTML = `<strong>${this.translatePart(part)}:</strong>`;

            AVAILABLE_COLORS.forEach(color => {
                const btn = document.createElement('button');
                btn.className = 'color-btn';
                btn.style.backgroundColor = color;
                
                if (this.player.colors[part] === color) {
                    btn.classList.add('active');
                }

                btn.addEventListener('click', () => {
                    this.player.setColor(part, color);
                    this.setupColorPicker(); // Refresh to update active states
                });

                partDiv.appendChild(btn);
            });

            picker.appendChild(partDiv);
        });
    }

    setupWorldSelector() {
        const worldButtons = document.querySelectorAll('.world-btn');
        
        if (worldButtons.length === 0) {
            console.error('World buttons not found');
            // Retry if buttons not found yet
            setTimeout(() => this.setupWorldSelector(), 100);
            return;
        }
        
        console.log(`Found ${worldButtons.length} world buttons`);
        
        worldButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent any default behavior
                e.stopPropagation(); // Stop event bubbling
                
                const world = btn.getAttribute('data-world');
                console.log(`World button clicked: ${world}`);
                console.log('Button element:', btn);
                console.log('Current active buttons:', document.querySelectorAll('.world-btn.active'));
                
                // Update active state
                worldButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                console.log('Dispatching worldChange event...');
                
                // Dispatch custom event for world change
                const event = new CustomEvent('worldChange', { 
                    detail: { world },
                    bubbles: true
                });
                window.dispatchEvent(event);
                
                console.log('worldChange event dispatched');
            });
        });
        
        console.log('World selector setup complete');
    }

    translatePart(part) {
        const translations = {
            'body': 'Lichaam',
            'ears': 'Oren',
            'belly': 'Buik',
            'feet': 'Voeten',
            'nose': 'Neus'
        };
        return translations[part] || part;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;

        // Add animation keyframes if not already present
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}