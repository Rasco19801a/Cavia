// Guinea Pig Missions module - handles NPC guinea pigs and their missions
import { GAME_CONFIG } from './config.js';
import { eventSystem, GameEvents } from './event-system.js';
import { domManager } from './dom-manager.js';

export class GuineaPigMissions {
    constructor(game) {
        this.game = game;
        this.otherGuineaPigs = [];
        this.currentMissionPig = null;
        this.missionModal = null;
        this.setupGuineaPigs();
        this.setupMissionModal();
    }

    setupGuineaPigs() {
        // Create 3 other guinea pigs in the home - spaced out evenly
        this.otherGuineaPigs = [
            {
                id: 1,
                name: 'Ginger',
                x: 600,
                y: 520,
                color: {
                    body: '#FFFFFF',  // White body
                    belly: '#F5DEB3'  // Beige belly
                },
                mission: 'Ik heb zo\'n honger! Breng me 3 wortels!',
                missionProgress: 0,
                missionTarget: 3,
                missionItem: 'carrot',
                accessory: null
            },
            {
                id: 2,
                name: 'Chinto',
                x: 900,
                y: 520,
                color: {
                    body: '#FFFFFF',  // White body
                    belly: '#000000'  // Black belly
                },
                mission: 'Ik wil graag een mooie strik!',
                missionProgress: 0,
                missionTarget: 1,
                missionItem: 'bow',
                accessory: null
            },
            {
                id: 3,
                name: 'Luxy',
                x: 1200,
                y: 520,
                color: {
                    body: '#FFFFFF',  // White body
                    belly: '#8B4513'  // Brown belly
                },
                mission: 'Help me 2 stukken sla te vinden!',
                missionProgress: 0,
                missionTarget: 2,
                missionItem: 'lettuce',
                accessory: null
            }
        ];
    }

    setupMissionModal() {
        // Create mission modal using DOM manager
        const modalContent = `
            <div class="mission-content">
                <h2 id="missionPigName">Missie</h2>
                <div class="mission-pig-icon">🐹</div>
                <p id="missionText"></p>
                <div class="mission-progress">
                    <div class="progress-bar">
                        <div id="progressFill" class="progress-fill"></div>
                    </div>
                    <p id="progressText"></p>
                </div>
                <button class="inventory-select-btn" id="selectFromInventory">Selecteer uit Rugzak 🎒</button>
                <button class="modal-close-btn" id="closeMission">✖</button>
            </div>
        `;
        
        this.missionModal = domManager.createModal({
            id: 'missionModal',
            className: 'mission-modal hidden',
            content: modalContent,
            closeButton: '#closeMission',
            closeOnEscape: true
        });
        
        // Remove the old event delegation approach
        // We'll add direct listeners when the modal is shown instead
        
        // Prevent clicks inside modal content from closing the modal
        const missionContent = this.missionModal.querySelector('.mission-content');
        if (missionContent) {
            missionContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    closeMissionModal() {
        domManager.closeModal('missionModal');
        this.currentMissionPig = null;
    }

    selectFromInventory() {
        console.log('Select from inventory clicked', this.currentMissionPig);
        
        // Check if we have a current mission pig
        if (!this.currentMissionPig) {
            console.error('No current mission pig!');
            return;
        }
        
        // Store current mission pig in game object for inventory to access
        this.game.currentMissionPig = this.currentMissionPig;
        
        // Close mission modal first
        domManager.closeModal('missionModal');
        
        // Force immediate inventory opening without delay
        if (this.game.inventory) {
            console.log('Opening inventory immediately...');
            this.game.inventory.openInventory();
        } else {
            console.error('Inventory not found in game object');
        }
    }

    showMissionModal(pig) {
        this.currentMissionPig = pig;
        this.updateMissionModal();
        domManager.openModal({ id: 'missionModal' });
        eventSystem.emit(GameEvents.MISSION_START, pig);
        
        // Add direct event listener to button after modal is shown
        setTimeout(() => {
            const inventoryBtn = document.getElementById('selectFromInventory');
            if (inventoryBtn) {
                // Remove any existing listeners first
                const newBtn = inventoryBtn.cloneNode(true);
                inventoryBtn.parentNode.replaceChild(newBtn, inventoryBtn);
                
                // Add fresh listener
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked - opening inventory');
                    this.selectFromInventory();
                });
                
                // Ensure button is not disabled
                newBtn.disabled = false;
                newBtn.style.pointerEvents = 'auto';
                newBtn.style.cursor = 'pointer';
            }
        }, 50);
    }

    updateMissionModal() {
        if (!this.currentMissionPig) return;
        
        const pig = this.currentMissionPig;
        document.getElementById('missionPigName').textContent = pig.name;
        document.getElementById('missionText').textContent = pig.mission;
        document.getElementById('progressText').textContent = `${pig.missionProgress}/${pig.missionTarget}`;
        
        const progressPercentage = (pig.missionProgress / pig.missionTarget) * 100;
        document.getElementById('progressFill').style.width = `${progressPercentage}%`;
        
        // Update button visibility
        const selectButton = document.getElementById('selectFromInventory');
        if (pig.missionProgress >= pig.missionTarget) {
            selectButton.style.display = 'none';
            document.getElementById('missionText').textContent = 'Bedankt voor je hulp! 🎉';
        } else {
            selectButton.style.display = 'block';
        }
    }

