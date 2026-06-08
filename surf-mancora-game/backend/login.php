<?php
/**
 * login.php
 * Autenticación de jugadores existentes.
 */

require_once 'config.php'; // Maneja CORS, headers y conexión DB

$data = json_decode(file_get_contents("php://input"));

// ── Validación de campos requeridos ───────────────────────────
if (empty($data->username) || empty($data->password)) {
    echo json_encode([
        "status"  => "error",
        "message" => "Por favor, completa username y contraseña."
    ]);
    exit();
}

$username = trim($data->username);
$password = trim($data->password);

// Validar longitud y formato
if (strlen($username) < 3 || strlen($username) > 20) {
    echo json_encode([
        "status"  => "error",
        "message" => "Nickname o contraseña incorrectos."
    ]);
    exit();
}

if (!preg_match('/^[a-zA-Z0-9_\-]+$/', $username)) {
    echo json_encode([
        "status"  => "error",
        "message" => "Nickname o contraseña incorrectos."
    ]);
    exit();
}

// ── Autenticación ─────────────────────────────────────────────
try {
    $db   = getDB();
    $stmt = $db->prepare(
        "SELECT id, username, password_hash FROM users WHERE username = :username"
    );
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    $user = $stmt->fetch();

    // Mensaje unificado — no revela si el usuario existe o no
    if (!$user || !password_verify($password, $user['password_hash'])) {
        echo json_encode([
            "status"  => "error",
            "message" => "Nickname o contraseña incorrectos."
        ]);
        exit();
    }

    $safeUsername = htmlspecialchars($user['username'], ENT_QUOTES, 'UTF-8');

    echo json_encode([
        "status"   => "success",
        "message"  => "¡Bienvenido a las Olas, {$safeUsername}!",
        "user_id"  => (int) $user['id'],
        "username" => $safeUsername
    ]);

} catch (PDOException $e) {
    error_log("login.php PDOException: " . $e->getMessage());
    echo json_encode([
        "status"  => "error",
        "message" => "Error interno del servidor. Inténtalo de nuevo más tarde."
    ]);
}