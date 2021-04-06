import FpsText from '../objects/fpsText';
import { ParallaxBackground } from '../objects/parallaxBackground';
import Weather from '../objects/weather';
export default class MainScene extends Phaser.Scene {
  fpsText: Phaser.GameObjects.Text
  parallaxBackground: ParallaxBackground;
  weatherController: Weather;

  groundCategory: number;

  player: Phaser.Physics.Matter.Sprite;
  playerSprites: Phaser.GameObjects.Container;
  playerWeapon: Phaser.GameObjects.Image;
  playerCategory: number;

  shellEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  shellCategory: number;
  hasFired: boolean = false;

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  smokeEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager;

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

    this.playerCategory = this.matter.world.nextCategory();
    this.groundCategory = this.matter.world.nextCategory();

    this.matter.add.image(0, 700, 'ground', undefined, { isStatic: true, collisionFilter: { category: this.groundCategory } });
    this.matter.add.image(613, 700, 'ground', undefined, { isStatic: true, collisionFilter: { category: this.groundCategory } });
    this.matter.add.image(613 * 2, 700, 'ground', undefined, { isStatic: true, collisionFilter: { category: this.groundCategory } });
    this.matter.add.image(613 * 3, 700, 'ground', undefined, { isStatic: true, collisionFilter: { category: this.groundCategory } });
    this.matter.add.image(613 * 4, 700, 'ground', undefined, { isStatic: true, collisionFilter: { category: this.groundCategory } });


    this.playerWeapon = this.add.image(0, 0, 'm1')
    this.playerWeapon.scale = 0.2;
    this.playerSprites = this.add.container(50, 50, [this.playerWeapon]);
    this.playerSprites.setSize(50, 50);
    this.player = this.matter.add.gameObject(this.playerSprites) as Phaser.Physics.Matter.Sprite;
    this.player.setCollisionCategory(this.playerCategory);

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

    this.smokeEmitterManager = this.add.particles('smoke');
  }

  update() {
    this.fpsText.update();
    this.parallaxBackground.update();
    this.weatherController.updateZonePositionsX(this.cameras.main.scrollX);

    const angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(this.player.x + this.playerWeapon.x - this.cameras.main.scrollX, this.player.y + this.playerWeapon.y - this.cameras.main.scrollY, this.input.mousePointer.x, this.input.mousePointer.y);
    this.playerWeapon.setAngle(angle);

    if (angle > 90 || angle < -90) {
      this.playerWeapon.flipY = true;
    } else {
      this.playerWeapon.flipY = false;
    }

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

    const weaponPosX = this.playerWeapon.x + this.player.x;
    const weaponPosY = this.playerWeapon.y + this.player.y

    if (this.input.mousePointer.isDown && !this.hasFired) {
      const casing = this.matter.add.sprite(
        weaponPosX,
        weaponPosY,
        'undefined', undefined, {
        collisionFilter: { category: this.shellCategory },
        frictionAir: 0.05,
        mass: 1,
        force: new Phaser.Math.Vector2(-0.02, -0.1),
        torque: -1
      });
      this.hasFired = true;

      const smokeTrail = this.add.graphics();
      smokeTrail.lineGradientStyle(3, 0x848484, 0xffffff, 0x848484, 0xffffff, 0.8);
      smokeTrail.lineBetween(weaponPosX, weaponPosY, this.input.mousePointer.x, this.input.mousePointer.y);
      this.tweens.add({
        targets: smokeTrail,
        alpha: 0,
        duration: 2000,
        ease: 'Power2'
      });

      const emitter = this.smokeEmitterManager.createEmitter({
        x: weaponPosX,
        y: weaponPosY,
        quantity: 4,
        speed: { random: [100, 200] },
        lifespan: { random: [100, 200] },
        scale: { random: true, start: 1, end: 0 },
        rotate: { random: true, start: 0, end: 180 },
        angle: { random: true, start: 0, end: 270 },
        blendMode: 'ADD'
      });

      setTimeout(() => {
        casing.destroy();
        smokeTrail.clear();
      }, 5000);
      setTimeout(() => this.hasFired = false, 2000);
      setTimeout(() => this.smokeEmitterManager.removeEmitter(emitter), 200);
    }
  }
}
