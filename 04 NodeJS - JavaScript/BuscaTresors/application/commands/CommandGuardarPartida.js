const Command = require("../../domain/comands/Command")
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(process.cwd(), 'data')

class CommandGuardarPartida extends Command {

    constructor(board) {
        super()
        this.board = board
    }

    execute(menuTerminal, args) {
        if (args.length === 0) {
            menuTerminal.displayWarningMessage("Falta el nom de l'arxiu. Ús: guardar partida 'nom_arxiu.json'")
            return
        }

        let fileName = args[0]
        if (!fileName.toLowerCase().endsWith('.json')) {
            fileName += '.json'
        }

        // Crear el directori 'data' si no existeix
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true })
        }

        const filePath = path.join(DATA_DIR, fileName)
        
        try {
            const dataToSave = this.board.toJson()
            const jsonString = JSON.stringify(dataToSave, null, 2)
            
            fs.writeFileSync(filePath, jsonString)
            
            menuTerminal.displayMessage(`💾 Partida guardada amb èxit a: ${filePath}`)
        } catch (error) {
            menuTerminal.displayErrorMessage(`❌ Error al guardar la partida: ${error.message}`)
        }
    }
}

module.exports = CommandGuardarPartida