const Board = require('./domain/boards/Board')

let board = new Board(8, 6, 16)
board.initializeBoard()

let isPlaying = true



for (let i = 0; i < 16; i++) {
  console.log(board.treasures.at(i))
}