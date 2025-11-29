const Board = require("./domain/boards/Board");
const MenuTerminal = require("./infrastructure/menus/MenuTerminal");
const Menu = require("./infrastructure/menus/MenuTerminal")

let board = new Board(8, 6, 16)
let menu = new MenuTerminal()


board.initializeBoard();

let isPlaying = true;

while (isPlaying) {
  await menu.show()
}