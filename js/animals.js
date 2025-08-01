// Animals module - handles animal placement and educational challenges
import { CONFIG } from './config.js';

// Animal definitions for each world
export const ANIMALS = {
    stad: [
        { type: 'hond', name: 'Hond', emoji: '🐕', x: 300, y: 520 },
        { type: 'kat', name: 'Kat', emoji: '🐈', x: 600, y: 520 },
        { type: 'cavia', name: 'Cavia', emoji: '🐹', x: 900, y: 520 },
        { type: 'duif', name: 'Duif', emoji: '🕊️', x: 1200, y: 400 }
    ],
    natuur: [
        { type: 'das', name: 'Das', emoji: '🦡', x: 400, y: 480 },
        { type: 'vos', name: 'Vos', emoji: '🦊', x: 700, y: 480 },
        { type: 'konijn', name: 'Konijn', emoji: '🐰', x: 1000, y: 480 },
        { type: 'hert', name: 'Hert', emoji: '🦌', x: 1300, y: 470 }
    ],
    strand: [
        { type: 'schildpad', name: 'Schildpad', emoji: '🐢', x: 350, y: 550 },
        { type: 'krab', name: 'Krab', emoji: '🦀', x: 650, y: 550 },
        { type: 'zeehond', name: 'Zeehond', emoji: '🦭', x: 950, y: 480 },
        { type: 'meeuw', name: 'Meeuw', emoji: '🦅', x: 1250, y: 350 }
    ],
    winter: [
        { type: 'pinguin', name: 'Pinguïn', emoji: '🐧', x: 400, y: 480 },
        { type: 'ijsbeer', name: 'IJsbeer', emoji: '🐻‍❄️', x: 700, y: 480 },
        { type: 'rendier', name: 'Rendier', emoji: '🦌', x: 1000, y: 480 },
        { type: 'sneeuwuil', name: 'Sneeuwuil', emoji: '🦉', x: 1300, y: 400 }
    ],
    woestijn: [
        { type: 'kameel', name: 'Kameel', emoji: '🐪', x: 450, y: 480 },
        { type: 'slang', name: 'Slang', emoji: '🐍', x: 750, y: 520 },
        { type: 'schorpioen', name: 'Schorpioen', emoji: '🦂', x: 1050, y: 520 },
        { type: 'hagedis', name: 'Hagedis', emoji: '🦎', x: 1350, y: 510 }
    ],
    jungle: [
        { type: 'aap', name: 'Aap', emoji: '🐵', x: 400, y: 400 },
        { type: 'leeuw', name: 'Leeuw', emoji: '🦁', x: 700, y: 480 },
        { type: 'tijger', name: 'Tijger', emoji: '🐅', x: 1000, y: 480 },
        { type: 'papegaai', name: 'Papegaai', emoji: '🦜', x: 1300, y: 350 }
    ],
    zwembad: [
        { type: 'eend', name: 'Eend', emoji: '🦆', x: 500, y: 450 },
        { type: 'kikker', name: 'Kikker', emoji: '🐸', x: 800, y: 520 },
        { type: 'vis', name: 'Vis', emoji: '🐠', x: 650, y: 480 },
        { type: 'flamingo', name: 'Flamingo', emoji: '🦩', x: 1100, y: 470 }
    ],
    dierenstad: [
        { type: 'paard', name: 'Paard', emoji: '🐴', x: 350, y: 480 },
        { type: 'ezel', name: 'Ezel', emoji: '🫏', x: 650, y: 480 },
        { type: 'koe', name: 'Koe', emoji: '🐄', x: 950, y: 480 },
        { type: 'varken', name: 'Varken', emoji: '🐷', x: 1250, y: 480 }
    ]
};

