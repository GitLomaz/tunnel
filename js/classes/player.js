class Player extends Phaser.GameObjects.Container {
  // static counter = 0;

  constructor() {
    super(scene, 9000, 220);
    this.shadow = scene.add.sprite(0, 24, "shadow");
    this.shadow.setScale(0.75);
    this.shadow.setAlpha(0.3);
    this.add(this.shadow);
    this.player = scene.add.sprite(0, 0, "player");
    this.player.setFrame(1);
    this.playerAngle = 0;
    this.setSize(20, -10);
    this.type = "player";
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.add(this.player);
    this.body.setCircle(9);
    this.body.setImmovable(false);
    this.attackCooldown = 0;
    this.magnet = 150;
    this.coins = 0;
    this.stepCounter = 0;
    this.swinging = 0;
    this.hud = new HUD();
    this.takenDamage = false;
    this.dead = false;
    this.damageFlash = 0;

    this.health = {
      health: 10,
      maxHealth: 10,
      shield: 0,
    };
    this.mana = {
      mana: 6000,
      maxMana: 6000,
      shield: 0,
    };
    this.attackType = 0
    this.attackTypes = [
      {
        range: 125,
        arc: 1.2,
        modifer: 1,
        damage: 4,
        anim: "slash",
        cooldown: 40,
      },
      {
        range: 110,
        arc: 12,
        modifer: 1.1,
        damage: 3,
        anim: "roundSlash",
        cooldown: 75,
      },
      {
        range: 170,
        arc: 0.6,
        modifer: 1.25,
        damage: 5,
        anim: "jab",
        cooldown: 75,
      },
    ];
    this.stun = 0;

    scene.cameras.main.setBounds(
      0,
      0,
      scene.map.widthInPixels,
      scene.map.heightInPixels
    );
    scene.cameras.main.startFollow(this);
    let that = this;
    scene.input.on(
      "pointermove",
      function (pointer) {
        let angle =
          Phaser.Math.RAD_TO_DEG *
          Phaser.Math.Angle.Between(
            that.x,
            that.y,
            pointer.worldX,
            pointer.worldY
          );
        that.playerAngle = angle;
      },
      this
    );

    scene.input.on("pointerdown", function (pointer) {
      if (pointer.rightButtonDown()) {
        // that.skill();
      } else {
        that.attack();
      }
    });

    // scene.wasd.space.on("down", function (key, event) {
    //   that.skill();
    // });

    // scene.wasd.esc.on("down", function (key, event) {
    //   scene.scene.pause();
    //   scene.scene.launch("pauseScene");
    // });
  }

  tick() {
    if (this.dead) {
      this.body.setVelocityY(0);
      this.body.setVelocityX(0);
      return;
    }

    // this.hud.updateAttack(Math.abs(this.attackCooldown / 60 - 1));
    this.player.clearTint();
    
    if (this.damageFlash > 0) {
      this.damageFlash--;
      let damageFlashState = Math.floor(this.damageFlash / 3);
      if (damageFlashState % 5 === 0) {
        this.player.setTint(0xff0000);
      } else if (damageFlashState % 5 === 1) {
        this.player.setTintFill(0xff0000);
      }
    }

    if (this.attackCooldown !== 0) {
      this.attackCooldown--;
    }

    if (this.stun !== 0) {
      this.stun--;
      return;
    }

    this.body.setVelocityX(0);
    this.body.setVelocityY(0);

    if (this.swinging !== 0) {
      this.swinging--;
      return;
    }

    // if (this.casting !== 0) {
    //   this.casting--;
    //   return;
    // }

    // this.gainSkill(1);

    // if (this.hud.eodPanel) {
    //   return false;
    // }

    let offset = 0;

    if (this.playerAngle > -40 && this.playerAngle < 45) {
      offset = 32;
    } else if (this.playerAngle > -45 && this.playerAngle < 130) {
      offset = 0;
    } else if (this.playerAngle > -135 && this.playerAngle < -40) {
      offset = 48;
    } else {
      offset = 16;
    }

    let counter = this.stepCounter;

    let velocityX = 0;
    let velocityY = 0;

    if (scene.cursors.left.isDown || scene.wasd.left.isDown) {
      this.stepCounter++;
      velocityX = -250;
    } else if (scene.cursors.right.isDown || scene.wasd.right.isDown) {
      this.stepCounter++;
      velocityX = 250;
    }

    if (scene.cursors.up.isDown || scene.wasd.up.isDown) {
      this.stepCounter++;
      velocityY = -250;
    } else if (scene.cursors.down.isDown || scene.wasd.down.isDown) {
      this.stepCounter++;
      velocityY = 250;
    }

    if (velocityX !== 0 && velocityY !== 0) {
      velocityX = 177 * Math.sign(velocityX);
      velocityY = 177 * Math.sign(velocityY);
    }
    if (velocityX !== 0) {
      this.body.setVelocityX(velocityX);
    }
    if (velocityY !== 0) {
      this.body.setVelocityY(velocityY);
    }

    if (this.stepCounter === counter) {
      this.stepCounter = 21;
      // sc.stop("footsteps.mp3");
    } else {
      // sc.play("footsteps.mp3", 0.5);
      this.stepCounter = counter + 1;
    }

    let newFrame = (Math.floor(this.stepCounter / 20) % 4) + offset;

    if ((newFrame !== this.player.frame.name) !== newFrame) {
      this.player.setFrame(newFrame);
    }
  }

  gainCoins(value) {
    this.coins = this.coins + value;
  }

  gainHealth(value) {
    this.health.health = this.health.health + value;
    if (this.health.health > this.health.maxHealth) {
      this.health.health = this.health.maxHealth;
    }
    this.hud.updateHealth(this.health.health / this.health.maxHealth);
  }

  gainMana(value) {
    this.mana.mana = this.mana.mana + value;
    if (this.mana.mana > this.mana.maxMana) {
      this.mana.mana = this.mana.maxMana;
    }
    this.hud.updateMana(this.mana.mana / this.mana.maxMana);
  }

  applyKnockback(force, randomizer = 400) {
    this.body.setVelocityX(force.x * getRandomInt(100, randomizer));
    this.body.setVelocityY(force.y * getRandomInt(100, randomizer));
  }

  takeDamage(damage, enemy) {
    // if (enemy.type === "projectile") {
    //   enemy.destroy();
    // }
    // if (this.hud.eodPanel || this.damageFlash > 0 || this.dead) {
    //   return false;
    // }
    // sc.play("hurt.mp3", 0.8);
    // let a = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
    // let x = Math.cos(a);
    // let y = Math.sin(a);
    // if (enemy.type === "enemy") {
    //   enemy.applyKnockback({ x: x, y: y }, 100);
    //   if (enemy.attackType === "charge" && enemy.charging < 0) {
    //     enemy.charging = 0;
    //     damage = damage * 2;
    //   }
    // }
    // this.health.health = this.health.health - damage;
    // this.takenDamage = true;
    // this.hud.updateHealth(this.health.health / this.health.maxHealth);
    // if (this.health.health <= 0) {
    //   this.dead = true;
    //   this.die();
    // }
    // this.applyKnockback({ x: -x, y: -y }, 100);
    // this.stun = 10;
    // this.damageFlash = 60;
  }

  attack() {
    if (this.attackCooldown !== 0) {
      return;
    }
    let attackType = this.attackTypes[this.attackType];
    this.attackCounter++;
    this.attackCooldown = attackType.cooldown;
    this.swinging = 15;
    let spr = scene.add.sprite(0, 0, attackType.anim);
    spr.setScale(3);
    spr.setAngle(this.playerAngle);
    this.add(spr);
    spr.anims.play(attackType.anim, true);
    // sc.play("swing_" + Phaser.Math.Between(1, 3) + ".mp3", 0.4);
    spr.on(
      "animationcomplete",
      function () {
        spr.destroy();
      },
      spr
    );
    let hit = false;
    let interaction = false;
    do {
      interaction = false;
      scene.enemies.children.entries.forEach(e => {
        if (e && e.type === "enemy") {
          let d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
          if (d < attackType.range) {
            let a = Phaser.Math.Angle.Between(this.x, this.y, e.x, e.y);
            let delta = Math.abs(
              Phaser.Math.Angle.Wrap(Phaser.Math.DegToRad(this.playerAngle) - a)
            );
            if (delta < attackType.arc && e.damageFlash === 0) {
              hit = true;
              let x = Math.cos(a);
              let y = Math.sin(a);
              e.takeDamage(attackType.damage, {
                x: x * attackType.modifer,
                y: y * attackType.modifer,
              });
              interaction = true;
            }
          }
        }
      });
    } while (interaction);
    if (hit) {
      this.hitCounter++;
    }
  }
}
