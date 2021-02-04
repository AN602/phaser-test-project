import FpsText from '../objects/fpsText';
import Weather from '../objects/weather';

interface BackgroundLayers {
  back: Phaser.GameObjects.TileSprite,
  middle: Phaser.GameObjects.TileSprite,
  front: Phaser.GameObjects.TileSprite
}

export default class MainScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text
  weatherController: Weather;
  backgroundMountains: BackgroundLayers;

  constructor() {
    super({ key: 'MainScene' });
    this.backgroundMountains = {} as BackgroundLayers;
  }

  create() {
    this.fpsText = new FpsText(this)

    this.backgroundMountains.back = this.add.tileSprite(this.textures.get('mountains-back').getSourceImage().width / 4,
      this.game.canvas.height,
      this.textures.get('mountains-back').getSourceImage().width,
      this.textures.get('mountains-back').getSourceImage().height + 400,
      'mountains-back'
    );

    this.backgroundMountains.middle = this.add.tileSprite(this.textures.get('mountains-mid1').getSourceImage().width / 4,
      this.game.canvas.height,
      this.textures.get('mountains-mid1').getSourceImage().width,
      this.textures.get('mountains-mid1').getSourceImage().height + 400,
      'mountains-mid1'
    );
    this.backgroundMountains.front = this.add.tileSprite(this.textures.get('mountains-mid2').getSourceImage().width / 4,
      this.game.canvas.height,
      this.textures.get('mountains-mid2').getSourceImage().width,
      this.textures.get('mountains-mid2').getSourceImage().height + 100,
      'mountains-mid2'
    );


    this.weatherController = new Weather(this);
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px',
      })
      .setOrigin(1, 0)
  }


  update() {
    this.fpsText.update();
    this.backgroundMountains.back.tilePositionX -= 0.05;
    this.backgroundMountains.middle.tilePositionX -= 0.3;
    this.backgroundMountains.front.tilePositionX -= 0.75;
    /* 
        this.weatherController.emitterZone.x1 += 1;
        this.weatherController.emitterZone.x1 += 2; */
  }
}
