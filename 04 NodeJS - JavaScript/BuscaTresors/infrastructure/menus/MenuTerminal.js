const readline = require("readline").promises
const inputProcessor = require("../../domain/utils/InputProcessor")
const CommandAjuda = require("../../application/commands/CommandAjuda")
const CommandDestapar = require("../../application/commands/CommandDestapar")
const CommandPuntuacio = require("../../application/commands/CommandPuntuacio")
const CommandTrampes = require("../../application/commands/CommandTrampes")
const CommandGuardarPartida = require("../../application/commands/CommandGuardarPartida")
const CommandCarregarPartida = require("../../application/commands/CommandCarregarPartida")
// Nou comando
const CommandSortir = require("../../application/commands/CommandSortir") 

class MenuTerminal {
    
    constructor(board) {
        this.board = board
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        this.commands = {
            "ajuda": new CommandAjuda(),
            "help": new CommandAjuda(),
            "puntuacio": new CommandPuntuacio(this.board),
            "destapar": new CommandDestapar(this.board),
            "activar trampes": new CommandTrampes(this.board, 'activar'), 
            "desactivar trampes": new CommandTrampes(this.board, 'desactivar'),
            "guardar partida": new CommandGuardarPartida(this.board),
            "carregar partida": new CommandCarregarPartida(this.board),
            "sortir": new CommandSortir() 
        }
    }

    async show() {
        // Tractament si hem guanyat o perdut la partida
        if (this.board.hasWon()) {
            const tiradesUsades = this.board.maxTries - this.board.remainingTries
            this.displayMessage(`\n🏆 Has guanyat amb només ${tiradesUsades} tirades! Tots els ${this.board.numTreasures} tresors trobats.`)
            this.rl.close();
            return false;
        }

        if (this.board.hasLost()) {
            const tresorsRestants = this.board.numTreasures - this.board.score
            this.displayMessage(`\n😭 Has perdut, queden ${tresorsRestants} tresors! Has esgotat les tirades.`)
            this.rl.close();
            return false;
        }

        const string = await this.rl.question("Escriu una comanda: ")
        const commandText = string.trim().toLowerCase()
        
        let command = null
        let args = []
        let commandName = ''
        
        // Revisar comandes amb dos arguments
        if (commandText.includes(' ')) {
            const parts = commandText.split(/\s+/)
            const potentialTwoWord = parts.slice(0, 2).join(' ')
            if (this.commands[potentialTwoWord]) {
                command = this.commands[potentialTwoWord]
                commandName = potentialTwoWord
                args = parts.slice(2)
            }
        }

        // Revisar comandes amb un argument
        if (!command) {
            const parts = commandText.split(/\s+/)
            commandName = parts[0]
            command = this.commands[commandName]
            args = parts.slice(1)
        }
        
        if (command) {
            try {
                const result = command.execute(this, args) 
                
                // Comanda sortir executada
                if (result === 'EXIT') {
                    return false // Atura el bucle de joc a index.js
                }

                if (commandName === 'carregar partida' && result) {
                    // Carreguem partida i actualitzem el taulell de la partida
                    this.board = result 
                    
                    // Actualitzem les referències del tauler a la resta de comandes
                    for (const key in this.commands) {
                        if (this.commands[key].board) {
                            this.commands[key].board = result
                        }
                    }
                }

            } catch (error) {
                this.displayErrorMessage(`Error en executar la comanda: ${error.message}`)
            }
        } else {
            this.displayWarningMessage(`Comanda desconeguda: ${commandText}. Escriu 'ajuda' per veure la llista.`)
        }
        
        return true
    }

    displayMessage(message) {
        console.log(`✅ ${message}`)
    }

    displayWarningMessage(message) {
        console.warn(`⚠️ ${message}`)
    }

    displayErrorMessage(message) {
        console.error(`🛑 ${message}`)
    }
}

module.exports = MenuTerminal