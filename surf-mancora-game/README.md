## Características principales

## Características principales

* Sistema de autenticación de usuarios mediante PHP y MySQL.
* Registro e inicio de sesión con contraseñas cifradas mediante bcrypt.
* Persistencia de puntajes y progreso del jugador.
* Tabla de clasificación global (Leaderboard).
* Estadísticas individuales por usuario.
* Simulación física de olas mediante funciones senoidales.
* Sistema de partículas para representar espuma y movimiento del agua.
* Sistema de audio con música de fondo y efectos sonoros.
* Sistema de efectos visuales para colisiones, recompensas y victoria.
* Arquitectura modular basada en JavaScript ES6+.
* Comunicación asíncrona cliente-servidor mediante Fetch API.
* Interfaz con HUD informativo en tiempo real.
* Integración entre HTML5 Canvas, PHP, Apache y MySQL.


---
## Estructura del proyecto

```text
JUEGO-TORNEO-SURF/
│
├── surf-mancora-game/
│   │
│   ├── index.html
│   │
│   ├── assets/
│   │   │
│   │   ├── audio/
│   │   │   ├── background.mp3
│   │   │   ├── collision.mp3
│   │   │   ├── game-over.mp3
│   │   │   ├── jump.mp3
│   │   │   ├── sun-collect.mp3
│   │   │   └── victory.mp3
│   │   │
│   │   ├── fondo.png
│   │   ├── surfista.png
│   │   └── tortuga.png
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── assets.js
│   │   ├── audio.js
│   │   ├── main.js
│   │   ├── obstacle.js
│   │   ├── particles.js
│   │   ├── physics.js
│   │   ├── sun.js
│   │   ├── surfer.js
│   │   └── visual-effects.js
│   │
│   └── README.md
│
└── C:\xampp\htdocs\backend\
    ├── api.php
    ├── config.php
    ├── leaderboard.php
    ├── login.php
    ├── player-stats.php
    └── register.php
```
---

## Arquitectura del sistema

El sistema está organizado en tres capas principales:

### Capa de Presentación (Frontend)

Desarrollada con HTML5 Canvas, CSS3 y JavaScript ES6+.

Módulos principales:

* `main.js` → Control del Game Loop principal.
* `physics.js` → Simulación de olas y cálculo de pendientes.
* `surfer.js` → Movimiento y salto del jugador.
* `obstacle.js` → Gestión de tortugas y colisiones.
* `sun.js` → Coleccionables y puntuación.
* `particles.js` → Efectos de agua.
* `audio.js` → Música de fondo y efectos sonoros.
* `visual-effects.js` → Explosiones, flashes, escudos y animaciones.
* `api.js` → Comunicación con el backend.
* `assets.js` → Precarga de recursos gráficos.

### Capa de Aplicación (Backend)

Desarrollada con PHP 8 ejecutándose sobre Apache (XAMPP).

Responsabilidades:

* Autenticación de usuarios.
* Registro de cuentas.
* Guardado de puntajes.
* Obtención de estadísticas.
* Generación del leaderboard global.
* Validación y sanitización de datos.

### Capa de Datos (Database)

Base de datos MySQL denominada `piura_games`.

Tablas principales:

* `users`
* `game_sessions`

---

## Flujo de datos

### Inicio de sesión

1. El usuario ingresa sus credenciales.
2. `api.js` envía la solicitud mediante Fetch API.
3. `login.php` valida los datos.
4. MySQL verifica la información almacenada.
5. Se devuelve la sesión del jugador.

### Ejecución del juego

1. `main.js` inicia el Game Loop utilizando `requestAnimationFrame`.
2. `physics.js` calcula la forma de la ola.
3. `surfer.js` actualiza la posición del jugador.
4. `audio.js` reproduce la música de fondo.
5. `visual-effects.js` inicializa los efectos visuales.
6. Canvas renderiza todos los elementos del juego.

### Eventos durante la partida

**Recolección de soles**

* Reproducción de sonido de recompensa.
* Generación de partículas doradas.
* Incremento de puntuación.

**Colisión con tortugas**

* Reproducción de sonido de impacto.
* Flash visual en pantalla.
* Finalización de la partida.

**Victoria**

* Reproducción de fanfarria.
* Efecto visual de celebración.
* Guardado automático de resultados.

### Fin de partida

1. `api.js` envía los resultados al backend.
2. `api.php` procesa la información.
3. MySQL almacena la sesión.
4. Se actualizan las estadísticas y el leaderboard.

---

## Sistema de audio

El módulo `audio.js` incorpora:

* Música de fondo en bucle.
* Sonido de salto.
* Sonido de recolección de soles.
* Sonido de colisión.
* Sonido de victoria.
* Sonido de derrota.
* Control de volumen.

---

## Sistema de efectos visuales

El módulo `visual-effects.js` proporciona:

* Flash rojo por colisiones.
* Flash blanco de victoria.
* Explosiones de partículas.
* Escudos animados.
* Efectos de impacto.
* Animaciones de celebración.

---

## Tecnologías utilizadas

| Tecnología      | Función                              |
| --------------- | ------------------------------------ |
| HTML5 Canvas    | Renderizado 2D del juego             |
| CSS3            | Diseño visual e interfaz             |
| JavaScript ES6+ | Lógica y mecánicas                   |
| Fetch API       | Comunicación cliente-servidor        |
| Web Audio API   | Reproducción de sonidos              |
| PHP 8           | Backend                              |
| MySQL           | Persistencia de datos                |
| PDO             | Acceso seguro a base de datos        |
| Apache          | Servidor web                         |
| XAMPP           | Entorno de desarrollo local          |
| Live Server     | Servidor de desarrollo para frontend |

```
```

### Configuración del backend (XAMPP)

Copiar la carpeta `backend` dentro de:

```text
C:\xampp\htdocs\
```

Resultado:

```text
C:\xampp\htdocs\backend\
```

Configurar el archivo `config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'piura_games');
define('DB_USER', 'root');
define('DB_PASS', '');
```

### Ejecución del proyecto

1. Iniciar Apache y MySQL desde XAMPP.
2. Abrir la carpeta `surf-mancora-game` en Visual Studio Code.
3. Ejecutar **Open with Live Server** sobre `index.html`.

URLs de desarrollo:

Frontend:

```text
http://127.0.0.1:5500
```

Backend:

```text
http://localhost/backend/
```
