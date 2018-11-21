import CharacterSheet from './CharacterSheet.js';

export default class Skeleton extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);



    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.depth = y + 64;
    this.setInteractive();
    this.weaponTimer = 150

  };

  update() {
    if(this.isInCombat() && this.getCurrentTarget()) {
      this.swingTimer--;
      this.setFacing(this.getRadsToCurrentTarget());
      if(this.swingTimer <= 0) {
        this.anims.play('attack'+this.getFacing())
        this.meleeSwing(this.getCurrentTarget())
      };
    } else {
      this.anims.play('idle'+this.getFacing(), true)
    }

  }
}
