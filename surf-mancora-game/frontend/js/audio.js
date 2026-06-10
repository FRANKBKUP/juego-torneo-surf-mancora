/**
 * audio.js
 * Gestiona todos los sonidos del juego: música de fondo, efectos de sonido, etc.
 * 
 * ESTRUCTURA DE CARPETAS ESPERADA:
 * assets/
 *   ├── audio/
 *   │   ├── background.mp3          (música de fondo loop)
 *   │   ├── sun-collect.mp3         (recoger sol)
 *   │   ├── jump.mp3                (saltar)
 *   │   ├── collision.mp3           (chocar con tortuga)
 *   │   ├── victory.mp3             (victoria/nivel completado)
 *   │   └── game-over.mp3           (fin del juego)
 */

class AudioManager {
    constructor() {
        this.sounds = {};
        this.backgroundMusic = null;
        this.isMuted = false;
    }

    /**
     * Inicializa todos los sonidos del juego
     */
    initializeSounds() {
        console.log("🎵 Inicializando sistema de audio...");

        // Música de fondo (loop)
        this.sounds.background = new Audio('assets/audio/background.mp3');
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.3; // 30% de volumen

        // Efectos de sonido (no loop)
        this.sounds.sunCollect = new Audio('assets/audio/sun-collect.mp3');
        this.sounds.sunCollect.volume = 0.5;

        this.sounds.jump = new Audio('assets/audio/jump.mp3');
        this.sounds.jump.volume = 0.4;

        this.sounds.collision = new Audio('assets/audio/collision.mp3');
        this.sounds.collision.volume = 0.6;

        this.sounds.victory = new Audio('assets/audio/victory.mp3');
        this.sounds.victory.volume = 0.7;

        this.sounds.gameOver = new Audio('assets/audio/game-over.mp3');
        this.sounds.gameOver.volume = 0.6;

        console.log("✅ Sistema de audio listo");
    }

    /**
     * Inicia la música de fondo
     */
    playBackgroundMusic() {
        if (!this.isMuted && this.sounds.background) {
            this.sounds.background.currentTime = 0;
            this.sounds.background.play().catch(err => {
                console.warn("⚠️ No se pudo reproducir música de fondo:", err);
            });
        }
    }

    /**
     * Detiene la música de fondo
     */
    stopBackgroundMusic() {
        if (this.sounds.background) {
            this.sounds.background.pause();
            this.sounds.background.currentTime = 0;
        }
    }

    /**
     * Reproduces el sonido de recoger un sol
     */
    playSunCollect() {
        if (!this.isMuted && this.sounds.sunCollect) {
            // Reiniciar el sonido para que se pueda reproducir rápidamente múltiples veces
            this.sounds.sunCollect.currentTime = 0;
            this.sounds.sunCollect.play().catch(err => {
                console.warn("⚠️ Error reproduciendo sonido de sol:", err);
            });
        }
    }

    /**
     * Reproduces el sonido de saltar
     */
    playJump() {
        if (!this.isMuted && this.sounds.jump) {
            this.sounds.jump.currentTime = 0;
            this.sounds.jump.play().catch(err => {
                console.warn("⚠️ Error reproduciendo sonido de salto:", err);
            });
        }
    }

    /**
     * Reproduces el sonido de colisión
     */
    playCollision() {
        if (!this.isMuted && this.sounds.collision) {
            this.sounds.collision.currentTime = 0;
            this.sounds.collision.play().catch(err => {
                console.warn("⚠️ Error reproduciendo sonido de colisión:", err);
            });
        }
    }

    /**
     * Reproduces el sonido de victoria
     */
    playVictory() {
        if (!this.isMuted && this.sounds.victory) {
            this.sounds.victory.currentTime = 0;
            this.sounds.victory.play().catch(err => {
                console.warn("⚠️ Error reproduciendo sonido de victoria:", err);
            });
        }
    }

    /**
     * Reproduces el sonido de game over
     */
    playGameOver() {
        if (!this.isMuted && this.sounds.gameOver) {
            this.sounds.gameOver.currentTime = 0;
            this.sounds.gameOver.play().catch(err => {
                console.warn("⚠️ Error reproduciendo sonido de game over:", err);
            });
        }
    }

    /**
     * Activa/desactiva todos los sonidos
     */
    toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            this.stopBackgroundMusic();
            console.log("🔇 Sonido desactivado");
        } else {
            console.log("🔊 Sonido activado");
        }

        return this.isMuted;
    }

    /**
     * Cambia el volumen general (0.0 a 1.0)
     */
    setVolume(volume) {
        const v = Math.max(0, Math.min(1, volume));

        if (this.sounds.background) this.sounds.background.volume = v * 0.3;
        if (this.sounds.sunCollect) this.sounds.sunCollect.volume = v * 0.5;
        if (this.sounds.jump) this.sounds.jump.volume = v * 0.4;
        if (this.sounds.collision) this.sounds.collision.volume = v * 0.6;
        if (this.sounds.victory) this.sounds.victory.volume = v * 0.7;
        if (this.sounds.gameOver) this.sounds.gameOver.volume = v * 0.6;
    }
}

// Instancia global
const audioManager = new AudioManager();