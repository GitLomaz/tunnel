function preloader() {
  scene.load.image("shadow", "images/shadow.png");

  scene.load.audio("footsteps", ["sound/sounds/footsteps.mp3"]);

  scene.load.image("hud", "images/hud.png");
  scene.load.image("healthBar", "images/healthBar.png");
  scene.load.image("attackBar", "images/attackBar.png");
  scene.load.image("skillBar", "images/skillBar.png");
  scene.load.image("skillBarTint", "images/skillBarTint.png");
  scene.load.image("pixel3", "images/pixel3.png");

  scene.load.image("16x16", "images/sheets/16x16.png");
  scene.load.image("32x32", "images/sheets/32x32.png");
  scene.load.image("48x48", "images/sheets/48x48.png");
  scene.load.image("64x64", "images/sheets/64x64.png");

  scene.load.tilemapTiledJSON("map", "data/map.tmj");

  scene.load.spritesheet("slash", "images/slash.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

  scene.load.spritesheet("player", "images/player.png", {
    frameWidth: 48,
    frameHeight: 48,
  });

  ["mimic", "blob", "bull", "spore", "mage", "bigBlob", "iceTotem"].forEach((enemy) => {
      scene.load.spritesheet(enemy, "images/enemies/" + enemy + ".png", {
        frameWidth: 48,
        frameHeight: 48,
      });
  });
}