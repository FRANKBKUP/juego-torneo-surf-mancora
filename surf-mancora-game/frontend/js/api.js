/**
 * api.js
 * Gestiona la comunicación asíncrona con el Backend usando fetch().
 * Versión estabilizada: Comunicación directa basada en nombre de jugador
 * 
 * MODIFICADO: Agregada función loadLeaderboard() para cargar top 5 puntajes
 */

// ═══════════════════════════════════════════════════════════════
// 1. LOGIN DE USUARIO
// ═══════════════════════════════════════════════════════════════
async function loginUser(username, password) {
    console.log("🔐 Validando credenciales en XAMPP...");

    const payload = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('http://localhost/backend/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log("✅ Respuesta del servidor:", result.message);
        return result;
    } catch (error) {
        console.error("❌ Error en la conexión de login:", error);
        return {
            status: "error",
            message: "Error de conexión con el servidor."
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// 2. GUARDAR SESIÓN DE JUEGO (ESTABILIZADO)
// ═══════════════════════════════════════════════════════════════
async function saveGameSession(playerName, finalScore, finalLevel) {
    console.log("💾 Enviando datos de sesión al servidor...");

    // Hemos eliminado la lógica de checksums y user_id temporalmente 
    // para asegurar la compatibilidad con nuestra base de datos limpia.
    const payload = {
        player_name: playerName, // Volvemos a usar el nombre del jugador
        score: finalScore,
        level: finalLevel
    };

    try {
        console.log("📤 Payload enviado:", payload);

        const response = await fetch('http://localhost/backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log("📥 Respuesta del servidor:", result);

        if (result.status === "success") {
            console.log("✅ Puntaje guardado exitosamente!");
            return { success: true, message: result.message };
        } else {
            console.error("❌ Error:", result.message);
            return { success: false, message: result.message };
        }
    } catch (error) {
        console.error("❌ Error en la conexión asíncrona:", error);
        return { success: false, message: "Error de conexión con el servidor." };
    }
}

// ═══════════════════════════════════════════════════════════════
// NUEVO: 3. CARGAR LEADERBOARD (TOP 5 PUNTAJES)
// ═══════════════════════════════════════════════════════════════

/**
 * Consulta el servidor para obtener los top 5 mejores puntajes
 * de todos los jugadores. Actualiza el panel izquierdo con los
 * resultados en tiempo real.
 * 
 * Formato esperado del servidor:
 * [
 *   { player_name: "FRANK1", score: 1333 },
 *   { player_name: "franksuanima", score: 1309 },
 *   ...
 * ]
 */
async function loadLeaderboard() {
    console.log("🏆 Cargando tabla de puntajes...");

    try {
        const response = await fetch('http://localhost/backend/leaderboard.php');

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Referencia al elemento donde se mostrará el leaderboard
        const leaderboardList = document.getElementById('leaderboard-list');

        if (!leaderboardList) {
            console.warn("⚠️ Elemento #leaderboard-list no encontrado en el DOM");
            return;
        }

        // Emojis de medallas para los top 3
        const medals = ['🥇', '🥈', '🥉'];

        // Generar HTML con los puntajes
        leaderboardList.innerHTML = data.map((row, index) => {
            // Si está en top 3, usar medalla; si no, número de posición
            const medal = medals[index] || `${index + 1}.`;

            return `
                <li>
                    <span>${medal} ${row.player_name}</span>
                    <span style="color: #00FF99; font-weight: 600;">${row.score}</span>
                </li>
            `;
        }).join('');

        console.log("✅ Leaderboard cargado:", data);

    } catch (error) {
        console.error("❌ Error cargando leaderboard:", error);
        const leaderboardList = document.getElementById('leaderboard-list');
        if (leaderboardList) {
            leaderboardList.innerHTML = '<li style="color: red;">Error cargando puntajes</li>';
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// NUEVO: 4. CARGAR ESTADÍSTICAS DEL JUGADOR
// ═══════════════════════════════════════════════════════════════

/**
 * Consulta el servidor para obtener las estadísticas personales
 * de un jugador específico:
 * - Mejor puntaje registrado
 * - Nivel máximo alcanzado
 * - Total de partidas jugadas
 * 
 * Formato esperado del servidor:
 * {
 *   status: "success",
 *   best_score: 1333,
 *   max_level: 2,
 *   total_games: 5
 * }
 */
async function loadPlayerStats(username) {
    console.log(`📊 Cargando estadísticas de ${username}...`);

    try {
        const response = await fetch(
            `http://localhost/backend/player-stats.php?username=${encodeURIComponent(username)}`
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === "success") {
            // Referencias a los elementos del panel izquierdo
            const myBest = document.getElementById('myBest');
            const myLevel = document.getElementById('myLevel');
            const myGames = document.getElementById('myGames');

            // Actualizar con los datos obtenidos
            if (myBest) myBest.innerText = data.best_score || '—';
            if (myLevel) myLevel.innerText = data.max_level || '—';
            if (myGames) myGames.innerText = data.total_games || '—';

            console.log("✅ Estadísticas cargadas:", data);
        } else {
            console.warn("⚠️ Respuesta del servidor sin datos:", data);
        }

    } catch (error) {
        console.error("❌ Error cargando estadísticas:", error);
        // Si falla, mostramos "—" en los campos
        const myBest = document.getElementById('myBest');
        const myLevel = document.getElementById('myLevel');
        const myGames = document.getElementById('myGames');

        if (myBest) myBest.innerText = '—';
        if (myLevel) myLevel.innerText = '—';
        if (myGames) myGames.innerText = '—';
    }
}