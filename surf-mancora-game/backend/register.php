<?php
/**
 * register.php
 * Registro de nuevos jugadores.
 */

require_once 'config.php'; // Maneja CORS, headers y conexión DB

$data = json_decode(file_get_contents("php://input"));

// ── Validación de campos requeridos ───────────────────────────
if (empty($data->username) || empty($data->password)) {
    echo json_encode([
        "status"  => "error",
        "message" => "Por favor, completa todos los campos."
    ]);
    exit();
}

$username = trim($data->username);
$password = trim($data->password);

// Validar longitud y formato del username
if (strlen($username) < 3 || strlen($username) > 20) {
    echo json_encode([
        "status"  => "error",
        "message" => "El Nickname debe tener entre 3 y 20 caracteres."
    ]);
    exit();
}

if (!preg_match('/^[a-zA-Z0-9_\-]+$/', $username)) {
    echo json_encode([
        "status"  => "error",
        "message" => "El Nickname solo puede contener letras, números, guiones y guiones bajos."
    ]);
    exit();
}

if (strlen($password) < 6) {
    echo json_encode([
        "status"  => "error",
        "message" => "La contraseña debe tener al menos 6 caracteres."
    ]);
    exit();
}

// ── Registro en base de datos ─────────────────────────────────
try {
    $db = getDB();

    // Verificar si el username ya existe
    $checkStmt = $db->prepare("SELECT id FROM users WHERE username = :username");
    $checkStmt->bindParam(":username", $username);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        echo json_encode([
            "status"  => "error",
            "message" => "El Nickname ya está en uso. Elige otro."
        ]);
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $insertStmt = $db->prepare(
        "INSERT INTO users (username, password_hash) VALUES (:username, :password)"
    );
    $insertStmt->bindParam(":username", $username);
    $insertStmt->bindParam(":password", $hashedPassword);

    if ($insertStmt->execute()) {
        $safeUsername = htmlspecialchars($username, ENT_QUOTES, 'UTF-8');
        echo json_encode([
            "status"  => "success",
            "message" => "¡Cuenta creada con éxito, {$safeUsername}! Ya puedes iniciar sesión."
        ]);
    }

} catch (PDOException $e) {
    error_log("register.php PDOException: " . $e->getMessage());
    echo json_encode([
        "status"  => "error",
        "message" => "Error interno del servidor. Inténtalo de nuevo más tarde."
    ]);
}