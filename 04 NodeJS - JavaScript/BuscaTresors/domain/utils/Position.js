class Position {
    
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  // Calcula la distància mitjançant el teorema de Pitàgoras (hipotenusa)
  distanceTo(position) {
    const dx = this.x - position.x
    const dy = this.y - position.y
    return Math.sqrt(dx * dx + dy * dy)
  }
}

module.exports = Position