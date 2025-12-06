const Command = require("../../domain/comands/Command")

class CommandPuntuacio extends Command {
    
    constructor(board) {
        super()
        this.board = board
    }

    execute(menuTerminal) {
        const tresorsTrobats = this.board.score 
        const totalTresors = this.board.numTreasures
        const tiradesRestants = this.board.remainingTries
        const tiradesMaximes = this.board.maxTries
        const tiradesUsades = tiradesMaximes - tiradesRestants

        menuTerminal.displayMessage(
            `\n🧭 Puntuació i Estat de la Partida:\n` +
            ` - Tresors trobats: ${tresorsTrobats} / ${totalTresors}\n` +
            ` - Tirades restants: ${tiradesRestants} (Total: ${tiradesMaximes})\n` +
            ` - Tirades usades (sense trobar tresor): ${tiradesUsades}\n`
        )
    }
}

module.exports = CommandPuntuacio