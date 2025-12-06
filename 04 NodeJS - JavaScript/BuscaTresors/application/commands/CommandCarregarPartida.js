const Command = require("../../domain/comands/Command")
const Board = require('../../domain/boards/Board')
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(process.cwd(), 'data')

class CommandCarregarPartida extends Command {

    constructor(board) {
        super()
        this.board = board
    }

    // El MenuTerminal rep el nou tauler i l'assigna al joc
    execute(menuTerminal, args) {
        if (args.length === 0) {
            menuTerminal.displayWarningMessage("Falta el nom de l'arxiu. Ús: carregar partida 'nom_arxiu.json'")
            return null
        }

        let fileName = args[0]
        if (!fileName.toLowerCase().endsWith('.json')) {
            fileName += '.json'
        }

        const filePath = path.join(DATA_DIR, fileName)
        
        if (!fs.existsSync(filePath)) {
            menuTerminal.displayErrorMessage(`Arxiu de partida no trobat: ${filePath}`)
            return null
        }
        
        try {
            const jsonString = fs.readFileSync(filePath, 'utf8')
            const json = JSON.parse(jsonString)
            
            // Crear una nova instància de Board a partir de les dades
            const newBoard = Board.fromJson(json)
            menuTerminal.board = newBoard 
            menuTerminal.displayMessage(`Partida carregada amb èxit des de: ${filePath}`)
            menuTerminal.board.printBoard()
            return newBoard 

        } catch (error) {
            menuTerminal.displayErrorMessage(`Error al carregar la partida: ${error.message}`)
            return null
        }
    }
}

module.exports = CommandCarregarPartida