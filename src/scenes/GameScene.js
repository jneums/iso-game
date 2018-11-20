

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.tileWidthHalf;
    this.tileHeightHalf;

    this.player;
    this.skeletons = [];

    this.facing = 'south';
    this.moveTarget;

    this.d = 0;
    this.scene;
  }
  preload () {
    this.load.json('map', 'assets/isometric-grass-and-water.json');
    this.load.spritesheet('tiles', 'assets/isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton', 'assets/skeleton8.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('house', 'assets/rem_0002.png');
    this.load.image('star', 'assets/star.png');
  }
  create () {
    this.scene = this.scene.scene
    this.buildMap();
    this.placeHouses();


    this.input.keyboard.on('keydown_SPACE', () => {
        this.player.anims.play('attack'+facing, true);

    });

    for(let i = 0; i<9; i++) {
      this.skeletons.push(this.add.existing(new Skeleton(this, Phaser.Math.Between(0,800), Phaser.Math.Between(0, 800), 'skeleton')));
    }

    this.player = new Player(this, 800, 364, 'skeleton')
    this.player.setCircle(20, 40, 60)
    this.scene.cameras.main.startFollow(this.player)

    this.moveTarget = this.physics.add.image(25, 25, 'star');
    this.moveTarget.setCircle(20, 0, -5)
    this.moveTarget.setVisible(false);

    //move target and start moving toward new pos
    this.input.on('pointerdown', function (pointer) {
      if(this.player.getCurrentTarget()) {
        this.player.clearCurrentTarget();
      }
      this.player.setInCombat(false);
      //scroll plus pointer.x to compensate for follow cam cooords
      let pointerPlusScrollX = pointer.x+this.cameras.cameras[0].scrollX;
      let pointerPlusScrollY = pointer.y+this.cameras.cameras[0].scrollY;
      this.moveTarget.setPosition(pointerPlusScrollX, pointerPlusScrollY )
      //need quadrants for better tracking
      this.scene.physics.moveToObject(this.player, this.moveTarget, 200);
      if (pointerPlusScrollX > this.player.x && pointerPlusScrollY < this.player.y) {
        this.player.anims.play('walknorthEast', true);
        this.facing = 'northEast';
      } else if (pointerPlusScrollX < this.player.x && pointerPlusScrollY < this.player.y) {
        this.player.anims.play('walknorthWest', true);
        this.facing = 'northWest';
      } else if (pointerPlusScrollY < this.player.y) {
        this.player.anims.play('walknorth', true);
        this.facing = 'north';
      } else if (pointerPlusScrollX > this.player.x && pointerPlusScrollY > this.player.y) {
        this.player.anims.play('walksouthEast', true);
        this.facing = 'southEast';
      } else if (pointerPlusScrollX < this.player.x && pointerPlusScrollY > this.player.y) {
        this.player.anims.play('walksouthWest', true);
        this.facing = 'southWest';
      } else if (pointerPlusScrollX > this.player.x) {
        this.player.anims.play('walkeast', true);
        this.facing = 'east';
      } else if (pointerPlusScrollX > this.player.x) {
        this.player.anims.play('walkwest', true);
        this.facing = 'west';
      } else if (pointerPlusScrollY > this.player.y) {
        this.player.anims.play('walksouth', true);
        this.facing = 'south';
      }
    }, this);

    this.skeletons.map((child) => {
      child.setCircle(20, 40, 60)
      child.on('clicked', clickHandler, this);
    });

    this.input.on('gameobjectup', function (pointer, gameObject)
    {
        gameObject.emit('clicked', gameObject);
    }, this);


    function clickHandler(enemy) {
      this.player.setCurrentTarget(enemy);
      this.player.setInCombat(true);
    };

    //stop the player at the moveTarget
    this.physics.add.overlap(this.player, this.moveTarget, function (playerOnMoveTarget) {
      playerOnMoveTarget.body.stop();
    }, null, this);


    //used for testing
    this.input.keyboard.on('keydown_ENTER', () => {
      console.log(this.player.geCurrentLevel());
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
    //player.update();
    if(this.player.swingTimer > 0) {
      this.player.swingTimer--
    }
    if(this.player.getCurrentTarget()) {
      let enemy = this.player.getCurrentTarget();
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < 75 && this.player.isInCombat()) {
        if(this.player.swingTimer <= 0 && !enemy.isDead()) {
          this.player.anims.play('attack'+this.facing)
          this.player.meleeSwing(enemy);
        } else if (enemy.isDead()) {
          enemy.anims.play('diesouthEast');
          this.player.setInCombat(false);
          this.player.clearCurrentTarget();

        }
      }
    }
  }
}
