// Animals module - handles animal placement and educational challenges
import { CONFIG } from './config.js';

// Animal definitions for each world
export const ANIMALS = {
    stad: [
        { type: 'hond', name: 'Hond', emoji: '🐕', x: 300, y: 520, color: { body: '#8B4513', belly: '#D2691E' } },
        { type: 'kat', name: 'Kat', emoji: '🐈', x: 600, y: 520, color: { body: '#696969', belly: '#A9A9A9' } },
        { type: 'cavia', name: 'Cavia', emoji: '🐹', x: 900, y: 520, color: { body: '#DEB887', belly: '#F5DEB3' } },
        { type: 'duif', name: 'Duif', emoji: '🕊️', x: 1200, y: 400, color: { body: '#778899', belly: '#B0C4DE' } }
    ],
    natuur: [
        { type: 'das', name: 'Das', emoji: '🦡', x: 400, y: 480, color: { body: '#2F4F4F', belly: '#FFFFFF' } },
        { type: 'vos', name: 'Vos', emoji: '🦊', x: 700, y: 480, color: { body: '#FF6347', belly: '#FFDAB9' } },
        { type: 'konijn', name: 'Konijn', emoji: '🐰', x: 1000, y: 480, color: { body: '#F5F5DC', belly: '#FFFFFF' } },
        { type: 'hert', name: 'Hert', emoji: '🦌', x: 1300, y: 470, color: { body: '#8B4513', belly: '#DEB887' } }
    ],
    strand: [
        { type: 'schildpad', name: 'Schildpad', emoji: '🐢', x: 350, y: 550, color: { body: '#228B22', belly: '#90EE90' } },
        { type: 'krab', name: 'Krab', emoji: '🦀', x: 650, y: 550, color: { body: '#DC143C', belly: '#FA8072' } },
        { type: 'zeehond', name: 'Zeehond', emoji: '🦭', x: 950, y: 480, color: { body: '#708090', belly: '#DCDCDC' } },
        { type: 'meeuw', name: 'Meeuw', emoji: '🦅', x: 1250, y: 350, color: { body: '#FFFFFF', belly: '#F5F5F5' } }
    ],
    winter: [
        { type: 'pinguin', name: 'Pinguïn', emoji: '🐧', x: 400, y: 480, color: { body: '#000000', belly: '#FFFFFF' } },
        { type: 'ijsbeer', name: 'IJsbeer', emoji: '🐻‍❄️', x: 700, y: 480, color: { body: '#FFFFFF', belly: '#F8F8FF' } },
        { type: 'rendier', name: 'Rendier', emoji: '🦌', x: 1000, y: 480, color: { body: '#8B4513', belly: '#DEB887' } },
        { type: 'sneeuwuil', name: 'Sneeuwuil', emoji: '🦉', x: 1300, y: 400, color: { body: '#FFFFFF', belly: '#F0F8FF' } }
    ],
    woestijn: [
        { type: 'kameel', name: 'Kameel', emoji: '🐪', x: 450, y: 480, color: { body: '#D2691E', belly: '#F4A460' } },
        { type: 'slang', name: 'Slang', emoji: '🐍', x: 750, y: 520, color: { body: '#556B2F', belly: '#8FBC8F' } },
        { type: 'schorpioen', name: 'Schorpioen', emoji: '🦂', x: 1050, y: 520, color: { body: '#8B4513', belly: '#A0522D' } },
        { type: 'hagedis', name: 'Hagedis', emoji: '🦎', x: 1350, y: 510, color: { body: '#228B22', belly: '#90EE90' } }
    ],
    jungle: [
        { type: 'aap', name: 'Aap', emoji: '🐵', x: 400, y: 400, color: { body: '#8B4513', belly: '#D2691E' } },
        { type: 'leeuw', name: 'Leeuw', emoji: '🦁', x: 700, y: 480, color: { body: '#DAA520', belly: '#F0E68C' } },
        { type: 'tijger', name: 'Tijger', emoji: '🐅', x: 1000, y: 480, color: { body: '#FF8C00', belly: '#FFDAB9' } },
        { type: 'papegaai', name: 'Papegaai', emoji: '🦜', x: 1300, y: 350, color: { body: '#FF0000', belly: '#FFFF00' } }
    ],
    zwembad: [
        { type: 'eend', name: 'Eend', emoji: '🦆', x: 500, y: 450, color: { body: '#FFFF00', belly: '#FFFFFF' } },
        { type: 'kikker', name: 'Kikker', emoji: '🐸', x: 800, y: 520, color: { body: '#228B22', belly: '#90EE90' } },
        { type: 'vis', name: 'Vis', emoji: '🐠', x: 650, y: 480, color: { body: '#FF6347', belly: '#FFA07A' } },
        { type: 'flamingo', name: 'Flamingo', emoji: '🦩', x: 1100, y: 470, color: { body: '#FF69B4', belly: '#FFB6C1' } }
    ],
    dierenstad: [
        { type: 'paard', name: 'Paard', emoji: '🐴', x: 350, y: 480, color: { body: '#8B4513', belly: '#A0522D' } },
        { type: 'ezel', name: 'Ezel', emoji: '🫏', x: 650, y: 480, color: { body: '#808080', belly: '#A9A9A9' } },
        { type: 'koe', name: 'Koe', emoji: '🐄', x: 950, y: 480, color: { body: '#000000', belly: '#FFFFFF' } },
        { type: 'varken', name: 'Varken', emoji: '🐷', x: 1250, y: 480, color: { body: '#FFC0CB', belly: '#FFE4E1' } }
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
        document.getElementById('taskInput').innerHTML = '<input type="text" id="answerInput" placeholder="Typ hier het woord..." autocorrect="off" autocomplete="off" spellcheck="false">';
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
            
            // Award carrots
            const carrotsEarned = 10;
            this.game.player.addCarrots(carrotsEarned);
            
            // Update UI to show carrots earned
            setTimeout(() => {
                feedback.innerHTML += `<br>Je hebt ${carrotsEarned} wortels verdiend!`;
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

// Draw guinea pig style animal
function drawGuineaPigStyleAnimal(ctx, animal, screenX, screenY, scale = 0.4) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 10, 25, 15, 0, 0, Math.PI);
    ctx.fill();

    // Head
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, -20, 30, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears - adjusted for different animals
    ctx.fillStyle = animal.color.body;
    if (animal.type === 'konijn' || animal.type === 'ezel') {
        // Long ears
        ctx.beginPath();
        ctx.ellipse(-12, -35, 8, 20, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, -35, 8, 20, 0.2, 0, Math.PI * 2);
        ctx.fill();
    } else if (animal.type === 'kat' || animal.type === 'leeuw' || animal.type === 'tijger') {
        // Pointed ears
        ctx.beginPath();
        ctx.moveTo(-15, -30);
        ctx.lineTo(-10, -45);
        ctx.lineTo(-5, -30);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(15, -30);
        ctx.lineTo(10, -45);
        ctx.lineTo(5, -30);
        ctx.closePath();
        ctx.fill();
    } else {
        // Regular ears
        ctx.beginPath();
        ctx.ellipse(-15, -30, 10, 15, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(15, -30, 10, 15, 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Feet
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-20, 20, 10, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(20, 20, 10, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-10, -20, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -20, 3, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.ellipse(0, -10, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Special features for certain animals
    if (animal.type === 'leeuw') {
        // Mane
        ctx.fillStyle = '#B8860B';
        ctx.beginPath();
        ctx.arc(0, -20, 35, 0, Math.PI * 2);
        ctx.fill();
        // Redraw head on top
        ctx.fillStyle = animal.color.body;
        ctx.beginPath();
        ctx.ellipse(0, -20, 30, 25, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (animal.type === 'tijger') {
        // Stripes
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-20, -10);
        ctx.lineTo(-15, -5);
        ctx.moveTo(20, -10);
        ctx.lineTo(15, -5);
        ctx.moveTo(-10, 5);
        ctx.lineTo(-5, 10);
        ctx.moveTo(10, 5);
        ctx.lineTo(5, 10);
        ctx.stroke();
    }

    // Name label
    ctx.restore();
    ctx.fillStyle = 'black';
    ctx.font = '12px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(animal.name, screenX, screenY + 40);

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Interactive glow
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}

// Draw animals in the world
export function drawAnimals(ctx, worldType, cameraX, cameraY) {
    const animals = ANIMALS[worldType] || [];
    
    animals.forEach(animal => {
        // Draw at world coordinates - camera transform is already applied
        // Only draw if on screen
        const screenX = animal.x - cameraX;
        const screenY = animal.y - cameraY;
        
        if (screenX > -50 && screenX < ctx.canvas.width + 50) {
            // Draw guinea pig style animal at world coordinates
            drawGuineaPigStyleAnimal(ctx, animal, animal.x, animal.y);
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