import CharacterSheet from './CharacterSheet.js';

export default class Player extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);

    this.setScale(.75);

    this.str = 19;
    this.agi = 19;
    this.currentHps = 100;

    scene.registry.set('playerHps', this.currentHps);
    this.gameOver = false;
    //initialize hp, updates ui right away.
    this.setCurrentHp(0, 'heal');
    this.cooldowns = {
      swing: 0,
      crush: 0,
    }

  };

  setCurrentHp(val, type) {
    if (type === 'melee') {
      this.currentHps -= val;
    } else if (type === 'heal') {
      this.currentHps += val;
    }
    this.scene.registry.set('playerHps', this.currentHps)
  };

  update() {
    if(!this.isDead()) {
      this.cooldowns.swing--;
      this.cooldowns.crush--;
      if(this.isMoving) {
        this.anims.play('knight_west_walk', true)
        //this.walking();
        this.depth = this.y + 64;
      } else if(this.isInCombat() && this.getCurrentTarget()) {
        this.setFacing(this.getRadsToCurrentTarget());
        if (Phaser.Math.Distance.Between(this.x, this.y, this.getCurrentTarget().x, this.getCurrentTarget().y) < 100) {
          this.isMoving = false;
          if(this.cooldowns.swing <= 0 && !this.getCurrentTarget().isDead()) {
            this.meleeSwing(this.getCurrentTarget());
          } else if(this.getCurrentTarget().isDead()) {
            this.setInCombat(false);
          }
        }
      } else {
        this.idle();
        if(this.getCurrentHps() < this.getMaxHp())
        this.setCurrentHp(.0009, 'heal')
      }
    } else {
      this.anims.play('die'+this.getFacing());
      console.log("you died");
      this.gameOver = true;
    }
  }
}
