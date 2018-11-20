import CharacterSheet from './CharacterSheet.js';

export default class Player extends CharacterSheet {
  constructor (scene, x, y, texture) {

    super(scene, x, y, texture);

    this.startX = x;
    this.startY = y;
    this.setTexture(texture);


    this.depth = y + 64;

    scene.add.existing(this);
    scene.physics.add.existing(this);


  };

  meleeSwing(target) {
    let atp = this.getAttackPower();
    let dmg =Phaser.Math.Between(1,6)*atp ;
    if(Phaser.Math.Between(0, 100) < 34) {
      console.log('miss');
    } else {
      if(this.willCrit()) {
        let crit = dmg * 2;
        target.setCurrentHp(crit, 'melee')
        console.log('crit for: ' + crit);

      } else {
        console.log('swing does: '+dmg);
        target.setCurrentHp(dmg, 'melee');
      }
      console.log(target.getCurrentHps());
    }
    this.swingTimer = this.weaponTimer;
  }
  update() {

  }
}
