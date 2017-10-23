export default class Dog {
  state = {
    x: 0,
    y: 0,
    Texture: 0
  };

  constructor(x, y, AssetID) {
    this.state.x = x;
    this.state.y = y;
    this.state.Texture = AssetID;
  }

  
}
