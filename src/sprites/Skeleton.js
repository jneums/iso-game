import CharacterSheet from './CharacterSheet.js';

export default class Skeleton extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);



    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.weaponTimer = 150

  };

  moveToAttacker(attacker) {
    this.scene.physics.moveToObject(this, attacker, 100);
  }

  setCurrentHp(val, type) {
    if (type === 'melee') {
      this.currentHps -= val;
    } else if (type === 'heal') {
      this.currentHps += val;
    }
    this.scene.registry.set('targetHps', this.currentHps)
  };


  update() {
    this.cooldowns.swing--;

    if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 200) {
      this.setInCombat(true);
      this.setCurrentTarget(this.scene.player);
    }
    if(this.isInCombat() && this.getCurrentTarget()) {
      this.setFacing(this.getRadsToCurrentTarget());
      if(Phaser.Math.Distance.Between(this.x, this.y, this.getCurrentTarget().x, this.getCurrentTarget().y) > 75) {
        this.walking();
        this.moveToAttacker(this.getCurrentTarget());
        this.depth = this.y + 64;
      } else if(Phaser.Math.Distance.Between(this.x, this.y, this.getCurrentTarget().x, this.getCurrentTarget().y) < 75 && this.cooldowns.swing <= 0) {
        this.meleeSwing(this.getCurrentTarget());
      }
    } else {
      this.idle();

    }

  }
}
