import FpsText from '../objects/fpsText';
import { ParallaxBackground } from '../objects/parallaxBackground';
import Weather from '../objects/weather';
export default class MainScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text
  parallaxBackground: ParallaxBackground;
  weatherController: Weather;

  player: Phaser.Physics.Matter.Sprite;
  playerSprites: Phaser.GameObjects.Container;
  playerWeapon: Phaser.GameObjects.Image;

  shellEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  shellCategory: number;

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    //just add graphic 
    const graphic = this.add.graphics();
    graphic.fillStyle(0xcc44aa, 1);
    graphic.fillRect(0, 0, 60, 60);
    graphic.generateTexture('placeholder', 3, 60);

    this.fpsText = new FpsText(this).setScrollFactor(0);
    this.parallaxBackground = new ParallaxBackground(this);

    this.matter.world.setBounds(0, 0, 3200, 720);
    this.cameras.main.setBounds(0, 0, 3400, 720).setName('main');

    this.matter.add.image(0, 700, 'ground', undefined, { isStatic: true });
    this.matter.add.image(613, 700, 'ground', undefined, { isStatic: true });
    this.matter.add.image(613 * 2, 700, 'ground', undefined, { isStatic: true });
    this.matter.add.image(613 * 3, 700, 'ground', undefined, { isStatic: true });
    this.matter.add.image(613 * 4, 700, 'ground', undefined, { isStatic: true });


    this.playerWeapon = this.add.image(0, 0, 'ship');
    this.playerSprites = this.add.container(50, 50, [this.playerWeapon]);
    this.playerSprites.setSize(50, 50);
    this.player = this.matter.add.gameObject(this.playerSprites) as Phaser.Physics.Matter.Sprite;

    this.player.setFixedRotation();
    this.player.setFrictionAir(0.05);
    this.player.setMass(30);

    this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.shellCategory = this.matter.world.nextCategory();

    this.weatherController = new Weather(this);
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0);
  }

  update() {
    this.fpsText.update();
    this.parallaxBackground.update();
    this.weatherController.updateZonePositionsX(this.cameras.main.scrollX);

    const angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.player.x + this.playerWeapon.x - this.cameras.main.scrollX, this.player.y + this.playerWeapon.y - this.cameras.main.scrollY, this.input.mousePointer.x, this.input.mousePointer.y);
    this.playerWeapon.setAngle(angle);
    console.log(this.player.x)

    if (this.cursors.left.isDown) {
      this.player.thrustBack(0.1);
      this.player.flipX = true;
    }
    else if (this.cursors.right.isDown) {
      this.player.thrust(0.1);
      this.player.flipX = false;
    }
    if (this.cursors.up.isDown && Math.trunc(this.player.body.velocity.y) === 0) {
      this.player.thrustLeft(3);
    }
    else if (this.cursors.down.isDown) {
      this.player.thrustRight(0.1);
    }

    if (this.input.mousePointer.isDown) {
      const casing = this.matter.add.sprite(
        this.playerWeapon.x + this.player.x,
        this.playerWeapon.y + this.player.y,
        'placeholder', undefined, {
        frictionAir: 0.05,
        mass: 1,
        force: new Phaser.Math.Vector2(-0.01, -0.01),
        torque: 1
      });
      setTimeout(() => casing.destroy(), 1000);
    }
  }
}
