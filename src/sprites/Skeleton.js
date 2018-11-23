import CharacterSheet from './CharacterSheet.js';

export default class Skeleton extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);



    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.depth = y + 64;
    this.setInteractive();
    this.weaponTimer = 150
    this.idling = scene.time.addEvent({
      delay: 5000,
      callback: this.idlingCallback,
      callbackScope: this,
      loop: true,
    })
  };

  idlingCallback() {
    console.log("idling");
  };

  setCurrentHp(val, type) {
    if (type === 'melee') {
      console.log('type: melee');
      this.currentHps -= val;
    } else if (type === 'heal') {
      this.currentHps += val;
    }
    this.scene.registry.set('targetHps', this.currentHps)
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
      this.idling;
    }

  }
}
