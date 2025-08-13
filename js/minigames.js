// Minigames module - handles various minigames for inventory items
export class Minigames {
    constructor(game) {
        this.game = game;
        this.activeMinigame = null;
        this.minigameModal = null;
        this.setupMinigameModal();
    }
    
    setupMinigameModal() {
        // Create minigame modal
        this.minigameModal = document.createElement('div');
        this.minigameModal.id = 'minigameModal';
        this.minigameModal.className = 'minigame-modal hidden';
        this.minigameModal.innerHTML = `
            <div class="minigame-content">
                <h2 id="minigameTitle">Minigame</h2>
                <div id="minigameArea" class="minigame-area"></div>
                <div id="minigameScore" class="minigame-score">Score: 0</div>
                <button class="modal-close-btn" id="closeMinigame">✖</button>
            </div>
        `;
        document.body.appendChild(this.minigameModal);
        
        // Event listeners
        document.getElementById('closeMinigame').addEventListener('click', () => this.closeMinigame());
        
        // ESC key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeMinigame) {
                this.closeMinigame();
            }
        });
    }
    
    startPuzzleMinigame() {
        this.activeMinigame = 'puzzle';
        document.getElementById('minigameTitle').textContent = '🧩 Puzzel Spel';
        
        const gameArea = document.getElementById('minigameArea');
        gameArea.innerHTML = '';
        
        // Create a simple sliding puzzle
        const puzzleSize = 3;
        const tiles = [];
        
        // Determine tile size based on screen width
        const screenWidth = window.innerWidth;
        let tileSize = 100;
        let gap = 5;
        
        if (screenWidth <= 480) {
            tileSize = 70;
            gap = 3;
        } else if (screenWidth <= 768) {
            tileSize = 85;
            gap = 4;
        }
        
        // Initialize puzzle grid
        const puzzleGrid = document.createElement('div');
        puzzleGrid.className = 'puzzle-grid';
        puzzleGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${puzzleSize}, ${tileSize}px);
            grid-template-rows: repeat(${puzzleSize}, ${tileSize}px);
            gap: ${gap}px;
            margin: 20px auto;
            width: fit-content;
        `;
        
        // Create tiles (0 represents empty space)
        for (let i = 0; i < puzzleSize * puzzleSize; i++) {
            tiles.push(i);
        }
        
        // Shuffle tiles
        this.shuffleArray(tiles);
        
        // Create tile elements
        tiles.forEach((value, index) => {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.dataset.value = value;
            tile.dataset.position = index;
            
            if (value === 0) {
                tile.classList.add('empty');
            } else {
                tile.textContent = value;
                tile.style.cssText = `
                    background: #667eea;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${screenWidth <= 480 ? '18px' : '24px'};
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    user-select: none;
                    -webkit-user-select: none;
                    -webkit-tap-highlight-color: transparent;
                `;
                
                tile.addEventListener('click', () => this.moveTile(index, tiles, puzzleSize));
                tile.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.moveTile(index, tiles, puzzleSize);
                });
            }
            
            puzzleGrid.appendChild(tile);
        });
        
        gameArea.appendChild(puzzleGrid);
        
        // Instructions
        const instructions = document.createElement('p');
        instructions.textContent = 'Klik op een tegel naast de lege ruimte om te schuiven!';
        instructions.style.textAlign = 'center';
        instructions.style.fontSize = screenWidth <= 480 ? '14px' : '16px';
        gameArea.appendChild(instructions);
        
        // Show modal
        this.minigameModal.classList.remove('hidden');
        
        // Store puzzle state
        this.puzzleState = { tiles, size: puzzleSize };
    }
    
    moveTile(clickedIndex, tiles, size) {
        const emptyIndex = tiles.indexOf(0);
        const clickedRow = Math.floor(clickedIndex / size);
        const clickedCol = clickedIndex % size;
        const emptyRow = Math.floor(emptyIndex / size);
        const emptyCol = emptyIndex % size;
        
        // Check if clicked tile is adjacent to empty space
        const isAdjacent = (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
                          (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);
        
        if (isAdjacent) {
            // Swap tiles
            tiles[emptyIndex] = tiles[clickedIndex];
            tiles[clickedIndex] = 0;
            
            // Update display
            this.updatePuzzleDisplay(tiles, size);
            
            // Check if puzzle is solved
            if (this.isPuzzleSolved(tiles)) {
                this.completePuzzle();
            }
        }
    }
    
    updatePuzzleDisplay(tiles, size) {
        const tileElements = document.querySelectorAll('.puzzle-tile');
        tiles.forEach((value, index) => {
            const tile = tileElements[index];
            tile.dataset.value = value;
            
            if (value === 0) {
                tile.className = 'puzzle-tile empty';
                tile.textContent = '';
                tile.style.background = 'transparent';
            } else {
                tile.className = 'puzzle-tile';
                tile.textContent = value;
                tile.style.background = '#667eea';
            }
        });
    }
    
    isPuzzleSolved(tiles) {
        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i] !== i + 1) return false;
        }
        return tiles[tiles.length - 1] === 0;
    }
    
    completePuzzle() {
        this.game.ui.showNotification('Goed gedaan! Je hebt de puzzel opgelost! +5 🥕');
        this.game.player.addCarrots(5);
        this.game.ui.updateDisplay();
        
        setTimeout(() => {
            this.closeMinigame();
        }, 2000);
    }
    
    startCatchMinigame() {
        this.activeMinigame = 'catch';
        document.getElementById('minigameTitle').textContent = '⚽ Vang de Bal';
        
        const gameArea = document.getElementById('minigameArea');
        gameArea.innerHTML = '';
        gameArea.style.position = 'relative';
        
        // Responsive game area height
        const screenWidth = window.innerWidth;
        const gameHeight = screenWidth <= 480 ? '300px' : '400px';
        
        gameArea.style.height = gameHeight;
        gameArea.style.background = '#87CEEB';
        gameArea.style.borderRadius = '10px';
        gameArea.style.overflow = 'hidden';
        gameArea.style.touchAction = 'none'; // Prevent scrolling on touch
        
        // Create ball with responsive size
        const ball = document.createElement('div');
        ball.className = 'catch-ball';
        ball.innerHTML = '⚽';
        ball.style.cssText = `
            position: absolute;
            font-size: ${screenWidth <= 480 ? '30px' : '40px'};
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            transition: none;
        `;
        
        // Create catcher (guinea pig) with responsive size
        const catcher = document.createElement('div');
        catcher.innerHTML = '🐹';
        catcher.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: ${screenWidth <= 480 ? '40px' : '50px'};
            user-select: none;
            -webkit-user-select: none;
        `;
        
        gameArea.appendChild(ball);
        gameArea.appendChild(catcher);
        
        // Game state
        let score = 0;
        let ballX = Math.random() * (gameArea.offsetWidth - 40);
        let ballY = 0;
        let ballSpeed = screenWidth <= 480 ? 1.5 : 2;
        let catcherX = gameArea.offsetWidth / 2;
        
        // Update score display
        document.getElementById('minigameScore').textContent = `Score: ${score}`;
        
        // Mouse/touch controls
        const moveCatcher = (clientX) => {
            const rect = gameArea.getBoundingClientRect();
            const catcherSize = screenWidth <= 480 ? 20 : 25;
            catcherX = Math.max(catcherSize, Math.min(gameArea.offsetWidth - catcherSize, clientX - rect.left));
            catcher.style.left = catcherX + 'px';
        };
        
        // Mouse events
        gameArea.addEventListener('mousemove', (e) => moveCatcher(e.clientX));
        
        // Touch events with better handling
        let touchActive = false;
        
        gameArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchActive = true;
            if (e.touches.length > 0) {
                moveCatcher(e.touches[0].clientX);
            }
        });
        
        gameArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (touchActive && e.touches.length > 0) {
                moveCatcher(e.touches[0].clientX);
            }
        });
        
        gameArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchActive = false;
        });
        
        // Game loop
        const gameLoop = setInterval(() => {
            ballY += ballSpeed;
            ball.style.left = ballX + 'px';
            ball.style.top = ballY + 'px';
            
            // Responsive catch detection
            const catchDistance = screenWidth <= 480 ? 35 : 40;
            const catchHeight = screenWidth <= 480 ? 80 : 100;
            
            // Check if caught
            if (ballY > gameArea.offsetHeight - catchHeight && 
                Math.abs(ballX + 20 - catcherX) < catchDistance) {
                score++;
                document.getElementById('minigameScore').textContent = `Score: ${score}`;
                
                // Reset ball
                ballX = Math.random() * (gameArea.offsetWidth - 40);
                ballY = 0;
                ballSpeed = Math.min(ballSpeed + 0.2, screenWidth <= 480 ? 6 : 8);
                
                if (score >= 10) {
                    clearInterval(gameLoop);
                    this.completeCatchGame(score);
                }
            }
            
            // Check if missed
            if (ballY > gameArea.offsetHeight) {
                ballX = Math.random() * (gameArea.offsetWidth - 40);
                ballY = 0;
            }
        }, 20);
        
        // Store game loop to clean up
        this.currentGameLoop = gameLoop;
        
        // Show modal
        this.minigameModal.classList.remove('hidden');
    }
    
    completeCatchGame(score) {
        this.game.ui.showNotification(`Geweldig! Je ving ${score} ballen! +${score} 🥕`);
        this.game.player.addCarrots(score);
        this.game.ui.updateDisplay();
        
        setTimeout(() => {
            this.closeMinigame();
        }, 2000);
    }
    
    startStackMinigame() {
        this.activeMinigame = 'stack';
        document.getElementById('minigameTitle').textContent = '🧱 Stapel de Blokken';
        
        const gameArea = document.getElementById('minigameArea');
        gameArea.innerHTML = '';
        gameArea.style.position = 'relative';
        
        // Responsive game area
        const screenWidth = window.innerWidth;
        const gameHeight = screenWidth <= 480 ? '300px' : '400px';
        
        gameArea.style.height = gameHeight;
        gameArea.style.background = '#f0f0f0';
        gameArea.style.borderRadius = '10px';
        gameArea.style.touchAction = 'none'; // Prevent scrolling
        
        // Create game elements
        const blocks = [];
        let currentBlock = null;
        let score = 0;
        let gameActive = true;
        
        // Responsive block dimensions
        const blockWidth = screenWidth <= 480 ? 60 : 80;
        const blockHeight = screenWidth <= 480 ? 25 : 30;
        const baseWidth = screenWidth <= 480 ? 80 : 100;
        
        // Create base
        const base = document.createElement('div');
        base.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: ${baseWidth}px;
            height: 20px;
            background: #333;
        `;
        gameArea.appendChild(base);
        
        // Create moving block
        const createBlock = () => {
            const block = document.createElement('div');
            block.style.cssText = `
                position: absolute;
                top: 20px;
                left: 0;
                width: ${blockWidth}px;
                height: ${blockHeight}px;
                background: #667eea;
                border: 2px solid #5a67d8;
                border-radius: 5px;
            `;
            gameArea.appendChild(block);
            return block;
        };
        
        currentBlock = createBlock();
        let direction = 1;
        let speed = screenWidth <= 480 ? 1.5 : 2;
        
        // Movement loop
        const moveLoop = setInterval(() => {
            if (!gameActive || !currentBlock) return;
            
            const left = parseInt(currentBlock.style.left);
            const newLeft = left + (direction * speed);
            
            if (newLeft <= 0 || newLeft >= gameArea.offsetWidth - blockWidth) {
                direction *= -1;
            }
            
            currentBlock.style.left = newLeft + 'px';
        }, 20);
        
        // Click/touch to drop
        const dropBlock = () => {
            if (!gameActive || !currentBlock) return;
            
            // Drop the block
            const blockLeft = parseInt(currentBlock.style.left);
            const blockSpacing = blockHeight + 2;
            const blockTop = blocks.length > 0 ? 
                gameArea.offsetHeight - 20 - (blocks.length * blockSpacing) : 
                gameArea.offsetHeight - 20 - blockHeight - 2;
            
            currentBlock.style.top = blockTop + 'px';
            blocks.push({ element: currentBlock, left: blockLeft });
            
            // Check if block is properly stacked
            if (blocks.length > 1) {
                const prevBlock = blocks[blocks.length - 2];
                const offset = Math.abs(blockLeft - prevBlock.left);
                const maxOffset = screenWidth <= 480 ? 45 : 60;
                
                if (offset > maxOffset) {
                    // Block fell off
                    gameActive = false;
                    currentBlock.style.transform = 'rotate(45deg)';
                    currentBlock.style.top = (gameArea.offsetHeight - blockHeight) + 'px';
                    
                    clearInterval(moveLoop);
                    this.completeStackGame(score);
                    return;
                }
            }
            
            score++;
            document.getElementById('minigameScore').textContent = `Score: ${score}`;
            
            if (score >= 10) {
                gameActive = false;
                clearInterval(moveLoop);
                this.completeStackGame(score);
            } else {
                // Create new block
                currentBlock = createBlock();
                speed = Math.min(speed + 0.3, screenWidth <= 480 ? 4.5 : 6);
            }
        };
        
        // Add both click and touch support
        gameArea.addEventListener('click', dropBlock);
        gameArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            dropBlock();
        });
        
        // Store game loop
        this.currentGameLoop = moveLoop;
        
        // Show modal
        this.minigameModal.classList.remove('hidden');
    }
    
    completeStackGame(score) {
        this.game.ui.showNotification(`Goed gestapeld! Je stapelde ${score} blokken! +${score} 🥕`);
        this.game.player.addCarrots(score);
        this.game.ui.updateDisplay();
        
        setTimeout(() => {
            this.closeMinigame();
        }, 2000);
    }
    
    closeMinigame() {
        this.activeMinigame = null;
        this.minigameModal.classList.add('hidden');
        
        // Clean up any active game loops
        if (this.currentGameLoop) {
            clearInterval(this.currentGameLoop);
            this.currentGameLoop = null;
        }
        
        // Call specific cleanup if exists
        if (this.currentCleanup) {
            this.currentCleanup();
            this.currentCleanup = null;
        }
    }
    
    startBathMinigame() {
        this.activeMinigame = 'bath';
        document.getElementById('minigameTitle').textContent = '🛁 Badtijd - Tap snel om schoon te maken!';
        
        const gameArea = document.getElementById('minigameArea');
        gameArea.innerHTML = '';
        
        // Responsive canvas dimensions
        const screenWidth = window.innerWidth;
        let canvasWidth = 600;
        let canvasHeight = 400;
        
        if (screenWidth <= 480) {
            canvasWidth = Math.min(screenWidth - 40, 320);
            canvasHeight = 280;
        } else if (screenWidth <= 768) {
            canvasWidth = Math.min(screenWidth - 60, 500);
            canvasHeight = 350;
        }
        
        // Create canvas for bath minigame
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.cssText = `
            border: 2px solid #87CEEB;
            border-radius: 10px;
            cursor: pointer;
            background: linear-gradient(to bottom, #E0F6FF 0%, #B0E0E6 100%);
            max-width: 100%;
            display: block;
            margin: 0 auto;
            touch-action: none;
        `;
        gameArea.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let score = 0;
        let timeLeft = 30; // 30 seconds timer
        let gameActive = true;
        let tapEffects = []; // Array to store tap visual effects
        
        // Scale factors for responsive design
        const scaleFactor = canvasWidth / 600;
        
        // Create dirt spots with responsive sizing
        const dirtSpots = [];
        const numSpots = screenWidth <= 480 ? 8 : 12; // Fewer spots on mobile
        
        for (let i = 0; i < numSpots; i++) {
            dirtSpots.push({
                x: (150 + Math.random() * 300) * scaleFactor,
                y: (100 + Math.random() * 200) * scaleFactor,
                radius: (25 + Math.random() * 20) * scaleFactor,
                cleaned: false,
                id: i,
                tapCount: 0,
                requiredTaps: 3 + Math.floor(Math.random() * 3) // 3-5 taps needed per spot
            });
        }
        
        // Bath bubbles for decoration
        const bubbles = [];
        for (let i = 0; i < 15; i++) {
            bubbles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: (5 + Math.random() * 15) * scaleFactor,
                speed: (0.5 + Math.random() * 1.5) * scaleFactor,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
        
        // Timer setup
        const timerInterval = setInterval(() => {
            if (!gameActive) {
                clearInterval(timerInterval);
                return;
            }
            
            timeLeft--;
            if (timeLeft <= 0) {
                gameActive = false;
                clearInterval(timerInterval);
                
                // Game over
                setTimeout(() => {
                    if (score === numSpots) {
                        this.game.ui.showNotification('🎉 Perfect! Alles is schoon!');
                        this.game.player.addCarrots(15);
                    } else {
                        this.game.ui.showNotification(`⏰ Tijd is op! Je hebt ${score}/${numSpots} plekken schoongemaakt.`);
                        this.game.player.addCarrots(Math.floor(score * 1.5));
                    }
                    this.closeMinigame();
                }, 500);
            }
        }, 1000);
        
        // Draw function
        const draw = () => {
            // Clear canvas
            ctx.fillStyle = 'rgba(176, 224, 230, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw bubbles
            bubbles.forEach(bubble => {
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`;
                ctx.fill();
                ctx.strokeStyle = `rgba(255, 255, 255, ${bubble.opacity * 1.5})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            });
            
            // Draw bathtub edge
            ctx.beginPath();
            ctx.ellipse(canvas.width/2, canvas.height - 50 * scaleFactor, 250 * scaleFactor, 80 * scaleFactor, 0, 0, Math.PI);
            ctx.fillStyle = '#F0F0F0';
            ctx.fill();
            ctx.strokeStyle = '#D0D0D0';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw guinea pig body
            ctx.beginPath();
            ctx.ellipse(canvas.width/2, canvas.height/2, 150 * scaleFactor, 100 * scaleFactor, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#8B4513';
            ctx.fill();
            
            // Draw guinea pig head
            ctx.beginPath();
            ctx.ellipse(canvas.width/2 - 100 * scaleFactor, canvas.height/2 - 20 * scaleFactor, 60 * scaleFactor, 50 * scaleFactor, -0.2, 0, Math.PI * 2);
            ctx.fillStyle = '#A0522D';
            ctx.fill();
            
            // Draw eyes
            ctx.beginPath();
            ctx.arc(canvas.width/2 - 120 * scaleFactor, canvas.height/2 - 30 * scaleFactor, 8 * scaleFactor, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(canvas.width/2 - 80 * scaleFactor, canvas.height/2 - 25 * scaleFactor, 8 * scaleFactor, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();
            
            // Draw nose
            ctx.beginPath();
            ctx.ellipse(canvas.width/2 - 140 * scaleFactor, canvas.height/2 - 10 * scaleFactor, 8 * scaleFactor, 6 * scaleFactor, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#FF69B4';
            ctx.fill();
            
            // Draw ears
            ctx.beginPath();
            ctx.ellipse(canvas.width/2 - 110 * scaleFactor, canvas.height/2 - 60 * scaleFactor, 15 * scaleFactor, 20 * scaleFactor, -0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#8B4513';
            ctx.fill();
            
            ctx.beginPath();
            ctx.ellipse(canvas.width/2 - 70 * scaleFactor, canvas.height/2 - 55 * scaleFactor, 15 * scaleFactor, 20 * scaleFactor, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#8B4513';
            ctx.fill();
            
            // Draw dirt spots
            dirtSpots.forEach(spot => {
                if (!spot.cleaned) {
                    // Calculate opacity based on remaining taps
                    const opacity = 0.3 + (spot.tapCount / spot.requiredTaps) * 0.4;
                    
                    ctx.beginPath();
                    ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(101, 67, 33, ${opacity})`;
                    ctx.fill();
                    
                    // Add some texture
                    for (let i = 0; i < 5; i++) {
                        ctx.beginPath();
                        ctx.arc(
                            spot.x + (Math.random() - 0.5) * spot.radius,
                            spot.y + (Math.random() - 0.5) * spot.radius,
                            spot.radius * 0.2,
                            0, Math.PI * 2
                        );
                        ctx.fillStyle = `rgba(80, 52, 26, ${opacity * 0.7})`;
                        ctx.fill();
                    }
                    
                    // Show tap progress
                    if (spot.tapCount > 0) {
                        ctx.font = `bold ${14 * scaleFactor}px Arial`;
                        ctx.fillStyle = '#FFF';
                        ctx.textAlign = 'center';
                        ctx.fillText(`${spot.requiredTaps - spot.tapCount}`, spot.x, spot.y + 5);
                    }
                }
            });
            
            // Draw tap effects
            tapEffects = tapEffects.filter(effect => {
                effect.radius += 3;
                effect.opacity -= 0.05;
                
                if (effect.opacity > 0) {
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(135, 206, 235, ${effect.opacity})`;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    // Draw water splash effect
                    for (let i = 0; i < 5; i++) {
                        const angle = (Math.PI * 2 / 5) * i;
                        const splashX = effect.x + Math.cos(angle) * effect.radius * 0.7;
                        const splashY = effect.y + Math.sin(angle) * effect.radius * 0.7;
                        
                        ctx.beginPath();
                        ctx.arc(splashX, splashY, 5 * scaleFactor, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(173, 216, 230, ${effect.opacity})`;
                        ctx.fill();
                    }
                    
                    return true;
                }
                return false;
            });
            
            // Draw timer
            ctx.font = `bold ${24 * scaleFactor}px Arial`;
            ctx.fillStyle = timeLeft <= 10 ? '#FF4444' : '#333';
            ctx.textAlign = 'left';
            ctx.fillText(`⏰ ${timeLeft}s`, 20, 40);
            
            // Update score display
            document.getElementById('minigameScore').textContent = `Schoongemaakt: ${score}/${numSpots}`;
        };
        
        // Animation loop
        const animate = () => {
            if (this.activeMinigame !== 'bath') return;
            
            // Move bubbles
            bubbles.forEach(bubble => {
                bubble.y -= bubble.speed;
                if (bubble.y + bubble.radius < 0) {
                    bubble.y = canvas.height + bubble.radius;
                    bubble.x = Math.random() * canvas.width;
                }
            });
            
            draw();
            requestAnimationFrame(animate);
        };
        
        // Mouse/Touch events
        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.touches) {
                return {
                    x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
                    y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height)
                };
            }
            return {
                x: (e.clientX - rect.left) * (canvas.width / rect.width),
                y: (e.clientY - rect.top) * (canvas.height / rect.height)
            };
        };
        
        const handleTap = (e) => {
            if (!gameActive) return;
            
            e.preventDefault();
            const pos = getPos(e);
            
            // Add tap effect
            tapEffects.push({
                x: pos.x,
                y: pos.y,
                radius: 10 * scaleFactor,
                opacity: 1
            });
            
            // Check if tapping on dirt spots
            dirtSpots.forEach(spot => {
                if (!spot.cleaned) {
                    const dist = Math.sqrt(
                        Math.pow(pos.x - spot.x, 2) + 
                        Math.pow(pos.y - spot.y, 2)
                    );
                    
                    if (dist < spot.radius) {
                        spot.tapCount++;
                        
                        if (spot.tapCount >= spot.requiredTaps) {
                            spot.cleaned = true;
                            score++;
                            
                            // Check if all spots are cleaned
                            if (score === numSpots) {
                                gameActive = false;
                                setTimeout(() => {
                                    this.game.ui.showNotification('🎉 Perfect! Alles is schoon!');
                                    this.game.player.addCarrots(20);
                                    this.closeMinigame();
                                }, 500);
                            }
                        }
                    }
                }
            });
        };
        
        // Add both mouse and touch support
        canvas.addEventListener('mousedown', handleTap);
        canvas.addEventListener('touchstart', handleTap);
        
        // Show instructions
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            text-align: center;
            margin-top: 10px;
            color: #333;
            font-size: ${screenWidth <= 480 ? '14px' : '16px'};
            font-weight: bold;
        `;
        instructions.textContent = 'Tap snel op de vuile plekken om ze schoon te maken! Je hebt 30 seconden!';
        gameArea.appendChild(instructions);
        
        this.minigameModal.classList.remove('hidden');
        animate();
        
        // Store cleanup function
        this.currentCleanup = () => {
            clearInterval(timerInterval);
            gameActive = false;
        };
    }
    
    startMazeMinigame() {
        this.activeMinigame = 'maze';
        document.getElementById('minigameTitle').textContent = '🌀 Doolhof Spel';
        
        const gameArea = document.getElementById('minigameArea');
        gameArea.innerHTML = '';
        
        // Create canvas for maze
        const canvas = document.createElement('canvas');
        const screenWidth = window.innerWidth;
        const canvasSize = Math.min(screenWidth - 40, 500);
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        canvas.style.cssText = `
            border: 2px solid #333;
            border-radius: 10px;
            background-color: #f0f0f0;
            touch-action: none;
        `;
        gameArea.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Maze configuration
        const mazeSize = 10;
        const cellSize = canvasSize / mazeSize;
        let playerPos = { x: 0, y: 0 };
        const exitPos = { x: mazeSize - 1, y: mazeSize - 1 };
        let gameActive = true;
        let moveCount = 0;
        
        // Generate maze (simple maze with random walls)
        const maze = [];
        for (let y = 0; y < mazeSize; y++) {
            maze[y] = [];
            for (let x = 0; x < mazeSize; x++) {
                maze[y][x] = {
                    walls: {
                        top: true,
                        right: true,
                        bottom: true,
                        left: true
                    },
                    visited: false
                };
            }
        }
        
        // Generate maze using recursive backtracking
        const generateMaze = (x, y) => {
            maze[y][x].visited = true;
            
            // Get neighbors in random order
            const neighbors = [];
            if (y > 0 && !maze[y - 1][x].visited) neighbors.push({ x, y: y - 1, dir: 'top' });
            if (x < mazeSize - 1 && !maze[y][x + 1].visited) neighbors.push({ x: x + 1, y, dir: 'right' });
            if (y < mazeSize - 1 && !maze[y + 1][x].visited) neighbors.push({ x, y: y + 1, dir: 'bottom' });
            if (x > 0 && !maze[y][x - 1].visited) neighbors.push({ x: x - 1, y, dir: 'left' });
            
            this.shuffleArray(neighbors);
            
            for (const neighbor of neighbors) {
                if (!maze[neighbor.y][neighbor.x].visited) {
                    // Remove walls between current and neighbor
                    if (neighbor.dir === 'top') {
                        maze[y][x].walls.top = false;
                        maze[neighbor.y][neighbor.x].walls.bottom = false;
                    } else if (neighbor.dir === 'right') {
                        maze[y][x].walls.right = false;
                        maze[neighbor.y][neighbor.x].walls.left = false;
                    } else if (neighbor.dir === 'bottom') {
                        maze[y][x].walls.bottom = false;
                        maze[neighbor.y][neighbor.x].walls.top = false;
                    } else if (neighbor.dir === 'left') {
                        maze[y][x].walls.left = false;
                        maze[neighbor.y][neighbor.x].walls.right = false;
                    }
                    
                    generateMaze(neighbor.x, neighbor.y);
                }
            }
        };
        
        generateMaze(0, 0);
        
        // Draw maze
        const drawMaze = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw maze walls
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            
            for (let y = 0; y < mazeSize; y++) {
                for (let x = 0; x < mazeSize; x++) {
                    const cell = maze[y][x];
                    const cellX = x * cellSize;
                    const cellY = y * cellSize;
                    
                    ctx.beginPath();
                    if (cell.walls.top) {
                        ctx.moveTo(cellX, cellY);
                        ctx.lineTo(cellX + cellSize, cellY);
                    }
                    if (cell.walls.right) {
                        ctx.moveTo(cellX + cellSize, cellY);
                        ctx.lineTo(cellX + cellSize, cellY + cellSize);
                    }
                    if (cell.walls.bottom) {
                        ctx.moveTo(cellX, cellY + cellSize);
                        ctx.lineTo(cellX + cellSize, cellY + cellSize);
                    }
                    if (cell.walls.left) {
                        ctx.moveTo(cellX, cellY);
                        ctx.lineTo(cellX, cellY + cellSize);
                    }
                    ctx.stroke();
                }
            }
            
            // Draw exit
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(exitPos.x * cellSize + cellSize * 0.2, exitPos.y * cellSize + cellSize * 0.2, cellSize * 0.6, cellSize * 0.6);
            ctx.fillStyle = '#fff';
            ctx.font = `${cellSize * 0.4}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🏁', exitPos.x * cellSize + cellSize / 2, exitPos.y * cellSize + cellSize / 2);
            
            // Draw player
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(playerPos.x * cellSize + cellSize / 2, playerPos.y * cellSize + cellSize / 2, cellSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw cavia face on player
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(playerPos.x * cellSize + cellSize / 2 - cellSize * 0.1, playerPos.y * cellSize + cellSize / 2 - cellSize * 0.1, cellSize * 0.05, 0, Math.PI * 2);
            ctx.arc(playerPos.x * cellSize + cellSize / 2 + cellSize * 0.1, playerPos.y * cellSize + cellSize / 2 - cellSize * 0.1, cellSize * 0.05, 0, Math.PI * 2);
            ctx.fill();
        };
        
        // Handle movement
        const movePlayer = (dx, dy) => {
            if (!gameActive) return;
            
            const newX = playerPos.x + dx;
            const newY = playerPos.y + dy;
            
            // Check boundaries
            if (newX < 0 || newX >= mazeSize || newY < 0 || newY >= mazeSize) return;
            
            // Check walls
            const currentCell = maze[playerPos.y][playerPos.x];
            if (dx === 1 && currentCell.walls.right) return;
            if (dx === -1 && currentCell.walls.left) return;
            if (dy === 1 && currentCell.walls.bottom) return;
            if (dy === -1 && currentCell.walls.top) return;
            
            // Move player
            playerPos.x = newX;
            playerPos.y = newY;
            moveCount++;
            
            // Update score
            document.getElementById('minigameScore').textContent = `Stappen: ${moveCount}`;
            
            drawMaze();
            
            // Check win condition
            if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
                gameActive = false;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#fff';
                ctx.font = `${canvasSize / 10}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🎉 Gewonnen! 🎉', canvas.width / 2, canvas.height / 2);
                
                // Award carrots based on efficiency
                const reward = Math.max(10, 30 - Math.floor(moveCount / 5));
                this.game.ui.showNotification(`🥕 Je hebt ${reward} wortels verdiend!`);
                this.game.player.addCarrots(reward);
                
                setTimeout(() => this.closeMinigame(), 2000);
            }
        };
        
        // Keyboard controls
        const handleKeydown = (e) => {
            if (!gameActive) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    movePlayer(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    movePlayer(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    movePlayer(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    movePlayer(1, 0);
                    break;
            }
        };
        
        window.addEventListener('keydown', handleKeydown);
        
        // Touch controls
        let touchStartX = null;
        let touchStartY = null;
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (touchStartX === null || touchStartY === null) return;
            
            const touch = e.changedTouches[0];
            const dx = touch.clientX - touchStartX;
            const dy = touch.clientY - touchStartY;
            
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
            
            if (absDx > absDy) {
                // Horizontal swipe
                if (dx > 0) {
                    movePlayer(1, 0); // Right
                } else {
                    movePlayer(-1, 0); // Left
                }
            } else {
                // Vertical swipe
                if (dy > 0) {
                    movePlayer(0, 1); // Down
                } else {
                    movePlayer(0, -1); // Up
                }
            }
            
            touchStartX = null;
            touchStartY = null;
        });
        
        // Add control buttons for mobile
        const controlsDiv = document.createElement('div');
        controlsDiv.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
            gap: 5px;
            margin-top: 20px;
            justify-content: center;
        `;
        
        const createButton = (text, gridColumn, gridRow, onClick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                grid-column: ${gridColumn};
                grid-row: ${gridRow};
                font-size: 24px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                touch-action: manipulation;
            `;
            btn.addEventListener('click', onClick);
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                onClick();
            });
            return btn;
        };
        
        controlsDiv.appendChild(createButton('↑', '2', '1', () => movePlayer(0, -1)));
        controlsDiv.appendChild(createButton('←', '1', '2', () => movePlayer(-1, 0)));
        controlsDiv.appendChild(createButton('→', '3', '2', () => movePlayer(1, 0)));
        controlsDiv.appendChild(createButton('↓', '2', '3', () => movePlayer(0, 1)));
        
        gameArea.appendChild(controlsDiv);
        
        // Instructions
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            text-align: center;
            margin-top: 10px;
            color: #333;
            font-size: ${screenWidth <= 480 ? '14px' : '16px'};
        `;
        instructions.textContent = 'Vind de uitgang! Gebruik de pijltjestoetsen of swipe om te bewegen.';
        gameArea.appendChild(instructions);
        
        // Initial draw
        drawMaze();
        document.getElementById('minigameScore').textContent = `Stappen: ${moveCount}`;
        
        this.minigameModal.classList.remove('hidden');
        
        // Store cleanup function
        this.currentCleanup = () => {
            window.removeEventListener('keydown', handleKeydown);
            gameActive = false;
        };
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}