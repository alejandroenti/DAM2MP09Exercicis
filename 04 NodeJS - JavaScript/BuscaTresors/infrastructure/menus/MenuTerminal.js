const readline = require("readline").promises
const inputProcessor = require("../../domain/utils/InputProcessor")

class MenuTerminal {
    
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    async show() {
        const string = await rl.question("Nom de l'arxiu a generar? ")
        const command = inputProcessor.parseInputOption(string)
        this.displayMessage(command)
    }

    displayMessage(message) {
        console.log(message)
    }

    displayWarningMessage(message) {
        console.warn(message)
    }

    displayErrorMessage(message) {
        console.error(message)
    }
}

module.exports = MenuTerminal