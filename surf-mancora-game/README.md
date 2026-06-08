# 🏄 Torneo de Surf en Máncora 2026

Videojuego web desarrollado con **HTML5 Canvas, JavaScript, PHP y MySQL**, ambientado en la playa de Máncora, Piura (Perú). El proyecto combina simulación física básica, persistencia de datos y autenticación de usuarios para ofrecer una experiencia interactiva de dos niveles inspirada en el surf y la cultura costera piurana.

## 📋 Descripción del proyecto

El jugador participa en el **Torneo de Surf de Máncora 2026**, donde deberá superar dos desafíos consecutivos para alcanzar la puntuación máxima.

### Nivel 1 — Equilibrio sobre la ola
El jugador controla el movimiento lateral del surfista mientras intenta mantener el equilibrio sobre una ola simulada matemáticamente.

**Objetivo:** alcanzar 400 puntos.

### Nivel 2 — Esquiva de obstáculos
Una vez superado el primer nivel, aparecen tortugas marinas como obstáculos. El jugador debe saltarlas para evitar colisiones y continuar acumulando puntos.

**Objetivo:** alcanzar 800 puntos.

---

## ✨ Características principales

- Sistema de autenticación de usuarios
- Registro e inicio de sesión mediante PHP y MySQL
- Almacenamiento de puntajes en base de datos
- Tabla de clasificación global (Leaderboard)
- Estadísticas individuales por jugador
- Simulación de olas mediante funciones senoidales
- Sistema de partículas para efectos visuales
- Arquitectura modular basada en clases JavaScript
- Comunicación asíncrona mediante Fetch API

---

## 🕹️ Controles

| Tecla | Acción |
|-------|--------|
| `←` | Desplazarse a la izquierda |
| `→` | Desplazarse a la derecha |
| `ESPACIO` | Saltar obstáculos (Nivel 2) |

---

## 🗂️ Estructura del proyecto

```
JUEGO-TORNEO-SURF/
│
├── surf-mancora-game/
│   ├── index.html
│   │
│   ├── assets/
│   │   ├── fondo.png
│   │   ├── surfista.png
│   │   └── tortuga.png
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── api.js
│       ├── assets.js
│       ├── main.js
│       ├── obstacle.js
│       ├── particles.js
│       ├── physics.js
│       ├── sun.js
│       └── surfer.js
│
└── backend/
    ├── api.php
    ├── config.php
    ├── config.example.php
    ├── leaderboard.php
    ├── login.php
    ├── player-stats.php
    └── register.php
```

---

## ⚙️ Instalación y ejecución local

### Requisitos
- XAMPP (Apache y MySQL)
- PHP 8 o superior
- Visual Studio Code
- Navegador moderno

### 1. Configurar XAMPP
Iniciar los siguientes servicios desde el panel de control de XAMPP:
- Apache
- MySQL

### 2. Crear la base de datos
Ingresar a `http://localhost/phpmyadmin` y ejecutar:

```sql
CREATE DATABASE IF NOT EXISTS piura_games
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE piura_games;

CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_sessions (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    player_name   VARCHAR(20) NOT NULL,
    score         INT NOT NULL,
    level_reached INT DEFAULT 1,
    played_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configurar el backend
Copiar la carpeta `backend/` dentro de:

```
C:\xampp\htdocs\
```

Luego copiar el archivo de configuración y completar las credenciales:

```bash
cp backend/config.example.php backend/config.php
```

### 4. Ejecutar el frontend
Abrir la carpeta `surf-mancora-game` en Visual Studio Code y ejecutar **Open with Live Server**.

- Frontend: `http://127.0.0.1:5500`
- Backend: `http://localhost/backend/`

---

## 🔌 Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/backend/register.php` | Registro de nuevos usuarios |
| `POST` | `/backend/login.php` | Inicio de sesión |
| `POST` | `/backend/api.php` | Guardado de partidas |
| `GET` | `/backend/leaderboard.php` | Tabla de clasificación global |
| `GET` | `/backend/player-stats.php` | Estadísticas individuales del jugador |

---

## 🧮 Modelo matemático de las olas

La superficie del mar se representa mediante una función senoidal:

$$y(x,t) = A \sin(kx + \omega t) + D$$

| Parámetro | Descripción |
|-----------|-------------|
| `A` | Amplitud de la ola |
| `k` | Frecuencia espacial |
| `ω` | Velocidad de propagación |
| `D` | Nivel base del agua |

La inclinación de la tabla se calcula usando la pendiente local de la ola:

$$\theta(x,t) = \arctan\left(Ak\cos(kx + \omega t)\right)$$

Este enfoque permite generar un movimiento más natural y coherente con el comportamiento del océano.

---

## 🔐 Seguridad implementada

**Protección de contraseñas**
Las credenciales se almacenan utilizando `password_hash()` y se verifican con `password_verify()`.

**Prevención de SQL Injection**
Uso de PDO con Prepared Statements y `bindParam()` en todos los endpoints.

**Validación de datos**
Se validan entradas antes de interactuar con la base de datos para reducir errores y accesos no deseados.

**Configuración CORS**
Permite la comunicación entre el frontend ejecutado mediante Live Server y el backend alojado en Apache.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Función |
|------------|---------|
| HTML5 Canvas | Renderizado del juego |
| CSS3 | Diseño visual e interfaz |
| JavaScript ES6+ | Lógica y mecánicas |
| Fetch API | Comunicación cliente-servidor |
| PHP | Backend |
| MySQL | Persistencia de datos |
| PDO | Acceso seguro a base de datos |
| Apache | Servidor web |
| XAMPP | Entorno de desarrollo local |

---

