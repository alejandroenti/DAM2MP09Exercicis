const Command = require("../../domain/comands/Command")

class CommandAjuda extends Command {

    execute(menuTerminal) {
        menuTerminal.displayMessage(
            "Llista de comandes:\n" +
            " - ajuda|help - Mostra aquest menú\n" +
            " - carregar partida 'nom_arxiu.json' - carrega una partida guardada (NO IMPLEMENTAT)\n" +
            " - guardar partida 'nom_guardar.json' - guardar una partida amb el nom indicat (NO IMPLEMENTAT)\n" + 
            " - activar trampes / desactivar trampes - es mostra/amaga un segon tauler amb les caselles destapades\n" +
            " - destapar L#, per exemple 'destapar B3' - desmarca la casella indica a la coordenada (Lletra/Fila, Número/Columna), i indica la distància a la que es troba el tresor més proper\n" +
            " - puntuacio - mostra la puntuació actual (tresors aconseguits) i les tirades restants\n" +
            " - sortir - finalitza la partida i surt del programa\n\n"
        )
    }
}

module.exports = CommandAjuda