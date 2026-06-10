class Surfer {
    constructor(startX) {
        this.x = startX;
        this.y = 0;
        this.width = 120;
        this.height = 120;

        this.angle = 0;
        this.speed = 5;
        this.velocityY = 0;
        this.gravity = 0.4;
        this.jumpStrength = -12;
        this.isJumping = false;
    }

    move(direction, canvasWidth) {
        if (direction === 'left' && this.x > 0) this.x -= this.speed;
        if (direction === 'right' && this.x < canvasWidth) this.x += this.speed;
    }

    // Método para accionar el salto
    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpStrength;
            this.isJumping = true;
            audioManager.playJump();
        }
    }

    update(time, currentLevel) {
        let waveY = PhysicsEngine.getWaveY(this.x, time);

        if (currentLevel === 1) {

            if (this.isJumping) {
                this.y += this.velocityY;
                this.velocityY += this.gravity;

                if (this.y >= waveY) {
                    this.y = waveY;
                    this.velocityY = 0;
                    this.isJumping = false;
                }
            } else {
                this.y = waveY;
            }

            this.angle = PhysicsEngine.getWaveSlopeAngle(this.x, time);

        } else if (currentLevel === 2) {
            // Lógica Nivel 2: Física Parabólica
            this.y += this.velocityY;
            this.velocityY += this.gravity; // La gravedad empuja hacia abajo constantemente

            // Detectar colisión con la superficie del agua (Reingreso a la ola)
            if (this.y >= waveY) {
                this.y = waveY;
                this.velocityY = 0;
                this.isJumping = false;
                this.angle = PhysicsEngine.getWaveSlopeAngle(this.x, time);
            } else {
                // Si está en el aire, podemos hacer que la tabla rote dramáticamente
                this.angle += 0.02;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (assets.images.surfer) {
            // OFFSET: Sumamos 15 píxeles para "hundir" el dibujo hasta el agua
            let offsetY = 15;
            ctx.drawImage(assets.images.surfer, -this.width / 2, -this.height + offsetY, this.width, this.height);
        }
        ctx.restore();
    }
}