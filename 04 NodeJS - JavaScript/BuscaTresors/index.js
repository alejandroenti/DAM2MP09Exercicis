const Board = require("./domain/boards/Board");
const MenuTerminal = require("./infrastructure/menus/MenuTerminal");


let board = new Board(8, 6, 16)
let menu = new MenuTerminal(board)

board.initializeBoard()
board.printBoard()

async function play() {
  let isPlaying = true

  while (isPlaying) {
    isPlaying = await menu.show()
  }
  
  menu.displayMessage("Partida acabada. Torna a executar per jugar de nou.")
}


play()