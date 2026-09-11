class BlobSpawner extends Enemy {
  // static counter = 0;

  constructor(x = 2225, y = 280, spanAnim = true) {

    super(x, y, "blob", 22, spanAnim);
    this.shadow.setScale(0.7);
    this.setSize(25, 0);
    this.body.setCircle(13);
    this.body.setImmovable(true);
    this.health = 10;
    this.healthMax = 10;
    this.points = getRandomInt(20, 120);
    this.attackType = "melee";
    this.moveSpeed = 90;
    this.setScale(3)
    this.cohort = []
    this.closestWaypoint = null;
    scene.waypoints.forEach(waypoint => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, waypoint.x, waypoint.y);
      if (!this.closestWaypoint || dist < Phaser.Math.Distance.Between(this.x, this.y, this.closestWaypoint.x, this.closestWaypoint.y)) {
        this.closestWaypoint = waypoint;
      }
    });
  }

  tick() {
    super.tick();
    if (this.ticks > 500) {
      console.log('spawning')
      this.ticks = 0;
      this.cohort.push(new Blob(getRandomInt(this.x - 50, this.x + 50), getRandomInt(this.y - 50, this.y + 50)));
    }
    // if cohort is full, dispatch
    if (this.cohort.length >= 5) {
      this.cohort.forEach(blob => {
        blob.waypoint = this.closestWaypoint;
      });
      this.cohort = [];
    }
  }
}
