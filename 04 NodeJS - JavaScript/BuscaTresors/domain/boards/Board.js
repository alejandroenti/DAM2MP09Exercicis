const Treasure = require('../treasures/Treasure')

class Board {

  constructor(width, height, numTreasures) {
    this.width = width
    this.height = height
    this.numTreasures = numTreasures
    this.treasures = new Array()
  }

  initializeBoard() {
    this.generateTreasures()
  }

  generateTreasures() {
    let completed = false
    let treasureCount = 0

    while (!completed) {
      let positionEmpty = true
      let x = Math.floor(Math.random() * this.width)
      let y = Math.floor(Math.random() * this.height)

      for (let treasure of this.treasures) {
        if(treasure.positionOverlaps(x, y)) {
          positionEmpty = false
          break;
        }
      }

      if (positionEmpty) {
        this.treasures.push(new Treasure(`Prova ${treasureCount}`, x, y))
        treasureCount += 1
        completed = treasureCount === this.numTreasures
      }

    }
  }

  printBoard() {}
}

module.exports = Board