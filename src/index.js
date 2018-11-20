import 'phaser';
import Skeleton from './sprites/Skeleton.js';
import Player from './sprites/Player.js';
import { createAnimations, directionNames, motions } from './animations.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';


class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    });
  }
  preload() {
    createAnimations(this);
    this.scene.start('GameScene');
  }
}


//config file
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#ababab',
  parent: 'phaser-example',
  physics: {
    default: 'arcade',
    arcade: {
        debug: false,
        gravity: { y: 0 }
    }
  },
  scene: [ BootScene, GameScene, UIScene ]
};

var game = new Phaser.Game(config);
