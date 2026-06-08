<?php
/**
 * player-stats.php
 * Retorna las estadísticas personales de un jugador específico
 * 
 * Método: GET
 * Parámetros:
 *   - username (requerido): Nombre del jugador
 * 
 * Respuesta JSON (éxito):
 * {
 *   "status": "success",
 *   "best_score": 1333,
 *   "max_level": 2,
 *   "total_games": 5
 * }
 * 
 * Respuesta JSON (error):
 * {
 *   "status": "error",
 *   "message": "Jugador no encontrado"
 * }
 */

require_once 'config.php'; // Maneja CORS, headers y conexión DB

// ── Validar que se proporcionó el parámetro username ──
if (empty($_GET['username'])) {
    echo json_encode([
        "status"  => "error",
        "message" => "Parámetro username requerido."
    ]);
    exit();
}

$username = trim($_GET['username']);

// Validar longitud del username
if (strlen($username) < 1 || strlen($username) > 20) {
    echo json_encode([
        "status"  => "error",
        "message" => "Nombre de usuario inválido."
    ]);
    exit();
}

try {
    $db = getDB();

    // ── Consulta: Obtener estadísticas del jugador ──
    // - MAX(score): mejor puntaje registrado
    // - MAX(level_reached): nivel máximo alcanzado
    // - COUNT(*): total de partidas jugadas
    $stmt = $db->prepare(
        "SELECT 
            MAX(score) as best_score,
            MAX(level_reached) as max_level,
            COUNT(*) as total_games
         FROM game_sessions
         WHERE player_name = :username"
    );
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Validar que el jugador tiene al menos una partida registrada
    if (!$result || $result['total_games'] == 0) {
        echo json_encode([
            "status"  => "error",
            "message" => "Jugador no encontrado o sin partidas registradas."
        ]);
        exit();
    }

    // Retornar las estadísticas
    echo json_encode([
        "status"      => "success",
        "best_score"  => (int) $result['best_score'],
        "max_level"   => (int) $result['max_level'],
        "total_games" => (int) $result['total_games']
    ]);

} catch (PDOException $e) {
    error_log("player-stats.php PDOException: " . $e->getMessage());
    echo json_encode([
        "status"  => "error",
        "message" => "Error interno del servidor."
    ]);
}
?>