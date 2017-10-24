import "pixi";
import "p2";
import "phaser";
import pkg from "../package.json";

export default class GameState {
  platforms;
  player;
  cursors;
  socket;
  game;
  dogs = {};
  preload() {
    let port = 3000;
    this.socket = io.connect(`localhost:${port}`);
    let data = {
      x: 100,
      y: 200,
      texture: "dog"
    };
    this.socket.on("dogMoved", this.moveDog);
    this.socket.on("dogJoined", this.dogConnected);
    this.socket.on("sitDog", this.sitDog);
    this.socket.emit("connected", data);
   
    const { game } = this;
    this.game = game;
    game.load.image("ground", "assets/img/ground.png");
    game.load.spritesheet("dog", "assets/img/dog.png", 32, 32);

    this.cursors = game.input.keyboard.createCursorKeys();
  }

  sitDog = (data)=> {
    this.dogs[data.id].x = data.x;
    this.dogs[data.id].x = data.x;
    this.dogs[data.id].animations.play("sit");
  }

  dogConnected=(data)=> {
      const {game} = this;
    console.log(data)
    this.dogs[data.id] = this.game.add.sprite(data.x, data.y, data.texture);
    this.dogs[data.id].scale.setTo(2, 2);
    this.dogs[data.id].animations.add("left", [12, 13, 14, 15], 10, true);
    this.dogs[data.id].animations.add("right", [4, 5, 6, 7], 10, true);
    this.dogs[data.id].animations.add("sit", [24, 25, 26], 10, true);
  }

  moveDog=(data)=> {
    this.dogs[data.id].x = data.x;
    this.dogs[data.id].y = data.y;
    this.dogs[data.id].animations.play(data.anim);
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

    this.player.animations.add("sit", [24, 25, 26], 10, true);
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
      let data = {
        x: player.body.x,
        y: player.body.y,
        anim: "left"
      };
      this.stayed = false;
      this.socket.emit("move", data);
    } else if (this.cursors.right.isDown) {
      //  Move to the right
      player.body.velocity.x = 150;

      player.animations.play("right");
      let data = {
        x: player.body.x,
        y: player.body.y,
        anim: "right"
      };
      this.stayed = false;
      this.socket.emit("move", data);
    } else {
      //  Stand still
      player.animations.play("sit");
      if (!this.stayed) {
        let data = {
          x: player.body.x,
          y: player.body.y,
          anim:"sit"
        };
        this.socket.emit("stay", data);
        this.stayed = true;
      }
    }

    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown && player.body.touching.down && hitPlatform) {
      player.body.velocity.y = -350;
    }
  }

  stayed = false;

  start() {
    const { game } = this;
    game.state.start("play");
  }
}
