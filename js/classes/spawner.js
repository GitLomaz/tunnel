class Spawner extends Phaser.GameObjects.Container {
  // static counter = 0;

  constructor() {
    super(scene, 600, 600);
    this.shadow = scene.add.sprite(0, 24, "shadow");
    this.shadow.setScale(0.75);
    this.shadow.setAlpha(0.3);
    this.add(this.shadow);
    this.player = scene.add.sprite(0, 0, "player");
    this.player.setFrame(1);
    this.playerAngle = 0;
    this.setSize(20, -10);
    this.type = "spawner";
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  tick() {
    if (this.dead) {
      return;
    }

    
  }
}
