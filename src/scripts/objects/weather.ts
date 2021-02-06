class Weather {

    rainEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    emitterZone: Phaser.Geom.Line;
    deathZone: Phaser.Geom.Rectangle;

    constructor(private scene: Phaser.Scene) {
        this.emitterZone = new Phaser.Geom.Line(0, 0, 1280, 0);
        this.deathZone = new Phaser.Geom.Rectangle(0, 620, 1680, 20);

        const floor = new Phaser.Geom.Rectangle(0, this.scene.game.canvas.height - 20, this.scene.game.canvas.width, 20);

        const particles = this.scene.add.particles('placeholder');

        this.rainEmitter = particles.createEmitter({
            scale: { start: 0.5, end: 0.2 },
            blendMode: 'ADD',
            emitZone: { type: 'random', source: this.emitterZone, quantity: 100, yoyo: false },
            deathZone: { source: this.deathZone, type: 'onEnter' },
            speedY: 900
        });

        this.scene.anims.create({
            key: 'splash',
            frameRate: 10,
            frames: this.scene.anims.generateFrameNumbers('rainSplash', { start: 0, end: 6 }),
            repeat: 3
        })

        this.rainEmitter.onParticleDeath((particle) => {
            const sprite = this.scene.add.sprite(particles.x + particle.x, particles.y + particle.y, 'rainSplash');
            sprite.play('splash');
            setTimeout(() => sprite.destroy(), 600);
        }, this);

        /*         let graphics = this.scene.add.graphics();
                graphics.lineStyle(1, 0x00ff00, 1);
                graphics.fillStyle(0x654321, 1);
                graphics.fillRectShape(floor); */


        // graphics.strokeRectShape(deathZone);
    }

    updateZonePositionsX(x: number) {
        const outOfBoundsValue = 400;
        this.emitterZone.x1 = x - outOfBoundsValue;
        this.emitterZone.x2 = x + 1280 + outOfBoundsValue;

        this.deathZone.x = x - outOfBoundsValue;
    }

    addRain() {
        this.rainEmitter.start();

    }

    removeRain() {
        this.rainEmitter.stop();
    }

}

export default Weather;