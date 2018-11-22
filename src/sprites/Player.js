import CharacterSheet from './CharacterSheet.js';

export default class Player extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);

    this.setScale(.75);

    this.str = 19;
    this.agi = 19;
    //TODO fix depth sorting, especially in map creator
    this.depth = y + 64;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.registry.set('playerHps', this.currentHps);
    this.gameOver = false;
    //initialize hp, updates ui right away.
    this.setCurrentHp(0, 'heal');

  };
  setCurrentHp(val, type) {
    if (type === 'melee') {
      console.log('type: melee');
      this.currentHps -= val;
    } else if (type === 'heal') {
      this.currentHps += val;
    }
    this.scene.registry.set('playerHps', this.currentHps)
  };

  update() {
    if(!this.isDead()) {
      if(this.isMoving) {
        this.anims.play('walk'+this.getFacing(), true);
      } else if(this.isInCombat()) {
        if (Phaser.Math.Distance.Between(this.x, this.y, this.getCurrentTarget().x, this.getCurrentTarget().y) < 75 && this.isInCombat()) {
          this.getCurrentTarget().setCurrentTarget(this);

          this.swingTimer--;
          if(this.swingTimer <= 0 && !this.currentTarget.isDead()) {
            this.anims.play('attack'+this.getFacing())
            this.meleeSwing(this.getCurrentTarget());
          }
        }
      } else {
        this.anims.play('idle'+this.getFacing(), true);
      }
    } else {
      this.anims.play('die'+this.getFacing());
      console.log("you died");
      this.gameOver = true;
    }
  }
}
