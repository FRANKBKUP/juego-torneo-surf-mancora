/**
 * main.js
 * Lógica principal del juego: gameLoop, controles, victoria/derrota
 */

const canvas = document.getElementById('surfCanvas');
const ctx = canvas.getContext('2d');

const gameState = {
    score: 0,
    currentLevel: 1,
    frameCount: 0,
    time: 0,
    backgroundX: 0,
    isGameOver: false,
    suns: [],
    obstacles: [],
    particles: [],
};

// Control del bucle de animación
let rafId = null;  // [FIX-01] ID del requestAnimationFrame activo
let isLoopRunning = false; // Evita instancias simultáneas del bucle

const VICTORY_SCORE = 800;

// Datos del jugador autenticado (null = no autenticado)
let currentPlayer = null;

// Referencias a la UI
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('currentLevel');
const playerNameDisplay = document.getElementById('playerName');
const authScreen = document.getElementById('authScreen');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const btnRegister = document.getElementById('btnRegister');
const btnLogin = document.getElementById('btnLogin');
const authMessage = document.getElementById('authMessage');
const btnRetry = document.getElementById('btnRetry');

// NUEVO: Referencias a botones de inicio/paneles
const btnHome = document.getElementById('btnHome');
const leaderboardList = document.getElementById('leaderboard-list');
const myBest = document.getElementById('myBest');
const myLevel = document.getElementById('myLevel');
const myGames = document.getElementById('myGames');

// Event listeners para botones
btnRetry.addEventListener('click', restartGame);
btnHome.addEventListener('click', goToHome);

const player = new Surfer(canvas.width / 2);

const keys = {
    ArrowLeft: false,
    ArrowRight: false
};


// ──────────────────────────────────────────────────────────────
// RESET DE ESTADO
// ──────────────────────────────────────────────────────────────

function resetGameState() {
    gameState.score = 0;
    gameState.currentLevel = 1;
    gameState.frameCount = 0;
    gameState.time = 0;
    gameState.backgroundX = 0;
    gameState.isGameOver = false;
    gameState.suns = [];
    gameState.obstacles = [];
    gameState.particles = [];
}


// ──────────────────────────────────────────────────────────────
// CONTROLES
// ──────────────────────────────────────────────────────────────

window.addEventListener('keydown', (e) => {
    if (Object.prototype.hasOwnProperty.call(keys, e.code)) {
        keys[e.code] = true;
    }
    if (e.code === 'Space') {
        e.preventDefault(); // BLOQUEA el scroll del navegador
        player.jump();
    }
});

window.addEventListener('keyup', (e) => {
    if (Object.prototype.hasOwnProperty.call(keys, e.code)) {
        keys[e.code] = false;
    }
});


// ──────────────────────────────────────────────────────────────
// AUTENTICACIÓN
// ──────────────────────────────────────────────────────────────

