class InputProcessor {
  static parseInputOption(input) {
    // Neteja de la string introduïda:
    //  1. Netegem els espais en blanc a l'inici i final de la string
    //  2. Passem a minúscules els caràcters
    //  3. Separem per paraules la comanda
    const parts = input.trim().toLowerCase().split(/\s+/)
    
    // Gestió comandes de dues paraules
    if (parts.length >= 2 && (parts[0] === 'carregar' || parts[0] === 'guardar' || parts[0] === 'activar' || parts[0] === 'desactivar') && parts[1] === 'partida') {
        const fullCommand = parts.slice(0, 2).join(' ')
        const args = parts.slice(2)
        return [fullCommand, ...args]
    }
    if (parts.length >= 2 && (parts[0] === 'activar' || parts[0] === 'desactivar') && parts[1] === 'trampes') {
        const fullCommand = parts.slice(0, 2).join(' ')
        const args = parts.slice(2)
        return [fullCommand, ...args]
    }

    return parts
  }

  static parseCoordinate(coord) {
      if (!coord || coord.length < 2) return null
      
      // Coordenada: Lletra (A-F) i Número (0-7). Ex: B3
      const yChar = coord[0].toUpperCase()
      const xChar = coord.substring(1)
      
      const x = parseInt(xChar, 10)
      const y = yChar.charCodeAt(0) - 'A'.charCodeAt(0)

      if (isNaN(x) || x < 0 || x > 7 || isNaN(y) || y < 0 || y > 5) {
          return null
      }

      return { x, y }
  }
}

module.exports = InputProcessor