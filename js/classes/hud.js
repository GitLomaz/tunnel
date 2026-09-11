class HUD extends Phaser.GameObjects.Container {
  // static counter = 0;

  constructor() {
    super(scene, 0, 0);

    this.healthBack = scene.add.rectangle(0, 0, 280, 30, 0x440000);
    this.healthBack.setOrigin(0);
    this.add(this.healthBack);

    this.attackBack = scene.add.rectangle(0, 30, 230, 16, 0x004400);
    this.attackBack.setOrigin(0);
    this.add(this.attackBack);

    this.skillBack = scene.add.rectangle(0, 46, 230, 16, 0x000044);
    this.skillBack.setOrigin(0);
    this.add(this.skillBack);

    this.health = scene.add.sprite(12, 12, "healthBar");
    this.health.setOrigin(0);
    this.add(this.health);

    this.attack = scene.add.sprite(3, 32, "attackBar");
    this.attack.setOrigin(0);
    this.add(this.attack);

    this.skill = scene.add.sprite(3, 48, "skillBar");
    this.skill.setOrigin(0);
    this.add(this.skill);

    this.skillTint = scene.add.sprite(3, 48, "skillBarTint");
    this.skillTint.setOrigin(0);
    this.skillTint.alpha = 0;
    this.add(this.skillTint);

    this.sprite = scene.add.sprite(0, 0, "hud");
    this.sprite.setOrigin(0);
    this.add(this.sprite);

    this.setScrollFactor(0);
    this.depth = 200;
    scene.add.existing(this);
  }

  updateHealth(value) {
    scene.tweens.add({
      targets: this.health,
      scaleX: value,
      duration: 250,
      ease: "Linear",
    });
  }

  updateAttack(value) {
    this.attack.scaleX = value;
  }

  updateMana(value) {
    scene.tweens.add({
      targets: [this.skill, this.skillTint],
      scaleX: value,
      duration: 250,
      ease: "Linear",
    });
  }

  hideBars() {
    scene.tweens.add({
      targets: [
        this.sprite,
        this.skill,
        this.attack,
        this.health,
        this.skillBack,
        this.attackBack,
        this.healthBack,
      ],
      alpha: 0,
      duration: 250,
      ease: "Linear",
    });
  }
}