btnRegister.addEventListener('click', async () => {
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (user === "" || pass === "") {
        authMessage.style.color = "red";
        authMessage.innerText = "Debes ingresar un Nickname y contraseña.";
        return;
    }

    authMessage.style.color = "blue";
    authMessage.innerText = "Procesando...";

    try {
        const response = await fetch('http://localhost/backend/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const result = await response.json();

        authMessage.style.color = result.status === "success" ? "green" : "red";
        authMessage.innerText = result.message;

        if (result.status === "success") {
            passwordInput.value = "";
        }

    } catch (error) {
        console.error("Error en el registro:", error);
        authMessage.style.color = "red";
        authMessage.innerText = "❌ Error de conexión. Verifica que XAMPP esté encendido.";
    }
});


// ──────────────────────────────────────────────────────────────
// LOGIN
// ──────────────────────────────────────────────────────────────

btnLogin.addEventListener('click', async () => {
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (user === "" || pass === "") {
        authMessage.style.color = "red";
        authMessage.innerText = "Debes ingresar tu Nickname y contraseña.";
        return;
    }

    authMessage.style.color = "blue";
    authMessage.innerText = "Validando credenciales...";

    const result = await loginUser(user, pass);

    if (result.status === "success") {
        authMessage.style.color = "green";
        authMessage.innerText = result.message;

        currentPlayer = {
            id: result.user_id,
            username: result.username
        };

        playerNameDisplay.innerText = currentPlayer.username;

        setTimeout(() => {
            authScreen.style.display = "none";

            resetGameState(); // [FIX-19]

            scoreDisplay.innerText = "0";
            levelDisplay.innerText = "1";

            // Cargar leaderboard y récord personal al iniciar
            loadLeaderboard();
            loadPlayerStats(currentPlayer.username);

            gameLoop();
        }, 500);

    } else {
        authMessage.style.color = "red";
        authMessage.innerText = result.message;
    }
});


// ──────────────────────────────────────────────────────────────
// NUEVO: FUNCIÓN PARA VOLVER AL INICIO
// ──────────────────────────────────────────────────────────────

/**
 * Vuelve a la pantalla de autenticación, permitiendo cambiar usuario
 * o jugar de nuevo. Cancela el bucle del juego y resetea todo.
 */
function goToHome() {
    // Cancelar cualquier animación pendiente
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    isLoopRunning = false;

    // Ocultar botones y mostrar pantalla de login
    btnHome.style.display = 'none';
    btnRetry.style.display = 'none';
    authScreen.style.display = 'flex';

    // Limpiar inputs
    usernameInput.value = '';
    passwordInput.value = '';
    authMessage.innerText = '';

    // Reset del jugador y estado del juego
    currentPlayer = null;
    playerNameDisplay.innerText = 'Invitado';
    resetGameState();
}


// ──────────────────────────────────────────────────────────────
// NUEVO: CARGAR ESTADÍSTICAS DEL JUGADOR
// ──────────────────────────────────────────────────────────────

/**
 * Consulta el servidor para obtener:
 * - Mejor puntaje del jugador
 * - Nivel máximo alcanzado
 * - Total de partidas jugadas
 */
async function loadPlayerStats(username) {
    try {
        const response = await fetch(
            `http://localhost/backend/player-stats.php?username=${encodeURIComponent(username)}`
        );
        const data = await response.json();

        if (data.status === "success") {
            myBest.innerText = data.best_score || '—';
            myLevel.innerText = data.max_level || '—';
            myGames.innerText = data.total_games || '—';
        }
    } catch (error) {
        console.error('Error cargando estadísticas del jugador:', error);
    }
}


// ──────────────────────────────────────────────────────────────
// RENDERIZADO DEL ENTORNO
// ──────────────────────────────────────────────────────────────

function drawEnvironment() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Fondo seamless
    if (assets.images.fondo) {
        gameState.backgroundX -= 1;

        const overlap = 5;
        if (gameState.backgroundX <= -(canvas.width - overlap)) {
            gameState.backgroundX = 0;
        }

        const x = Math.floor(gameState.backgroundX);
        ctx.drawImage(assets.images.fondo, x, 0, canvas.width, canvas.height);
        ctx.drawImage(assets.images.fondo, x + canvas.width - overlap, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Sol decorativo
    ctx.save();
    ctx.beginPath();
    ctx.arc(700, 100, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // 3. Ola matemática
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    for (let x = 0; x <= canvas.width; x++) {
        const y = PhysicsEngine.getWaveY(x, gameState.time);
        ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 105, 148, 0.8)';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}


// ──────────────────────────────────────────────────────────────
// PARTÍCULAS
// ──────────────────────────────────────────────────────────────

function handleParticles() {
    // [FIX-03] Cap de 60 partículas máximo
    if ((keys.ArrowLeft || keys.ArrowRight) && gameState.particles.length < 60) {
        gameState.particles.push(new Particle(player.x, player.y));
        gameState.particles.push(new Particle(player.x, player.y));
    }

    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        gameState.particles[i].update();
        gameState.particles[i].draw(ctx);

        if (gameState.particles[i].life <= 0) {
            gameState.particles.splice(i, 1);
        }
    }
}


// ──────────────────────────────────────────────────────────────
// SOLES COLECCIONABLES
// ──────────────────────────────────────────────────────────────

function handleSuns() {
    if (gameState.frameCount % 180 === 0) {
        const waveY = PhysicsEngine.getWaveY(canvas.width, gameState.time);
        gameState.suns.push(
            new Sun(canvas.width + 50, waveY - (60 + Math.random() * 40))
        );
    }

    for (let i = gameState.suns.length - 1; i >= 0; i--) {
        const sun = gameState.suns[i];

        const dx = player.x - sun.x;
        const dy = player.y - sun.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 50) {
            gameState.score += gameState.currentLevel === 1 ? 50 : 100;
            gameState.suns.splice(i, 1);
            console.log("☀️ Sol atrapado");
            continue;
        }

        sun.x -= 3;
        sun.draw(ctx);

        if (sun.x < -50) {
            gameState.suns.splice(i, 1);
        }
    }
}


// ──────────────────────────────────────────────────────────────
// BUCLE PRINCIPAL
// ──────────────────────────────────────────────────────────────

function gameLoop() {
    // [FIX-02] Prevenir instancias simultáneas
    if (isLoopRunning) return;
    isLoopRunning = true;

    function tick() {
        if (gameState.isGameOver) {
            isLoopRunning = false;
            return;
        }

        gameState.time++;
        gameState.frameCount++;

        if (gameState.currentLevel === 1) {
            if (keys.ArrowLeft) player.move('left', canvas.width);
            if (keys.ArrowRight) player.move('right', canvas.width);

            player.update(gameState.time, gameState.currentLevel);

            const tiltDifficulty = Math.abs(player.angle);
            player.x -= tiltDifficulty * 10;

            if (player.x < 0) {
                endGame(false);
                return;
            }

            // [FIX-04] Score simplificado
            gameState.score += 0.1 + tiltDifficulty;
            scoreDisplay.innerText = Math.floor(gameState.score);

            drawEnvironment();
            handleSuns();
            player.draw(ctx);
            handleParticles();

            if (gameState.score >= 400) {
                gameState.currentLevel = 2;
                levelDisplay.innerText = "2";
                console.log("¡Pasaste al Nivel 2!");
            }

        } else if (gameState.currentLevel === 2) {
            if (keys.ArrowLeft) player.move('left', canvas.width);
            if (keys.ArrowRight) player.move('right', canvas.width);

            player.update(gameState.time, gameState.currentLevel);

            if (!player.isJumping) {
                gameState.score += 0.2;
            }

            scoreDisplay.innerText = Math.floor(gameState.score);

            drawEnvironment();
            handleSuns();

            if (gameState.frameCount % 90 === 0) {
                const waveY = PhysicsEngine.getWaveY(canvas.width, gameState.time);
                gameState.obstacles.push(new Obstacle(canvas.width, waveY));
            }

            for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
                const obs = gameState.obstacles[i];

                obs.update();
                obs.draw(ctx);

                const dx = player.x - obs.x;
                const dy = player.y - obs.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < obs.radius + 20) {
                    endGame(false);
                    return;
                }

                if (obs.x + obs.radius < 0) {
                    gameState.obstacles.splice(i, 1);
                }
            }

            player.draw(ctx);
            handleParticles();

            // [FIX-08] ctx.save/restore para no contaminar el estado del contexto
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("¡Esquiva saltando con ESPACIO!", 400, 50);
            ctx.restore();
        }

        // [FIX-05] Condición de victoria con Math.floor para consistencia
        if (gameState.currentLevel === 2 && Math.floor(gameState.score) >= VICTORY_SCORE) {
            endGame(true);
        } else {
            rafId = requestAnimationFrame(tick); // [FIX-01]
        }
    }

    rafId = requestAnimationFrame(tick);
}


