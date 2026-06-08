<?php
/**
 * api.php
 * Guardado de sesiones de juego.
 */

require_once 'config.php'; // Maneja CORS, headers y conexión DB

$data = json_decode(file_get_contents("php://input"));

// ── Validación de campos requeridos ───────────────────────────
if (empty($data->player_name) || !isset($data->score) || !isset($data->level)) {
    echo json_encode([
        "status"  => "error",
        "message" => "Faltan datos para guardar el récord."
    ]);
    exit();
}

// Validar tipo y rango de score (entero 0–9999)
$score = filter_var($data->score, FILTER_VALIDATE_INT, [
    "options" => ["min_range" => 0, "max_range" => 9999]
]);

if ($score === false) {
    echo json_encode([
        "status"  => "error",
        "message" => "El puntaje enviado no es válido."
    ]);
    exit();
}

// Validar tipo y rango de level (entero 1–10)
$level = filter_var($data->level, FILTER_VALIDATE_INT, [
    "options" => ["min_range" => 1, "max_range" => 10]
]);

if ($level === false) {
    echo json_encode([
        "status"  => "error",
        "message" => "El nivel enviado no es válido."
    ]);
    exit();
}

// Validar longitud del nombre
$playerName = trim($data->player_name);

if (strlen($playerName) < 1 || strlen($playerName) > 20) {
    echo json_encode([
        "status"  => "error",
        "message" => "Nombre de jugador no válido."
    ]);
    exit();
}

// ── Inserción en base de datos ────────────────────────────────
try {
    $db = getDB();

    $insertStmt = $db->prepare(
        "INSERT INTO game_sessions (player_name, score, level_reached)
         VALUES (:player_name, :score, :level)"
    );
    $insertStmt->bindParam(":player_name", $playerName);
    $insertStmt->bindParam(":score",       $score, PDO::PARAM_INT);
    $insertStmt->bindParam(":level",       $level, PDO::PARAM_INT);

    if ($insertStmt->execute()) {
        $safeName = htmlspecialchars($playerName, ENT_QUOTES, 'UTF-8');
        echo json_encode([
            "status"  => "success",
            "message" => "¡Récord de {$score} puntos guardado para {$safeName}!"
        ]);
    }

} catch (PDOException $e) {
    error_log("api.php PDOException: " . $e->getMessage());
    echo json_encode([
        "status"  => "error",
        "message" => "Error interno del servidor. Inténtalo de nuevo más tarde."
    ]);
}