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
                y: 480,
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
                y: 480,
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
                y: 480,
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
        
        // Event listener for inventory select button
        document.getElementById('selectFromInventory').addEventListener('click', () => {
            this.selectFromInventory();
        });
    }

    closeMissionModal() {
        domManager.closeModal('missionModal');
        this.currentMissionPig = null;
    }

    selectFromInventory() {
        // Store current mission pig in game object for inventory to access
        this.game.currentMissionPig = this.currentMissionPig;
        // Open inventory
        this.game.inventory.openInventory();
        // Close mission modal
        domManager.closeModal('missionModal');
    }

    showMissionModal(pig) {
        this.currentMissionPig = pig;
        this.updateMissionModal();
        domManager.openModal({ id: 'missionModal' });
        eventSystem.emit(GameEvents.MISSION_START, pig);
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
        if (pig.missionItem === item.type && pig.missionProgress < pig.missionTarget) {
            pig.missionProgress++;
            this.updateMissionModal();
            
            if (pig.missionProgress >= pig.missionTarget) {
                // Mission completed!
                this.game.ui.showNotification(`Missie voltooid! Je hebt ${GAME_CONFIG.MISSION_REWARD} wortels verdiend! 🎉`);
                this.game.player.carrots += GAME_CONFIG.MISSION_REWARD;
                
                // Give accessory to pig if it's an accessory mission
                if (pig.missionItem === 'bow' || pig.missionItem === 'hat' || pig.missionItem === 'glasses') {
                    pig.accessory = pig.missionItem;
                }
                
                // Emit mission complete event
                eventSystem.emit(GameEvents.MISSION_COMPLETE, {
                    pig: pig,
                    reward: GAME_CONFIG.MISSION_REWARD
                });
            } else {
                // Emit mission progress event
                eventSystem.emit(GameEvents.MISSION_PROGRESS, {
                    pig: pig,
                    progress: pig.missionProgress,
                    target: pig.missionTarget
                });
            }
            
            return true; // Item was used for mission
        }
        return false; // Item was not used
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
            ctx.translate(pig.x - camera.x, pig.y - camera.y);
            
            // Draw shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(0, 5, 30, 10, 0, 0, Math.PI * 2);
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