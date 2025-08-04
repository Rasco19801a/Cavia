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
                <button class="close-btn" id="closeMinigame">✖</button>
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
        
        // Initialize puzzle grid
        const puzzleGrid = document.createElement('div');
        puzzleGrid.className = 'puzzle-grid';
        puzzleGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${puzzleSize}, 100px);
            grid-template-rows: repeat(${puzzleSize}, 100px);
            gap: 5px;
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
                    font-size: 24px;
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                `;
                
                tile.addEventListener('click', () => this.moveTile(index, tiles, puzzleSize));
            }
            
            puzzleGrid.appendChild(tile);
        });
        
        gameArea.appendChild(puzzleGrid);
        
        // Instructions
        const instructions = document.createElement('p');
        instructions.textContent = 'Klik op een tegel naast de lege ruimte om te schuiven!';
        instructions.style.textAlign = 'center';
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
        this.game.player.carrots += 5;
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
        gameArea.style.height = '400px';
        gameArea.style.background = '#87CEEB';
        gameArea.style.borderRadius = '10px';
        gameArea.style.overflow = 'hidden';
        
        // Create ball
        const ball = document.createElement('div');
        ball.className = 'catch-ball';
        ball.innerHTML = '⚽';
        ball.style.cssText = `
            position: absolute;
            font-size: 40px;
            cursor: pointer;
            user-select: none;
            transition: none;
        `;
        
        // Create catcher (guinea pig)
        const catcher = document.createElement('div');
        catcher.innerHTML = '🐹';
        catcher.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 50px;
            user-select: none;
        `;
        
        gameArea.appendChild(ball);
        gameArea.appendChild(catcher);
        
        // Game state
        let score = 0;
        let ballX = Math.random() * (gameArea.offsetWidth - 40);
        let ballY = 0;
        let ballSpeed = 2;
        let catcherX = gameArea.offsetWidth / 2;
        
        // Update score display
        document.getElementById('minigameScore').textContent = `Score: ${score}`;
        
        // Mouse/touch controls
        const moveCatcher = (clientX) => {
            const rect = gameArea.getBoundingClientRect();
            catcherX = Math.max(25, Math.min(gameArea.offsetWidth - 25, clientX - rect.left));
            catcher.style.left = catcherX + 'px';
        };
        
        gameArea.addEventListener('mousemove', (e) => moveCatcher(e.clientX));
        gameArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                moveCatcher(e.touches[0].clientX);
            }
        });
        
        // Game loop
        const gameLoop = setInterval(() => {
            ballY += ballSpeed;
            ball.style.left = ballX + 'px';
            ball.style.top = ballY + 'px';
            
            // Check if caught
            if (ballY > gameArea.offsetHeight - 100 && 
                Math.abs(ballX + 20 - catcherX) < 40) {
                score++;
                document.getElementById('minigameScore').textContent = `Score: ${score}`;
                
                // Reset ball
                ballX = Math.random() * (gameArea.offsetWidth - 40);
                ballY = 0;
                ballSpeed = Math.min(ballSpeed + 0.2, 8);
                
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
        this.game.player.carrots += score;
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
        gameArea.style.height = '400px';
        gameArea.style.background = '#f0f0f0';
        gameArea.style.borderRadius = '10px';
        
        // Create game elements
        const blocks = [];
        let currentBlock = null;
        let score = 0;
        let gameActive = true;
        
        // Create base
        const base = document.createElement('div');
        base.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
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
                width: 80px;
                height: 30px;
                background: #667eea;
                border: 2px solid #5a67d8;
                border-radius: 5px;
            `;
            gameArea.appendChild(block);
            return block;
        };
        
        currentBlock = createBlock();
        let direction = 1;
        let speed = 2;
        
        // Movement loop
        const moveLoop = setInterval(() => {
            if (!gameActive || !currentBlock) return;
            
            const left = parseInt(currentBlock.style.left);
            const newLeft = left + (direction * speed);
            
            if (newLeft <= 0 || newLeft >= gameArea.offsetWidth - 80) {
                direction *= -1;
            }
            
            currentBlock.style.left = newLeft + 'px';
        }, 20);
        
        // Click to drop
        gameArea.addEventListener('click', () => {
            if (!gameActive || !currentBlock) return;
            
            // Drop the block
            const blockLeft = parseInt(currentBlock.style.left);
            const blockTop = blocks.length > 0 ? 
                gameArea.offsetHeight - 20 - (blocks.length * 32) : 
                gameArea.offsetHeight - 52;
            
            currentBlock.style.top = blockTop + 'px';
            blocks.push({ element: currentBlock, left: blockLeft });
            
            // Check if block is properly stacked
            if (blocks.length > 1) {
                const prevBlock = blocks[blocks.length - 2];
                const offset = Math.abs(blockLeft - prevBlock.left);
                
                if (offset > 60) {
                    // Block fell off
                    gameActive = false;
                    currentBlock.style.transform = 'rotate(45deg)';
                    currentBlock.style.top = (gameArea.offsetHeight - 30) + 'px';
                    
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
                speed = Math.min(speed + 0.3, 6);
            }
        });
        
        // Store game loop
        this.currentGameLoop = moveLoop;
        
        // Show modal
        this.minigameModal.classList.remove('hidden');
    }
    
    completeStackGame(score) {
        this.game.ui.showNotification(`Goed gestapeld! Je stapelde ${score} blokken! +${score} 🥕`);
        this.game.player.carrots += score;
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
    }
    
    startBathMinigame() {
        this.activeMinigame = 'bath';
        document.getElementById('minigameTitle').textContent = '🛁 Badtijd - Maak de Cavia Schoon!';
        
        const gameArea = document.getElementById('minigameArea');
        gameArea.innerHTML = '';
        
        // Create canvas for bath minigame
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        canvas.style.cssText = `
            border: 2px solid #87CEEB;
            border-radius: 10px;
            cursor: pointer;
            background: linear-gradient(to bottom, #E0F6FF 0%, #B0E0E6 100%);
        `;
        gameArea.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let score = 0;
        let isMouseDown = false;
        let cleanedSpots = new Set();
        
        // Create dirt spots
        const dirtSpots = [];
        const numSpots = 8;
        
        for (let i = 0; i < numSpots; i++) {
            dirtSpots.push({
                x: 150 + Math.random() * 300,
                y: 100 + Math.random() * 200,
                radius: 20 + Math.random() * 15,
                cleaned: false,
                id: i
            });
        }
        
        // Bath bubbles for decoration
        const bubbles = [];
        for (let i = 0; i < 15; i++) {
            bubbles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 5 + Math.random() * 15,
                speed: 0.5 + Math.random() * 1.5,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
        
        // Sponge position
        let spongeX = 0;
        let spongeY = 0;
        
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
            ctx.ellipse(canvas.width/2, canvas.height - 50, 250, 80, 0, 0, Math.PI);
            ctx.fillStyle = '#F0F0F0';
            ctx.fill();
            ctx.strokeStyle = '#D0D0D0';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw guinea pig body
            ctx.beginPath();
            ctx.ellipse(canvas.width/2, canvas.height/2, 150, 100, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#8B4513';
            ctx.fill();
            
            // Draw guinea pig head
            ctx.beginPath();
            ctx.ellipse(canvas.width/2 - 100, canvas.height/2 - 20, 60, 50, -0.2, 0, Math.PI * 2);
            ctx.fillStyle = '#A0522D';
            ctx.fill();
            
            // Draw eyes
            ctx.beginPath();
            ctx.arc(canvas.width/2 - 120, canvas.height/2 - 30, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(canvas.width/2 - 80, canvas.height/2 - 25, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();
            
            // Draw nose
            ctx.beginPath();
            ctx.ellipse(canvas.width/2 - 140, canvas.height/2 - 10, 8, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#FF69B4';
            ctx.fill();
            
            // Draw ears
            ctx.beginPath();
            ctx.ellipse(canvas.width/2 - 110, canvas.height/2 - 60, 15, 20, -0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#8B4513';
            ctx.fill();
            
            ctx.beginPath();
            ctx.ellipse(canvas.width/2 - 70, canvas.height/2 - 55, 15, 20, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#8B4513';
            ctx.fill();
            
            // Draw dirt spots
            dirtSpots.forEach(spot => {
                if (!spot.cleaned) {
                    ctx.beginPath();
                    ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(101, 67, 33, 0.6)';
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
                        ctx.fillStyle = 'rgba(80, 52, 26, 0.4)';
                        ctx.fill();
                    }
                }
            });
            
            // Draw sponge if mouse is down
            if (isMouseDown) {
                // Sponge
                ctx.beginPath();
                ctx.rect(spongeX - 30, spongeY - 20, 60, 40);
                ctx.fillStyle = '#FFD700';
                ctx.fill();
                ctx.strokeStyle = '#FFA500';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Sponge texture
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 4; j++) {
                        ctx.beginPath();
                        ctx.arc(spongeX - 25 + i * 10, spongeY - 15 + j * 10, 2, 0, Math.PI * 2);
                        ctx.fillStyle = '#FFA500';
                        ctx.fill();
                    }
                }
                
                // Soap bubbles around sponge
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        spongeX + (Math.random() - 0.5) * 50,
                        spongeY + (Math.random() - 0.5) * 50,
                        5 + Math.random() * 5,
                        0, Math.PI * 2
                    );
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.fill();
                }
            }
            
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
        
        // Mouse events
        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };
        
        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            const pos = getMousePos(e);
            spongeX = pos.x;
            spongeY = pos.y;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                const pos = getMousePos(e);
                spongeX = pos.x;
                spongeY = pos.y;
                
                // Check if cleaning dirt spots
                dirtSpots.forEach(spot => {
                    if (!spot.cleaned) {
                        const dist = Math.sqrt(
                            Math.pow(pos.x - spot.x, 2) + 
                            Math.pow(pos.y - spot.y, 2)
                        );
                        
                        if (dist < spot.radius + 20) {
                            spot.cleaned = true;
                            score++;
                            
                            // Check if all spots are cleaned
                            if (score === numSpots) {
                                setTimeout(() => {
                                    this.game.ui.showNotification('🎉 Perfect! De cavia is helemaal schoon!');
                                    this.game.player.addCarrots(10);
                                    this.closeMinigame();
                                }, 500);
                            }
                        }
                    }
                });
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
        
        // Show instructions
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            text-align: center;
            margin-top: 10px;
            color: #333;
            font-size: 16px;
        `;
        instructions.textContent = 'Gebruik de spons om alle vuile plekken schoon te maken!';
        gameArea.appendChild(instructions);
        
        this.minigameModal.classList.remove('hidden');
        animate();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}