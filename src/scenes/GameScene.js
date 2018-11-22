import Skeleton from '../sprites/Skeleton.js';
import Player from '../sprites/Player.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.tileWidthHalf;
    this.tileHeightHalf;

    this.player;
    this.skeletons = [];

    this.moveTarget;

    this.d = 0;
    this.scene;
  }
  preload () {

  }
  create () {
    this.scene = this.scene.scene
    this.buildMap();
    this.placeHouses();



    this.input.keyboard.on('keydown_SPACE', () => {
        this.player.anims.play('attack'+this.player.facing, true);

    });

    for(let i = 0; i<9; i++) {
      this.skeletons.push(this.scene.add.existing(new Skeleton(this, Phaser.Math.Between(300,1200), Phaser.Math.Between(100, 500), 'skeleton')));
    }

    this.player = new Player(this, 800, 364, 'skeleton')
    this.player.setCircle(20, 40, 60)
    this.scene.cameras.main.startFollow(this.player).setZoom(1)

    this.moveTarget = this.physics.add.image(25, 25, 'star');
    this.moveTarget.setCircle(20, 0, -5).setVisible(false).setScale(.75);

    //move target and start moving toward new pos
    this.input.on('pointerdown', function (pointer) {

      //scroll plus pointer.x to compensate for follow cam cooords
      let pointerPlusScrollX = pointer.x+this.cameras.cameras[0].scrollX;
      let pointerPlusScrollY = pointer.y+this.cameras.cameras[0].scrollY;
      let angle = Phaser.Math.Angle.BetweenY(this.player.x, this.player.y, pointerPlusScrollX, pointerPlusScrollY);

      if(this.player.getCurrentTarget()) {
        this.player.clearCurrentTarget();
      }

      this.player.setInCombat(false);

      this.moveTarget.setPosition(pointerPlusScrollX, pointerPlusScrollY )

      this.player.setFacing(angle);
      this.scene.physics.moveToObject(this.player, this.moveTarget, 100);
      this.player.isMoving = true;
    }, this);

    this.skeletons.map((child) => {
      child.setCircle(20, 40, 60)
      child.on('clicked', clickHandler, this);
    });

    this.input.on('gameobjectup', function (pointer, gameObject) {
      gameObject.emit('clicked', gameObject);
    }, this);

    //if enemy is clicked
    function clickHandler(enemy) {
      this.player.setCurrentTarget(enemy);
      this.player.setInCombat(true);
      enemy.setInCombat(true);
    };

    //stop the player at the moveTarget, or at the hitbox of the enemy
    this.physics.add.overlap(this.player, this.moveTarget, function (playerOnMoveTarget) {
      playerOnMoveTarget.isMoving = false;
      playerOnMoveTarget.body.stop();
    }, null, this);

    this.physics.add.overlap(this.player, this.skeletons, function (playerOnEnemy) {
      playerOnEnemy.body.stop()
      playerOnEnemy.isMoving = false;
    }, null, this);



    //used for testing
    this.input.keyboard.on('keydown_ENTER', () => {
      console.log(this);
    });
  }

  //building a map
  buildMap () {
    var data = this.scene.cache.json.get('map');

    var tilewidth = data.tilewidth;
    var tileheight = data.tileheight;

    this.tileWidthHalf = tilewidth / 2;
    this.tileHeightHalf = tileheight / 2;

    var layer = data.layers[0].data;

    var mapwidth = data.layers[0].width;
    var mapheight = data.layers[0].height;

    var centerX = mapwidth * this.tileWidthHalf;
    var centerY = 16;

    var i = 0;

    for (let y = 0; y < mapheight; y++) {
      for (let x = 0; x < mapwidth; x++) {
        var id = layer[i] - 1;

        var tx = (x - y) * this.tileWidthHalf;
        var ty = (x + y) * this.tileHeightHalf;

        var tile = this.scene.add.image(centerX + tx, centerY + ty, 'tiles', id);

        //keeps map behind objects
        tile.depth = 0;

        i++;
      }
    }
  }

  placeHouses() {
    var house = this.scene.add.image(240, 370, 'house');

    house.depth = house.y + 86;

    house = this.scene.add.image(1300, 290, 'house');

    house.depth = house.y + 86;
  }

  update (time, delta) {
    if(this.player.gameOver) {
      return;
    }
    this.skeletons.map((skeleton) => {
      if(skeleton.getShouldUpdate()) {
        if(skeleton.isDead()) {
          skeleton.die();
        } else {
          skeleton.update();
        }
      }
    })
    this.player.update();

  }
}
