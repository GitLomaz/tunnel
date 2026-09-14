let config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "wrapper",
  scene: [gameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      overlapBias: 16,
    },
  },
};

let game = new Phaser.Game(config);
