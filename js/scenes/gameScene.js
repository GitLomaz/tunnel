let gameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function gameScene() {
    Phaser.Scene.call(this, {
      key: "gameScene",
    });
  },

  preload: function () {
    scene = this;
    preloader();
  },

  create: function () {
    this.map = this.make.tilemap({ key: "map" });
    this.smol = this.map.addTilesetImage("16x16", "16x16", 32, 32);
    this.med = this.map.addTilesetImage("32x32", "32x32", 32, 32);
    this.big = this.map.addTilesetImage("48x48", "48x48", 32, 32);
    this.huge = this.map.addTilesetImage("64x64", "64x64", 32, 32);
    this.layer1 = this.map.createLayer("ground", [this.smol, this.med, this.big, this.huge], 0, 0);
    this.layer2 = this.map.createLayer("floor", [this.smol, this.med, this.big, this.huge], 0, 0);
    this.layer3 = this.map.createLayer("doodads", [this.smol, this.med, this.big, this.huge], 0, 0);
    this.waypoints = this.map.objects[0].objects.map((obj, i) => ({i: i, x: obj.x, y: obj.y }));


    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
    this.mouse = this.input.activePointer;


    this.player = new Player();

    this.enemies = this.physics.add.group();

    scene.physics.add.collider(this.enemies);



    this.anims.create({
      key: "slash",
      frames: this.anims.generateFrameNumbers("slash"),
      frameRate: 30,
      repeat: 0,
    });

    // Load inital level stuffs
    this.blobSpawner = new BlobSpawner();
  },
    
  update: function (time) {
    this.player.tick();
      scene.enemies.children.entries.forEach((e) => {
      e.tick();
    });
  },
});
