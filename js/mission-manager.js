// Mission Manager - handles mission modal and inventory integration
import { GAME_CONFIG } from './config.js';
import { eventSystem, GameEvents } from './event-system.js';

export class MissionManager {
    constructor(game) {
        this.game = game;
        this.currentMission = null;
        this.modal = null;
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        // Create modal element
        this.modal = document.createElement('div');
        this.modal.className = 'mission-modal hidden';
        this.modal.innerHTML = `
            <div class="mission-content">
                <button class="modal-close-btn" id="closeMissionBtn">✖</button>
                <h2 id="missionTitle">Missie</h2>
                <div class="mission-pig-icon">🐹</div>
                <p id="missionDescription"></p>
                <div class="mission-progress">
                    <div class="progress-bar">
                        <div id="missionProgressBar" class="progress-fill"></div>
                    </div>
                    <p id="missionProgressText">0/0</p>
                </div>
                <button class="inventory-select-btn" id="openInventoryBtn">
                    Selecteer uit Rugzak 🎒
                </button>
            </div>
        `;
        document.body.appendChild(this.modal);
    }

    setupEventListeners() {
        // Close button
        const closeBtn = this.modal.querySelector('#closeMissionBtn');
        closeBtn.addEventListener('click', () => this.closeModal());

        // Inventory button
        const inventoryBtn = this.modal.querySelector('#openInventoryBtn');
        inventoryBtn.addEventListener('click', () => this.openInventory());

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    showMission(missionData) {
        this.currentMission = missionData;
        this.updateModalContent();
        this.modal.classList.remove('hidden');
        eventSystem.emit(GameEvents.MISSION_START, missionData);
    }

    updateModalContent() {
        if (!this.currentMission) return;

        const { name, mission, progress, target, isHorse } = this.currentMission;
        
        this.modal.querySelector('#missionTitle').textContent = name;
        this.modal.querySelector('#missionDescription').textContent = mission;
        this.modal.querySelector('#missionProgressText').textContent = `${progress}/${target}`;
        
        // Update the icon based on animal type
        const iconElement = this.modal.querySelector('.mission-pig-icon');
        if (iconElement) {
            iconElement.textContent = isHorse ? '🐴' : '🐹';
        }
        
        const progressPercent = (progress / target) * 100;
        this.modal.querySelector('#missionProgressBar').style.width = `${progressPercent}%`;

        // Hide inventory button if mission is complete
        const inventoryBtn = this.modal.querySelector('#openInventoryBtn');
        if (progress >= target) {
            inventoryBtn.style.display = 'none';
            this.modal.querySelector('#missionDescription').textContent = 'Bedankt voor je hulp! 🎉';
        } else {
            inventoryBtn.style.display = 'block';
        }
    }

    openInventory() {
        // Store mission context
        this.game.activeMission = this.currentMission;
        
        // Close mission modal
        this.modal.classList.add('hidden');
        
        // Open inventory
        if (this.game.inventory) {
            this.game.inventory.openInventory();
        }
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.currentMission = null;
        this.game.activeMission = null;
    }

    reopenAfterInventory() {
        if (this.currentMission) {
            this.showMission(this.currentMission);
        }
    }

    updateProgress(progress) {
        if (this.currentMission) {
            this.currentMission.progress = progress;
            this.updateModalContent();
        }
    }

    completeMission(missionData = null) {
        const context = this.currentMission || missionData || null;
        
        // Emit completion event with available context
        eventSystem.emit(GameEvents.MISSION_COMPLETE, context || {});
        
        // Reward the player
        this.game.ui.showNotification(`Missie voltooid! Je hebt ${GAME_CONFIG.MISSION_REWARD} wortels verdiend! 🎉`);
        this.game.player.carrots += GAME_CONFIG.MISSION_REWARD;
        this.game.ui.updateDisplay();
        
        // Celebration modal with appropriate animal
        const emoji = context && context.isHorse ? '🐴' : '🐹';
        this.game.ui.showCelebrationModal({
            title: 'Missie voltooid!',
            message: 'Geweldig gedaan! De missie is afgerond.',
            rewardText: `+${GAME_CONFIG.MISSION_REWARD} wortels 🥕`,
            emoji
        });
    }
    
    isMissionModalVisible() {
        return this.modal && !this.modal.classList.contains('hidden');
    }

    updateMissionProgress(progress, target) {
        if (this.currentMission) {
            this.currentMission.progress = progress;
            this.currentMission.target = target;
            this.updateModalContent();
        }
    }
}