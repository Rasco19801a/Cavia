// Screen Manager - handles the flow between different screens
export class ScreenManager {
    constructor() {
        this.selectedTables = [];
        this.selectedDifficulties = [];
        
        console.log('ScreenManager initialized');
        this.setupTablesScreen();
        this.setupDifficultyScreen();
    }
    
    setupTablesScreen() {
        console.log('Setting up tables screen...');
        const tablesScreen = document.getElementById('tablesScreen');
        const nextBtn = document.getElementById('tablesNextBtn');
        const checkboxes = document.querySelectorAll('.table-checkbox');
        
        console.log('Found elements:', {
            tablesScreen: !!tablesScreen,
            nextBtn: !!nextBtn,
            checkboxCount: checkboxes.length
        });
        
        // Enable/disable next button based on selection
        const updateNextButton = () => {
            const checkedBoxes = document.querySelectorAll('.table-checkbox:checked');
            nextBtn.disabled = checkedBoxes.length === 0;
            console.log('Update button - checked boxes:', checkedBoxes.length, 'disabled:', nextBtn.disabled);
        };
        
        // Add event listeners to checkboxes
        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => {
                console.log(`Checkbox ${index + 1} (value: ${checkbox.value}) changed to:`, e.target.checked);
                updateNextButton();
            });
        });
        
        console.log('Event listeners attached to', checkboxes.length, 'checkboxes');
        
        // Handle next button click
        nextBtn.addEventListener('click', () => {
            console.log('Next button clicked');
            // Collect selected tables
            this.selectedTables = Array.from(document.querySelectorAll('.table-checkbox:checked'))
                .map(cb => parseInt(cb.value));
            
            console.log('Selected tables:', this.selectedTables);
            
            // Save to localStorage
            localStorage.setItem('selectedTables', JSON.stringify(this.selectedTables));
            
            // Hide tables screen and show difficulty screen
            tablesScreen.classList.add('hidden');
            document.getElementById('difficultyScreen').classList.remove('hidden');
        });
        
        // Initial button state
        updateNextButton();
    }
    
    setupDifficultyScreen() {
        const difficultyScreen = document.getElementById('difficultyScreen');
        const nextBtn = document.getElementById('difficultyNextBtn');
        const checkboxes = document.querySelectorAll('.difficulty-checkbox');
        
        // Enable/disable next button based on selection
        const updateNextButton = () => {
            const checkedBoxes = document.querySelectorAll('.difficulty-checkbox:checked');
            nextBtn.disabled = checkedBoxes.length === 0;
        };
        
        // Add event listeners to checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateNextButton);
        });
        
        // Handle next button click
        nextBtn.addEventListener('click', () => {
            // Collect selected difficulties
            this.selectedDifficulties = Array.from(document.querySelectorAll('.difficulty-checkbox:checked'))
                .map(cb => parseInt(cb.value));
            
            // Save to localStorage
            localStorage.setItem('selectedDifficulties', JSON.stringify(this.selectedDifficulties));
            
            // Hide difficulty screen and show customization screen
            difficultyScreen.classList.add('hidden');
            document.getElementById('customizationScreen').classList.remove('hidden');
        });
    }
    
    // Static method to get saved selections
    static getGameSettings() {
        const tables = localStorage.getItem('selectedTables');
        const difficulties = localStorage.getItem('selectedDifficulties');
        
        return {
            selectedTables: tables ? JSON.parse(tables) : [1, 2, 3, 4, 5],
            selectedDifficulties: difficulties ? JSON.parse(difficulties) : [6, 7]
        };
    }
    
    // Check if settings exist (for skipping screens on reload)
    static hasSettings() {
        return localStorage.getItem('selectedTables') !== null && 
               localStorage.getItem('selectedDifficulties') !== null;
    }
}