export default class CharacterSheet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene);

    this.str = Phaser.Math.Between(1,19);
    this.agi = Phaser.Math.Between(1,19);;
    this.sta = Phaser.Math.Between(1,19);;

    this.motion = 'idle';
    this.speed = 0.15;
    this.inCombat = false;
    this.swingTimer = 0;
    this.weaponTimer = 100;
    this.weaponDmg = 1.2;
    this.strength = 1.8;
    this.chanceToMiss = .15;
    this.chanceToCrit = .15;
    this.currentHps = this.getMaxHp();
    this.currentTarget = undefined;


  };
  willCrit() {
    if(Phaser.Math.Between(0,100) < this.agi) {
      return true;
    } else {
      return false;
    }
  }
  getAttackPower() {
    return this.str / 100;
  }
  getMaxHp() {
    return this.sta * .25;
  }
  getCurrentHps() {
    return this.currentHps;
  }
  setCurrentHp(val, type) {
    if (type === 'melee') {
      console.log('type: melee');
      this.currentHps -= val;
    } else if (type === 'heal') {
      this.currentHps += val;
    }
  }
  geCurrentLevel() {
    return this.lvl;
  }
  setCurrentTarget(target) {
    this.currentTarget = target;
    this.currentTarget.setTint('0x7fff0000')
  }
  getCurrentTarget() {
    return this.currentTarget;
  }
  clearCurrentTarget() {
    this.currentTarget.clearTint();
    this.currentTarget = undefined;
  }
  setInCombat(bool) {
    this.inCombat = bool;
  }
  isInCombat() {
    return this.inCombat;
  }

  isDead() {
    if(this.getCurrentHps() <= 0) {
     return true;
   } else {
     return false;
   }
  }

}
