export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: true });
    this.timeText;

  }
  create() {
    this.timeText = this.add.text(0, 0);
  }
  update(time, delta) {
    this.timeText.setText('Time: ' + time + '\nDelta: ' + delta);
  }
};
