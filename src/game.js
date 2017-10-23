import 'pixi';
import 'p2';
import 'phaser';
import pkg from '../package.json';


export default class GameState {
    
    create() {
        const {game} = this;
        let l_name = game.add.text(80, 80, "switched to game screen", { font: '50px inconsolata', fill: "#ffffff" })

        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wkey.onDown.addOnce(this.start, this);
    }
    start() {
        const {game} = this;
        game.state.start('play');
    }
}