export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('mountains-back', 'assets/img/mountains-back.png');
    this.load.image('mountains-mid1', 'assets/img/mountains-mid1.png');
    this.load.image('mountains-mid2', 'assets/img/mountains-mid2.png');

    this.load.image('ground', 'assets/ground.png');

    this.load.spritesheet('rainSplash', 'assets/rain-splash-sprite.png', { frameWidth: 10, frameHeight: 10 });
  }

  create() {
    this.scene.start('MainScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
