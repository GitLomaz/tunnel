class Blob extends Enemy {
  // static counter = 0;

  constructor(x, y, spanAnim = true) {

    super(x, y, "blob", 22, spanAnim);
    this.shadow.setScale(0.7);
    this.setSize(25, 0);
    this.body.setCircle(13);
    this.health = 10;
    this.healthMax = 10;
    this.points = getRandomInt(20, 120);
    this.attackType = "melee";
    this.moveSpeed = 90;
    this.waypoint = false;
  }

  tick() {
    super.tick();
    if (this.knockback === 0) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, scene.player.x, scene.player.y);
      if (dist < 300) {
        scene.physics.moveToObject(this, scene.player, this.moveSpeed);
      } else if (this.waypoint) {
        if (Phaser.Math.Distance.Between(this.x, this.y, this.waypoint.x, this.waypoint.y) < 30) {
          this.waypoint = scene.waypoints[this.waypoint.i - 1] || scene.waypoints[0];
        }
        scene.physics.moveTo(this, this.waypoint.x, this.waypoint.y, this.moveSpeed);
      }
      if (this.ticks % 10 === 0) {
        this.sprite.setFrame((this.ticks % 30) / 10);
      }
    } else {
      this.knockback--;
    }
  }
}
