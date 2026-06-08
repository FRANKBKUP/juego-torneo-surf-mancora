<?php
/**
 * leaderboard.php
 * Retorna el TOP 5 de puntajes de todos los jugadores
 * 
 * Método: GET
 * Respuesta JSON:
 * [
 *   { player_name: "FRANK1", score: 1333 },
 *   { player_name: "franksuanima", score: 1309 },
 *   ...
 * ]
 */

require_once 'config.php'; // Maneja CORS, headers y conexión DB

try {
    $db = getDB();

    // ── Consulta: Mejor puntaje por cada jugador (GROUP BY player_name) ──
    // Ordenamos por score DESC para obtener los TOP 5
    $stmt = $db->query(
        "SELECT player_name, MAX(score) as score
         FROM game_sessions
         GROUP BY player_name
         ORDER BY score DESC
         LIMIT 5"
    );

    // Obtener todos los registros como array asociativo
    $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retornar los datos como JSON
    echo json_encode($leaderboard);

} catch (PDOException $e) {
    // Si hay error en la base de datos, loguearlo y retornar array vacío
    error_log("leaderboard.php PDOException: " . $e->getMessage());
    echo json_encode([]);
}
?>