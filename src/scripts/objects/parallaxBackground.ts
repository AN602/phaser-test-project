export class ParallaxBackground {
    private back: Phaser.GameObjects.TileSprite;
    private middle: Phaser.GameObjects.TileSprite;
    private front: Phaser.GameObjects.TileSprite;

    private lastCameraPositionX: number;
    private lastCameraPositionCalcTimeout: any;

    constructor(private scene: Phaser.Scene) {
        this.back = this.scene.add.tileSprite(this.scene.textures.get('mountains-back').getSourceImage().width / 4,
            this.scene.game.canvas.height,
            this.scene.textures.get('mountains-back').getSourceImage().width,
            this.scene.textures.get('mountains-back').getSourceImage().height + 400,
            'mountains-back'
        );

        this.middle = this.scene.add.tileSprite(this.scene.textures.get('mountains-mid1').getSourceImage().width / 4,
            this.scene.game.canvas.height,
            this.scene.textures.get('mountains-mid1').getSourceImage().width,
            this.scene.textures.get('mountains-mid1').getSourceImage().height + 400,
            'mountains-mid1'
        );
        this.front = this.scene.add.tileSprite(this.scene.textures.get('mountains-mid2').getSourceImage().width / 4,
            this.scene.game.canvas.height,
            this.scene.textures.get('mountains-mid2').getSourceImage().width,
            this.scene.textures.get('mountains-mid2').getSourceImage().height + 100,
            'mountains-mid2'
        );

        this.back.setScrollFactor(0, 0);
        this.middle.setScrollFactor(0, 0);
        this.front.setScrollFactor(0, 0);

        this.lastCameraPositionX = this.scene.cameras.main.scrollX;
    }

    update() {
        this.parallaxBackground(this.getCameraVelocityX());
    }

    private parallaxBackground(cameraVelocityX: number) {
        if (Math.trunc(cameraVelocityX) < 0) {
            this.back.tilePositionX -= 0.05;
            this.middle.tilePositionX -= 0.3;
            this.front.tilePositionX -= 0.75;
        }

        if (Math.trunc(cameraVelocityX) > 0) {
            this.back.tilePositionX += 0.05;
            this.middle.tilePositionX += 0.3;
            this.front.tilePositionX += 0.75;
        }
    }

    private getCameraVelocityX(): number {
        const velocityX = this.scene.cameras.main.scrollX - this.lastCameraPositionX;
        if (!this.lastCameraPositionCalcTimeout) {
            this.lastCameraPositionCalcTimeout = setTimeout(() => {
                this.lastCameraPositionX = this.scene.cameras.main.scrollX;
                this.lastCameraPositionCalcTimeout = undefined;
            }, 60);
        }
        return velocityX;
    }
}