    handleMissionItem(item, pig) {
        if (pig.missionItem === item.id && pig.missionProgress < pig.missionTarget) {
            pig.missionProgress++;
            
            if (pig.missionProgress >= pig.missionTarget) {
                // Mission complete!
                this.game.ui.showNotification(`Missie voltooid! Je hebt ${GAME_CONFIG.MISSION_REWARD} wortels verdiend! 🎉`);
                this.game.player.carrots += GAME_CONFIG.MISSION_REWARD;
                this.game.ui.updateDisplay();
                
                // Give new mission
                this.updateMissionForPig(pig);
                
                // Remove the item used
                return true;
            } else {
                this.game.ui.showNotification(`Goed zo! Nog ${pig.missionTarget - pig.missionProgress} ${item.name} te gaan!`);
                return true;
            }
        }
        return false;
    }
    
    completeMission(pig) {
        // Give pig a new mission
        this.updateMissionForPig(pig);
        this.saveProgress();
    }
    
    updateMissionForPig(pig) {
        // Give pig a new mission
        const missions = [
            { item: 'carrot', target: 3, text: 'Ik heb weer honger! Breng me 3 wortels!' },
            { item: 'lettuce', target: 2, text: 'Ik wil graag 2 stukken sla!' },
            { item: 'cucumber', target: 2, text: 'Komkommers zijn lekker! Breng er 2!' },
            { item: 'corn', target: 1, text: 'Ik heb zin in mais! Breng me 1 mais!' },
            { item: 'hay_small', target: 1, text: 'Ik heb hooi nodig! Breng me een hooi pakket!' }
        ];
        
        const newMission = missions[Math.floor(Math.random() * missions.length)];
        pig.mission = newMission.text;
        pig.missionItem = newMission.item;
        pig.missionTarget = newMission.target;
        pig.missionProgress = 0;
    }

    checkGuineaPigClick(x, y) {
        for (const pig of this.otherGuineaPigs) {
            const distance = Math.sqrt(Math.pow(x - pig.x, 2) + Math.pow(y - pig.y, 2));
            if (distance < 50) {
                this.showMissionModal(pig);
                return true;
            }
        }
        return false;
    }

    drawGuineaPigs(ctx, camera) {
        this.otherGuineaPigs.forEach(pig => {
            ctx.save();
            // Don't apply camera offset here - it's already applied by game's camera transform
            ctx.translate(pig.x, pig.y);
            
            // Draw shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(0, 25, 30, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw guinea pig body
            ctx.fillStyle = pig.color.body;
            ctx.beginPath();
            ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw belly
            ctx.fillStyle = pig.color.belly;
            ctx.beginPath();
            ctx.ellipse(0, 5, 25, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw head
            ctx.fillStyle = pig.color.body;
            ctx.beginPath();
            ctx.arc(-25, -10, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw ears
            ctx.fillStyle = '#FFB6C1';
            ctx.beginPath();
            ctx.arc(-30, -25, 8, 0, Math.PI * 2);
            ctx.arc(-20, -25, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw eyes
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(-30, -10, 3, 0, Math.PI * 2);
            ctx.arc(-20, -10, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw nose
            ctx.fillStyle = '#FF69B4';
            ctx.beginPath();
            ctx.arc(-25, -5, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw accessory if pig has one
            if (pig.accessory) {
                this.drawAccessory(ctx, pig.accessory, -25, -30);
            }
            
            // Draw name
            ctx.fillStyle = 'black';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(pig.name, 0, -50);
            
            // Draw mission indicator if mission not complete
            if (pig.missionProgress < pig.missionTarget) {
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(0, -70, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'black';
                ctx.font = 'bold 16px Arial';
                ctx.fillText('!', 0, -65);
            }
            
            ctx.restore();
        });
    }

    drawAccessory(ctx, type, x, y) {
        switch(type) {
            case 'bow':
                ctx.fillStyle = '#FF69B4';
                ctx.beginPath();
                ctx.moveTo(x - 10, y);
                ctx.lineTo(x, y - 5);
                ctx.lineTo(x + 10, y);
                ctx.lineTo(x + 5, y + 5);
                ctx.lineTo(x, y + 3);
                ctx.lineTo(x - 5, y + 5);
                ctx.closePath();
                ctx.fill();
                break;
            case 'hat':
                ctx.fillStyle = '#4B0082';
                ctx.fillRect(x - 15, y - 5, 30, 5);
                ctx.fillRect(x - 10, y - 15, 20, 10);
                break;
            case 'glasses':
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x - 8, y, 6, 0, Math.PI * 2);
                ctx.arc(x + 8, y, 6, 0, Math.PI * 2);
                ctx.moveTo(x - 2, y);
                ctx.lineTo(x + 2, y);
                ctx.stroke();
                break;
        }
    }

    saveProgress() {
        return {
            guineaPigs: this.otherGuineaPigs.map(pig => ({
                id: pig.id,
                missionProgress: pig.missionProgress,
                accessory: pig.accessory
            }))
        };
    }

    loadProgress(data) {
        if (!data || !data.guineaPigs) return;
        
        data.guineaPigs.forEach(savedPig => {
            const pig = this.otherGuineaPigs.find(p => p.id === savedPig.id);
            if (pig) {
                pig.missionProgress = savedPig.missionProgress;
                pig.accessory = savedPig.accessory;
            }
        });
    }
}