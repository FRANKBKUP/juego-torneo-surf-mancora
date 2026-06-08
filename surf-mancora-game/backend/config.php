<?php
/**
 * config.php
 * Punto único de configuración de la base de datos y CORS.
 *   echo "backend/config.php" >> .gitignore
 */

// ── Base de datos ──────────────────────────────────────────────
define('DB_HOST',    'localhost');
define('DB_NAME',    'piura_games');
define('DB_USER',    'root');   // Cambiar en producción
define('DB_PASS',    '');       // Cambiar en producción
define('DB_CHARSET', 'utf8mb4');

// ── CORS ───────────────────────────────────────────────────────
// Live Server usa 127.0.0.1:5500 — distinto a localhost:5500 para el navegador.
// Aquí aceptamos ambos para que funcione en cualquier configuración de desarrollo.
$allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
} 

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Responder inmediatamente a preflight OPTIONS sin tocar la BD
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

/**
 * Retorna una conexión PDO configurada.
 *
 * @return PDO
 */
function getDB(): PDO {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    return new PDO($dsn, DB_USER, DB_PASS, $options);
}