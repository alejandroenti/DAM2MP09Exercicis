const Command = require("../../domain/comands/Command")

class CommandTrampes extends Command {
    
    constructor(board, action) {
        super()
        this.board = board
        this.action = action
    }

    execute(menuTerminal) {
        let newState = null

        if (this.action === 'activar') {
            newState = true
        } else if (this.action === 'desactivar') {
            newState = false
        } else {
            menuTerminal.displayErrorMessage("Error de configuració: Acció de trampes desconeguda.")
            return
        }
        
        this.board.cheatsActive = newState
        const status = newState ? "ACTIVADES" : "DESACTIVADES"
        menuTerminal.displayMessage(`Mode trampes ${status}.`)
        this.board.printBoard()
    }
}

module.exports = CommandTrampes