// Spelling words for group 7 level
const SPELLING_WORDS = [
    'bibliotheek', 'gymnasium', 'chocolade', 'politieagent', 'ziekenhuis',
    'vakantie', 'restaurant', 'computer', 'telefoon', 'televisie',
    'olifant', 'krokodil', 'giraffe', 'nijlpaard', 'chimpansee',
    'muziekinstrument', 'vioolspelen', 'pianolessen', 'gitaarakkoord',
    'wetenschapper', 'laboratorium', 'experiment', 'microscoop',
    'geschiedenis', 'aardrijkskunde', 'natuurkunde', 'scheikunde',
    'brandweerauto', 'ambulance', 'helikopter', 'vliegtuig',
    'zwembad', 'voetbalveld', 'tennisbaan', 'schaatsbaan',
    'ontbijt', 'middageten', 'avondmaaltijd', 'tussendoortje',
    'vriendschap', 'eerlijkheid', 'behulpzaam', 'verantwoordelijk',
    'belangrijk', 'moeilijk', 'makkelijk', 'mogelijk', 'onmogelijk',
    'gezellig', 'vrolijk', 'verdrietig', 'boos', 'blij',
    'pannenkoek', 'appelmoes', 'aardappel', 'spaghetti', 'macaroni',
    'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag',
    'januari', 'februari', 'augustus', 'september', 'december',
    'schrijven', 'tekenen', 'rekenen', 'lezen', 'spelen',
    'Nederland', 'België', 'Duitsland', 'Frankrijk', 'Engeland',
    'hoofdstad', 'provincie', 'gemeente', 'dorpje', 'wereldstad'
];

export class AnimalChallenge {
    constructor(game) {
        this.game = game;
        this.currentChallenge = null;
        this.challengeModal = null;
        this.audio = new Audio(); // For pronouncing words
        this.setupModal();
    }

