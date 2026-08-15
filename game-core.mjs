export const ROWS = 6
export const COLS = 7
export const PLAYERS = ['rood', 'geel']

export function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

export function findDropRow(board, column) {
  if (!Number.isInteger(column) || column < 0 || column >= COLS) return -1
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (!board[row][column]) return row
  }
  return -1
}

export function placeDisc(board, column, player) {
  if (!PLAYERS.includes(player)) return null
  const row = findDropRow(board, column)
  if (row < 0) return null
  board[row][column] = player
  return { row, column, player }
}

export function hasWinner(board, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLS; column += 1) {
      if (board[row][column] !== player) continue
      for (const [rowStep, columnStep] of directions) {
        let connected = 1
        for (let offset = 1; offset < 4; offset += 1) {
          const nextRow = row + rowStep * offset
          const nextColumn = column + columnStep * offset
          if (
            nextRow < 0 || nextRow >= ROWS ||
            nextColumn < 0 || nextColumn >= COLS ||
            board[nextRow][nextColumn] !== player
          ) {
            break
          }
          connected += 1
        }
        if (connected >= 4) return true
      }
    }
  }
  return false
}

export function isDraw(board) {
  return board.every((row) => row.every(Boolean))
}

export function nextPlayer(player) {
  return player === 'rood' ? 'geel' : 'rood'
}
