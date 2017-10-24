import 'pixi';
import 'p2';
import 'phaser';

import pkg from '../package.json';
import MenuState from "./menu";
import GameState from "./game";

// This is the entry point of your game.

const config = {
  width: 800,
  height: 600,
  renderer: Phaser.AUTO,
  parent: '',
  state: {
    preload,
    create,
  },
  transparent: false,
  antialias: false,
  physicsConfig: { arcade: true },
};

window.onload = () => {

  const game = new Phaser.Game(config);
  console.log(game);
  game.state.add('menu', MenuState);
  game.state.add('play', GameState,false);
  game.state.start('menu');
  
}


function preload() {
  this.game.load.image('study', 'assets/img/dog.png');
}

function create() {

  const { game } = this;
  console.log(game);
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = "#4488AA";
  const objects = [
    game.add.text(game.world.centerX, game.world.centerY * 0.8, `Welcome to Dog-Park`, { font: " 19px inconsolata", fill: "#fff" }),
    game.add.sprite(game.world.centerX, game.world.centerY * 1.2, 'study')
  ];

  objects.forEach(obj => obj.anchor.setTo(0.5, 0.5));
}
