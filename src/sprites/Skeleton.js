import CharacterSheet from './CharacterSheet.js';

export default class Skeleton extends CharacterSheet {
  constructor (scene, x, y, texture) {
    super(scene, x, y, texture);

    this.x = x;
    this.y = y;
    console.log(this.startX, this.startY);
    this.setTexture(texture);


    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.depth = y + 64;
    this.setInteractive();

  };

  update() {

  }
}
