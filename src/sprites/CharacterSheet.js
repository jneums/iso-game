export default class CharacterSheet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.x = x;
    this.y = y;
    this.setTexture(texture);
    //TODO fix depth sorting, especially in map creator
  

    scene.add.existing(this);
    scene.physics.add.existing(this);

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
    this.overkill = 0;
    this.overheal = 0;

    this.facing = 'south';
    this.shouldUpdate = true;

  };
  die() {

    this.scene.registry.set('targetHps', 0)
    this.clearCurrentTarget();
    this.body.checkCollision.none = true;
    this.disableInteractive();
    this.setShouldUpdate(false);
    this.anims.play('die'+this.getFacing(), true)
  }
  getRadsToCurrentTarget() {
    if(this.currentTarget) {
      return Phaser.Math.Angle.BetweenY(this.x, this.y, this.currentTarget.x, this.currentTarget.y)
    };
  };
  setShouldUpdate(bool) {
    this.shouldUpdate = bool;
  }
  getShouldUpdate() {
    return this.shouldUpdate;
  }
  getFacing() {
    return this.facing;
  };
  setFacing(rads) {
    //use switch
    if(rads < -2.7475 || rads > 2.7475) {
      this.facing = 'north';
    } else if(rads < 2.7475 && rads > 1.9625) {
      this.facing = 'northEast';
    } else if(rads < 1.9625 && rads > 1.1775) {
      this.facing = 'east';
    } else if(rads < 1.1175 && rads > 0.3925) {
      this.facing = 'southEast';
    } else if(rads < 0.3925 && rads > -0.3925) {
      this.facing = 'south';
    } else if(rads < -0.3925 && rads > -1.1775) {
      this.facing = 'southWest';
    } else if(rads < -1.1775 && rads > -1.9625) {
      this.facing = 'west';
    } else if(rads < -1.9625 && rads > -2.7475) {
      this.facing = 'northWest';
    }
  };
  morphine() {
    let amt = Phaser.Math.Between(1, this.getMaxHp());
    this.setCurrentHp(amt, 'heal');
    console.log('healed for: ' + amt*10);
  }
  meleeSwing(target) {
    let atp = this.getAttackPower();
    let dmg = Phaser.Math.Between(1,6)*atp ;
    if(Phaser.Math.Between(0, 100) < 34) {
      console.log('miss');
    } else {
      if(this.willCrit()) {
        let crit = dmg * 2;
        target.setCurrentHp(crit, 'melee')
        //camera shake
        console.log('crit for: ' + crit);

      } else {
        console.log('swing does: '+dmg);
        target.setCurrentHp(dmg, 'melee');
      }
      console.log(target.getCurrentHps());
    }
    this.swingTimer = this.weaponTimer;
  };

  willCrit() {
    if(Phaser.Math.Between(0,100) < this.agi) {
      return true;
    } else {
      return false;
    }
  };
  getAttackPower() {
    return this.str / 100;
  };
  getMaxHp() {
    return this.sta * .25;
  };
  getCurrentHps() {
    return this.currentHps;
  };
  setCurrentHp(val, type) {
    if (type === 'melee') {
      console.log('type: melee');
      if( this.currentHps -= val < 0) {
        this.overkill = (val - this.currentHps);
        this.currentHps = 0;
      }
      this.currentHps -= val;
    } else if (type === 'heal') {
      if(this.currentHps += val > this.getMaxHp()) {
        this.overheal = (this.currentHps += val) - this.getMaxHp();
      }
      this.currentHps += val;
    }
  };
  geCurrentLevel() {
    return this.lvl;
  };
  setCurrentTarget(target) {
    this.currentTarget = target;
    //this.currentTarget.setTint('0x7fff0000')
  };
  getCurrentTarget() {
    return this.currentTarget;
  };
  clearCurrentTarget() {
    this.currentTarget.clearTint();
    this.currentTarget = undefined;
  };
  setInCombat(bool) {
    this.inCombat = bool;
  };
  isInCombat() {
    return this.inCombat;
  };

  isDead() {
    if(this.getCurrentHps() <= 0) {
     return true;
   } else {
     return false;
   }
 };

}
