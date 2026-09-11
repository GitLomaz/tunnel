class Enemy extends Phaser.GameObjects.Container {
  constructor(x, y, sprite, shadowPosition = 10, spawnAnim = true) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.enemies.add(this);
    this.shadow = scene.add.sprite(0, shadowPosition, "shadow");
    this.add(this.shadow);
    this.shadow.setAlpha(0.3);
    this.sprite = scene.add.sprite(0, 0, sprite);
    this.type = "enemy";
    this.add(this.sprite);
    this.knockback = 0;
    this.ticks = getRandomInt(0, 500);
    this.damageFlash = 0;

    this.healthBarBack = scene.add.rectangle(0, -24, 48, 6, 0x1c0000);
    this.healthBarBack.setStrokeStyle(2, 0x0e0000);
    this.healthBar = scene.add.rectangle(0, -24, 48, 6, 0xcb0000);
    this.healthBarBack.setAlpha(0);
    this.healthBar.setAlpha(0);
    this.minimapDot = scene.add.circle(-20, -20, 50, 0xff0000);
    this.minimapDot.setStrokeStyle(2, 0x0e0000);
    scene.cameras.main.ignore(this.minimapDot);
    this.add(this.minimapDot);
    this.add(this.healthBarBack);
    this.add(this.healthBar);
    this.left = getRandomInt(0, 2);
    if (spawnAnim) {
      this.spawnAnimation({ x: x, y: y });
    }
  }

  showHealthbar() {
    scene.tweens.add({
      targets: this.healthBarBack,
      alpha: 1,
      duration: 500,
      ease: "Linear",
    });
    scene.tweens.add({
      targets: this.healthBar,
      alpha: 1,
      duration: 500,
      ease: "Linear",
    });
  }

  tick() {
    this.ticks++;
    if (this.damageFlash > 0) {
      this.damageFlash--;
      let damageFlashState = Math.floor(this.damageFlash / 3);
      if (damageFlashState % 5 === 0) {
        this.sprite.clearTint();
        this.sprite.setTint(0xff0000);
      } else if (damageFlashState % 5 === 1) {
        this.sprite.clearTint();
        this.sprite.setTintFill(0xff0000);
      }
    } else {
      this.sprite.clearTint();
    }
  }

  takeDamage(damage, force) {
    if (this.damageFlash !== 0) {
      return;
    }
    if (this.healthBar.alpha === 0) {
      this.showHealthbar();
    }
    sc.play("hit_" + Phaser.Math.Between(1, 2) + ".mp3", 0.4, false, true);
    this.damageFlash = 25;
    this.applyKnockback(force);
    this.health = this.health - damage;
    scene.tweens.add({
      targets: this.healthBar,
      width: Math.floor((this.health / this.healthMax) * 48),
      duration: 400,
      ease: "Linear",
    });
    if (this.health <= 0) {
      this.die(force);
    }
  }

  applyKnockback(force, randomizer = 400) {
    this.body.setVelocityX(force.x * getRandomInt(100, randomizer));
    this.body.setVelocityY(force.y * getRandomInt(100, randomizer));
    this.knockback = 10;
  }

  die(force) {
    scene.player.addScore(this.points);
    for (let x = this.points * 1.5; x > 0; x = x - 50) {
      let points = new PointDrop(this.x, this.y, 50);
      points.body.setVelocityX(force.x * getRandomInt(100, 400));
      points.body.setVelocityY(force.y * getRandomInt(100, 400));
    }
    for (let i = 0; i < 2; i++) {
      if (oneIn(10)) {
        let health = new HealthDrop(this.x, this.y, 10);
        health.body.setVelocityX(force.x * getRandomInt(100, 400));
        health.body.setVelocityY(force.y * getRandomInt(100, 400));
      }
    }
    this.destroy();
  }

  spawnAnimation(
    location = { x: 200, y: 200 },
    tints = [0x00454a, 0x00757d, 0x008d96]
  ) {
    let x = 0;
    let intervalID = setInterval(function () {
      let height = Phaser.Math.Between(-10, -20);
      let left = Phaser.Math.Between(-15, 15);
      let at = scene.add.sprite(
        location.x - left,
        location.y + height,
        "pixel3"
      );
      at.tint = tints[Phaser.Math.Between(0, 2)];

      at.downTween = scene.tweens.add({
        targets: at,
        y: location.y + 15,
        duration: 350,
        ease: "Linear",
        onComplete: function () {
          this.targets[0].destroy();
        },
      });

      if (++x === 50) {
        clearInterval(intervalID);
      }
    }, 5);
  }
}
