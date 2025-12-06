const Command = require("../../domain/comands/Command")
const InputProcessor = require("../../domain/utils/InputProcessor")

class CommandDestapar extends Command {

    constructor(board) {
        super()
        this.board = board
    }

    execute(menuTerminal, args) {
        if (args.length === 0) {
            menuTerminal.displayWarningMessage("Falta la coordenada. Ús: destapar B3")
            return
        }

        const coord = InputProcessor.parseCoordinate(args[0])
        if (!coord) {
            menuTerminal.displayErrorMessage("Coordenada invàlida. La coordenada ha de ser del tipus L# (Ex: A0 o F7).")
            return
        }

        const { x, y } = coord
        
        const wasTreasure = this.board.uncover(x, y)
        this.board.printBoard()

        if (wasTreasure) {
            menuTerminal.displayMessage(`💰 Tresor trobat a ${args[0]}! Puntuació: ${this.board.score}/${this.board.numTreasures}.`)
        } else {
            const distance = this.board.getClosestTreasureDistance(x, y).toFixed(2)
            menuTerminal.displayMessage(`Casella buida a ${args[0]}. Tirades restants: ${this.board.remainingTries}.`)
            menuTerminal.displayMessage(`El tresor més proper és a una distància de ${distance}.`)
        }
    }
}

module.exports = CommandDestapar