    setupModal() {
        // Create challenge modal
        this.challengeModal = document.createElement('div');
        this.challengeModal.id = 'challengeModal';
        this.challengeModal.className = 'challenge-modal hidden';
        this.challengeModal.innerHTML = `
            <div class="challenge-content">
                <h2 id="challengeTitle">Kies je opdracht!</h2>
                <div id="challengeChoice" class="challenge-choice">
                    <button class="challenge-btn" id="taalBtn">
                        <span class="emoji">📝</span>
                        <span>Taalopdracht</span>
                    </button>
                    <button class="challenge-btn" id="rekenBtn">
                        <span class="emoji">🔢</span>
                        <span>Rekenopdracht</span>
                    </button>
                </div>
                <div id="challengeTask" class="challenge-task hidden">
                    <p id="taskDescription"></p>
                    <div id="taskInput"></div>
                    <button id="submitAnswer" class="submit-btn">Controleer</button>
                    <button id="repeatWord" class="repeat-btn hidden">🔊 Herhaal woord</button>
                </div>
                <button class="close-btn" id="closeChallenge">✖</button>
                <div id="feedback" class="feedback hidden"></div>
            </div>
        `;
        document.body.appendChild(this.challengeModal);

        // Event listeners
        document.getElementById('taalBtn').addEventListener('click', () => this.startSpellingChallenge());
        document.getElementById('rekenBtn').addEventListener('click', () => this.startMathChallenge());
        document.getElementById('submitAnswer').addEventListener('click', () => this.checkAnswer());
        document.getElementById('closeChallenge').addEventListener('click', () => this.closeChallenge());
        document.getElementById('repeatWord').addEventListener('click', () => this.pronounceWord());
        
        // Enter key to submit
        this.challengeModal.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !document.getElementById('challengeTask').classList.contains('hidden')) {
                this.checkAnswer();
            }
        });
    }

    showChallenge(animal) {
        this.currentAnimal = animal;
        this.challengeModal.classList.remove('hidden');
        document.getElementById('challengeChoice').classList.remove('hidden');
        document.getElementById('challengeTask').classList.add('hidden');
        document.getElementById('feedback').classList.add('hidden');
        document.getElementById('challengeTitle').textContent = `${animal.name} heeft een opdracht voor je!`;
    }

    startSpellingChallenge() {
        const word = SPELLING_WORDS[Math.floor(Math.random() * SPELLING_WORDS.length)];
        this.currentChallenge = {
            type: 'spelling',
            word: word,
            answer: word.toLowerCase()
        };

        document.getElementById('challengeChoice').classList.add('hidden');
        document.getElementById('challengeTask').classList.remove('hidden');
        document.getElementById('taskDescription').textContent = 'Luister goed en typ het woord dat je hoort:';
        document.getElementById('taskInput').innerHTML = '<input type="text" id="answerInput" placeholder="Typ hier het woord...">';
        document.getElementById('repeatWord').classList.remove('hidden');
        
        // Pronounce the word
        this.pronounceWord();

        // Focus on input
        document.getElementById('answerInput').focus();
    }

    startMathChallenge() {
        const table = Math.floor(Math.random() * 10) + 1;
        const multiplier = Math.floor(Math.random() * 10) + 1;
        const answer = table * multiplier;

        this.currentChallenge = {
            type: 'math',
            question: `${table} × ${multiplier}`,
            answer: answer
        };

        document.getElementById('challengeChoice').classList.add('hidden');
        document.getElementById('challengeTask').classList.remove('hidden');
        document.getElementById('taskDescription').textContent = 'Los deze tafelsom op:';
        document.getElementById('taskInput').innerHTML = `
            <div class="math-question">${table} × ${multiplier} = </div>
            <input type="number" id="answerInput" placeholder="?">
        `;
        document.getElementById('repeatWord').classList.add('hidden');

        // Focus on input
        document.getElementById('answerInput').focus();
    }

    pronounceWord() {
        if (this.currentChallenge.type === 'spelling') {
            // Use Web Speech API for pronunciation
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(this.currentChallenge.word);
                utterance.lang = 'nl-NL';
                utterance.rate = 0.8; // Slower for clarity
                speechSynthesis.speak(utterance);
            }
        }
    }

    checkAnswer() {
        const input = document.getElementById('answerInput');
        const userAnswer = input.value.trim().toLowerCase();
        const feedback = document.getElementById('feedback');
        
        let correct = false;
        if (this.currentChallenge.type === 'spelling') {
            correct = userAnswer === this.currentChallenge.answer;
        } else if (this.currentChallenge.type === 'math') {
            correct = parseInt(userAnswer) === this.currentChallenge.answer;
        }

        feedback.classList.remove('hidden');
        
        if (correct) {
            feedback.innerHTML = '<span class="success">🎉 Goed gedaan!</span>';
            feedback.className = 'feedback success';
            
            // Award coins
            const coinsEarned = 10;
            this.game.player.addCoins(coinsEarned);
            
            // Update UI to show coins earned
            setTimeout(() => {
                feedback.innerHTML += `<br>Je hebt ${coinsEarned} muntjes verdiend!`;
            }, 500);
            
            // Close modal after success
            setTimeout(() => {
                this.closeChallenge();
            }, 2000);
        } else {
            feedback.innerHTML = '<span class="error">❌ Helaas, probeer het nog eens!</span>';
            feedback.className = 'feedback error';
            
            if (this.currentChallenge.type === 'spelling') {
                setTimeout(() => {
                    feedback.innerHTML += `<br>Het juiste antwoord was: ${this.currentChallenge.word}`;
                }, 1000);
            }
            
            // Clear input for retry
            input.value = '';
            input.focus();
        }
    }

    closeChallenge() {
        this.challengeModal.classList.add('hidden');
        this.currentChallenge = null;
    }
}

// Draw animals in the world
export function drawAnimals(ctx, worldType, cameraX, cameraY) {
    const animals = ANIMALS[worldType] || [];
    
    animals.forEach(animal => {
        // Calculate screen position
        const screenX = animal.x - cameraX;
        const screenY = animal.y - cameraY;
        
        // Only draw if on screen
        if (screenX > -50 && screenX < ctx.canvas.width + 50) {
            // Draw animal emoji
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(animal.emoji, screenX, screenY);
            
            // Draw interactive glow
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 30, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}

// Check if player clicked on an animal
export function checkAnimalClick(worldType, worldX, worldY) {
    const animals = ANIMALS[worldType] || [];
    
    for (const animal of animals) {
        const distance = Math.sqrt(
            Math.pow(worldX - animal.x, 2) + 
            Math.pow(worldY - animal.y, 2)
        );
        
        if (distance < 40) { // Click radius
            return animal;
        }
    }
    
    return null;
}