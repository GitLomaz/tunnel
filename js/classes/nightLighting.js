// Nighttime ambient darkness + a warm torch light that follows the player.
// Built on Phaser's native Lights2D system (scene.lights / Light2D pipeline),
// so the whole world is darkened by a single ambient color without per-sprite tinting.
const NightLighting = {
  config: {
    ambientColor: 0x16192c, // cool deep-blue night tint applied to the whole world
    torchColor: 0xffb35c, // warm orange/yellow torch glow
    torchRadius: 220, // main torch falloff radius, in world pixels
    torchIntensity: 2.4, // main torch brightness
    flickerStrength: 0.06, // +/- fraction of radius/intensity the flicker can swing
    flickerSpeed: 0.0045, // how fast the flicker oscillates (radians per ms)
  },

  // Lights2D only runs under the WebGL renderer; Canvas fallback has no pipeline support.
  isWebGL(scene) {
    return scene.sys.game.renderer.type === Phaser.WEBGL;
  },

  init(scene, player) {
    this.scene = scene;
    this.player = player;
    this.enabled = this.isWebGL(scene);

    if (!this.enabled) {
      console.warn("NightLighting: WebGL renderer required, skipping lighting effect.");
      return;
    }

    const cfg = this.config;
    scene.lights.enable().setAmbientColor(cfg.ambientColor);

    [scene.layer1, scene.layer2, scene.layer3, scene.layer4].forEach((layer) => {
      if (layer) layer.setPipeline("Light2D");
    });

    this.torch = scene.lights.addLight(player.x, player.y, cfg.torchRadius, cfg.torchColor, cfg.torchIntensity);
    // this.torchFlare = scene.lights.addLight(
    //   player.x,
    //   player.y,
    //   cfg.torchRadius * cfg.torchFlareRadiusScale,
    //   cfg.torchColor,
    //   cfg.torchIntensity * cfg.torchFlareIntensityScale
    // );

    this.flickerSeed = Math.random() * 1000;
  },

  update(time) {
    if (!this.enabled || !this.torch || !this.player) {
      return;
    }

    const cfg = this.config;
    const flicker =
      Math.sin(time * cfg.flickerSpeed + this.flickerSeed) * cfg.flickerStrength +
      Math.sin(time * cfg.flickerSpeed * 2.6 + this.flickerSeed * 1.7) * cfg.flickerStrength * 0.5;

    const px = this.player.x;
    const py = this.player.y;
    const facing = Phaser.Math.DegToRad(this.player.playerAngle || 0);

    this.torch.x = px;
    this.torch.y = py;
    this.torch.radius = cfg.torchRadius * (1 + flicker);
    this.torch.intensity = cfg.torchIntensity * (1 + flicker * 0.5);
  },
};
