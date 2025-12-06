const Command = require("../../domain/comands/Command")

class CommandSalir extends Command {

    execute(menuTerminal) {
        menuTerminal.displayMessage("\n👋 Sortint de la partida. Fins aviat!")
        
        // Tanquem la lectura de la terminal
        menuTerminal.rl.close() 
        
        return 'EXIT' 
    }
}

module.exports = CommandSalir