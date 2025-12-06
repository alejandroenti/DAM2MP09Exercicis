const Treasure = require('../treasures/Treasure')
const Position = require('../utils/Position')

class Board {

  constructor(width, height, numTreasures) {
    this.width = width
    this.height = height
    this.numTreasures = numTreasures
    this.treasures = new Array()
    this.uncoveredCells = new Map()
    this.score = 0
    this.maxTries = 32
    this.remainingTries = this.maxTries
    this.cheatsActive = false
  }

  // Mètode per crear una Board a partir d'un objecte JSON
  static fromJson(json) {
      const board = new Board(json.width, json.height, json.numTreasures)
      board.score = json.score
      board.remainingTries = json.remainingTries
      board.cheatsActive = json.cheatsActive
      
      // Recrear Tresors
      board.treasures = json.treasures.map(t => new Treasure(t.name, t.position.x, t.position.y))
      
      // Recrear Map de caselles no destapades
      board.uncoveredCells = new Map(json.uncoveredCells)
      
      return board
  }

  // Mètode per convertir la Board a un objecte JSON (serialització)
  toJson() {
      // JSON.stringify no serialitza Maps, així que el convertim a Array d'Arrays
      const uncoveredCellsArray = Array.from(this.uncoveredCells.entries())
      
      return {
          width: this.width,
          height: this.height,
          numTreasures: this.numTreasures,
          score: this.score,
          maxTries: this.maxTries,
          remainingTries: this.remainingTries,
          cheatsActive: this.cheatsActive,
          treasures: this.treasures,
          uncoveredCells: uncoveredCellsArray
      }
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
          break
        }
      }

      if (positionEmpty) {
        this.treasures.push(new Treasure(`Tresor ${treasureCount + 1}`, x, y))
        treasureCount += 1
        completed = treasureCount === this.numTreasures
      }
    }
  }

  isTreasureAt(x, y) {
    return this.treasures.some(t => t.positionOverlaps(x, y))
  }

  uncover(x, y) {
    const key = `${x},${y}`
    if (this.uncoveredCells.has(key)) {
      return this.uncoveredCells.get(key)
    }
    
    const foundTreasure = this.isTreasureAt(x, y)
    this.uncoveredCells.set(key, foundTreasure)

    if (foundTreasure) {
      this.score += 1
    } else {
      this.remainingTries -= 1
    }

    return foundTreasure
  }

  getClosestTreasureDistance(x, y) {
    let minDistance = Infinity
    const currentPos = new Position(x, y)

    if (this.treasures.length === 0) return 0 

    for (const treasure of this.treasures) {
      const distance = currentPos.distanceTo(treasure.position)
      if (distance < minDistance) {
        minDistance = distance
      }
    }

    return minDistance
  }

  hasWon() {
    return this.score === this.numTreasures
  }

  hasLost() {
    return this.remainingTries <= 0 && !this.hasWon()
  }

  toggleCheats() {
    this.cheatsActive = !this.cheatsActive
    return this.cheatsActive
  }

  getCharFor(x, y, isCheatBoard) {
    const key = `${x},${y}`
    const isUncovered = this.uncoveredCells.has(key)
    const hasTreasure = this.isTreasureAt(x, y)

    if (isCheatBoard) {
      return hasTreasure ? 'T' : (isUncovered ? '·' : ' ')
    }

    if (isUncovered) {
      return hasTreasure ? 'G' : '·' 
    }
    
    return 'X' 
  }

  printBoard() {
    const letterLabels = 'ABCDEF'
    const numberLabels = '01234567'

    let boardOutput = "  " + numberLabels + (this.cheatsActive ? "      " + numberLabels : "") + "\n"

    for (let y = 0; y < this.height; y++) {
      let row = letterLabels[y] + " "
      let cheatRow = " "
      
      for (let x = 0; x < this.width; x++) {
        row += this.getCharFor(x, y, false)
        if (this.cheatsActive) {
           cheatRow += this.getCharFor(x, y, true)
        }
      }

      boardOutput += row + (this.cheatsActive ? ("    " + letterLabels[y] + cheatRow) : "") + "\n"
    }

    console.log(boardOutput)
  }
}

module.exports = Board