class Weather {

    rainEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    emitterZone: Phaser.Geom.Line;
    deathZone: Phaser.Geom.Rectangle;

    constructor(private scene: Phaser.Scene) {
        //just add graphic 
        const graphic = this.scene.add.graphics();
        graphic.fillStyle(0xdcdcdc, 1);
        graphic.fillRect(0, 0, 60, 60);
        graphic.generateTexture('rain', 3, 60);

        this.emitterZone = new Phaser.Geom.Line(0, 0, 1280, 0);
        this.deathZone = new Phaser.Geom.Rectangle(0, 700, 1280, 20);

        const floor = new Phaser.Geom.Rectangle(0, this.scene.game.canvas.height - 20, this.scene.game.canvas.width, 20);

        const particles = this.scene.add.particles('rain');

        this.rainEmitter = particles.createEmitter({
            scale: { start: 0.5, end: 0.2 },
            blendMode: 'ADD',
            emitZone: { type: 'random', source: this.emitterZone, quantity: 50, yoyo: false },
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

        let graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x00ff00, 1);
        graphics.fillStyle(0x654321, 1);
        graphics.fillRectShape(floor);


        // graphics.strokeRectShape(deathZone);

        this.initWeatherControls();
    }

    addRain() {
        this.rainEmitter.start();

    }

    removeRain() {
        this.rainEmitter.stop();
    }

    private initWeatherControls() {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            // console.log(`weather ${event.code}`);
            switch (event.code) {
                case 'ArrowUp':
                    this.addRain();
                    break;
                case 'ArrowDown':
                    this.removeRain();
                    break;
                default:
            }
        })
    }

}

export default Weather;