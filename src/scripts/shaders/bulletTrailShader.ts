/* export default class BulletTrailShader extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uTime',
                'uSpeed',
                'uBendFactor'
            ]
        });

        this._bend = 0.3;
        this._speed = 0.003;
    }

    onBoot() {
        this.set1i('uMainSampler', 1);
    }

    onPreRender() {
        this.set1f('uTime', this.game.loop.time);
        this.set1f('uSpeed', this._speed);
        this.set1f('uBendFactor', this._bend);
    }

    get bend() {
        return this._bend;
    }

    set bend(value) {
        this._bend = value;
    }

    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = value;
    }
} */