// ──────────────────────────────────────────────────────────────
// PRECARGA Y ARRANQUE
// ──────────────────────────────────────────────────────────────

window.onload = async () => {
    console.log("Iniciando precarga de assets...");

    try {
        await Promise.all([
            assets.loadImage('surfer', 'assets/surfista.png'),
            assets.loadImage('fondo', 'assets/fondo.png'),
            assets.loadImage('tortuga', 'assets/tortuga.png')
        ]);

        console.log("¡Assets listos! Esperando que el jugador inicie sesión...");
    } catch (error) {
        console.error("Error cargando assets:", error);
    }
};


// ──────────────────────────────────────────────────────────────
// FIN DEL JUEGO
// ──────────────────────────────────────────────────────────────

function endGame(isVictory) {
    gameState.isGameOver = true;
    isLoopRunning = false; // [FIX-02]

    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';

    if (isVictory) {
        ctx.fillText("¡LLEGASTE A LA META!", canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '20px Arial';
        ctx.fillText(
            `Puntaje Final: ${Math.floor(gameState.score)}`,
            canvas.width / 2,
            canvas.height / 2 + 10
        );
        ctx.restore();

        setTimeout(async () => {
            if (currentPlayer) {
                const result = await saveGameSession(
                    currentPlayer.username,
                    Math.floor(gameState.score),
                    gameState.currentLevel
                );

                ctx.save();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.textAlign = 'center';

                if (result.success) {
                    // [FIX-07] Solo mostramos lo que el backend realmente envía
                    ctx.fillStyle = '#00FF00';
                    ctx.font = 'bold 28px Arial';
                    ctx.fillText(result.message, canvas.width / 2, canvas.height / 2);
                } else {
                    ctx.fillStyle = 'red';
                    ctx.font = '20px Arial';
                    ctx.fillText(
                        "⚠️ Error al guardar: " + result.message,
                        canvas.width / 2,
                        canvas.height / 2
                    );
                }

                ctx.restore();

                // NUEVO: Mostrar botones de inicio y retry después de guardar
                setTimeout(() => {
                    btnHome.style.display = 'block';
                    btnRetry.style.display = 'none'; // En victoria, solo mostramos btnHome
                    // Actualizar leaderboard y estadísticas
                    loadLeaderboard();
                    loadPlayerStats(currentPlayer.username);
                }, 500);

            } else {

                console.log("Partida finalizada sin usuario autenticado. Puntaje no guardado.");
                setTimeout(() => {
                    btnRetry.style.display = 'block';
                }, 500);
            }
        }, 500);

    } else {
        ctx.fillStyle = 'red';
        ctx.fillText("¡ GAME OVER !", canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(
            "Presiona el botón para volver a intentarlo.",
            canvas.width / 2,
            canvas.height / 2 + 10
        );
        ctx.restore();

        btnRetry.style.display = "block";
    }
}


// ──────────────────────────────────────────────────────────────
// REINICIO
// ──────────────────────────────────────────────────────────────

function restartGame() {

    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    isLoopRunning = false; // [FIX-02]

    resetGameState();

    player.x = canvas.width / 2;
    player.y = 0;
    player.angle = 0;
    player.velocityY = 0;
    player.isJumping = false;

    scoreDisplay.innerText = "0";
    levelDisplay.innerText = "1";
    btnRetry.style.display = "none";
    btnHome.style.display = "none"; // Asegurar que btnHome también se oculte

    gameLoop();
}