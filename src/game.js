import "pixi";
import "p2";
import "phaser";
import pkg from "../package.json";

export default class GameState {
  platforms;
  player;
  cursors;
  preload() {
    const { game } = this;
    game.load.image("ground", "assets/img/ground.png");
    game.load.spritesheet("dog", "assets/img/dog.png", 32, 32);

    this.cursors = game.input.keyboard.createCursorKeys();
  }

  create() {
    const { game } = this;

    game.stage.backgroundColor = "#4488AA";
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    let _platforms = [
      this.platforms.create(400, 350, "ground"),
      this.platforms.create(-150, 250, "ground")
    ];

    // Here we create the ground.
    var ground = this.platforms.create(0, game.world.height - 64, "ground");

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(280, 64);

    _platforms.forEach(obj => {
      obj.body.immovable = true;
      obj.scale.setTo(128, 32);
    });

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    // The player and its settings
    this.player = game.add.sprite(32, game.world.height - 150, "dog");

    //  We need to enable physics on the player
    game.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
    this.player.scale.setTo(2, 2);
    //  Our two animations, walking left and right.
    this.player.animations.add("left", [12, 13, 14, 15], 10, true);
    this.player.animations.add("right", [4, 5, 6, 7], 10, true);
    //  Reset the players velocity (movement)
    // const { player } = this;
  }
  update() {
    let { platforms, player } = this;
    var hitPlatform = this.game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      //  Move to the left
      player.body.velocity.x = -150;

      player.animations.play("left");
    } else if (this.cursors.right.isDown) {
      //  Move to the right
      player.body.velocity.x = 150;

      player.animations.play("right");
    } else {
      //  Stand still
      player.animations.stop();

      player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown && player.body.touching.down && hitPlatform) {
      player.body.velocity.y = -350;
    }
  }
  start() {
    const { game } = this;
    game.state.start("play");
  }
}
