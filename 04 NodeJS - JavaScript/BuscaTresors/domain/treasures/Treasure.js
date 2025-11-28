const Position = require('../utils/Position')

class Treasure {

  constructor(name, x, y) {
    this.name = name
    this.position = new Position(x, y)
  }

  positionOverlaps(x, y) {
    return this.position.x === x && this.position.y === y
  }
}

module.exports = Treasure