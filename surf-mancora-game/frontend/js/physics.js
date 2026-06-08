/**
 * physics.js
 * Módulo de físicas para el cálculo de ondas y vectores direccionales.
 */

const PhysicsEngine = {
    // Parámetros de la ola de Máncora
    waveAmplitude: 40,    // Altura de la ola en píxeles
    waveLength: 0.01,  // Frecuencia espacial (distancia entre crestas)
    waveSpeed: 0.05,  // Velocidad de propagación de la ola
    baseWaterLevel: 400,   // Nivel base del mar en el Canvas (eje Y)

    /**
     * Calcula la posición Y (altura) de la ola en un punto X específico.
     * Utiliza la función seno para generar oscilación continua.
     *
     * Fórmula: y(x, t) = A * sin(k*x + w*t) + D
     *
     * @param {number} x    - Posición horizontal en el canvas
     * @param {number} time - Tiempo actual del juego (incrementa cada frame)
     * @returns {number} Posición Y de la superficie del agua en x
     */
    getWaveY: function (x, time) {
        return this.waveAmplitude * Math.sin(x * this.waveLength + time * this.waveSpeed) + this.baseWaterLevel;
    },

    /**
     * Calcula el ángulo de inclinación de la tabla basado en la pendiente
     * de la ola en el punto X dado. Usado en surfer.js para rotar el sprite
     * del surfista según la superficie del agua.
     *
     * Fórmula: derivada del seno → A * k * cos(k*x + w*t)
     *
     * @param {number} x    - Posición horizontal en el canvas
     * @param {number} time - Tiempo actual del juego
     * @returns {number} Ángulo en radianes para la rotación del sprite
     */
    getWaveSlopeAngle: function (x, time) {
        const derivative = this.waveAmplitude * this.waveLength * Math.cos(x * this.waveLength + time * this.waveSpeed);
        return Math.atan(derivative);
    }
};