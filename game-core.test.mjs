import assert from 'node:assert/strict'
import { COLS, ROWS, createBoard, findDropRow, hasWinner, isDraw, nextPlayer, placeDisc } from './game-core.mjs'

function boardWith(cells) {
  const board = createBoard()
  for (const [row, column, player] of cells) board[row][column] = player
  return board
}

{
  const board = createBoard()
  assert.equal(board.length, ROWS)
  assert.equal(board[0].length, COLS)
  assert.deepEqual(placeDisc(board, 0, 'rood'), { row: 5, column: 0, player: 'rood' })
  assert.deepEqual(placeDisc(board, 0, 'geel'), { row: 4, column: 0, player: 'geel' })
}

{
  const board = boardWith([[5, 0, 'rood'], [5, 1, 'rood'], [5, 2, 'rood'], [5, 3, 'rood']])
  assert.equal(hasWinner(board, 'rood'), true, 'horizontal win')
}
{
  const board = boardWith([[5, 2, 'geel'], [4, 2, 'geel'], [3, 2, 'geel'], [2, 2, 'geel']])
  assert.equal(hasWinner(board, 'geel'), true, 'vertical win')
}
{
  const board = boardWith([[5, 0, 'rood'], [4, 1, 'rood'], [3, 2, 'rood'], [2, 3, 'rood']])
  assert.equal(hasWinner(board, 'rood'), true, 'descending diagonal win')
}
{
  const board = boardWith([[2, 0, 'geel'], [3, 1, 'geel'], [4, 2, 'geel'], [5, 3, 'geel']])
  assert.equal(hasWinner(board, 'geel'), true, 'ascending diagonal win')
}

{
  const board = createBoard()
  for (let row = 0; row < ROWS; row += 1) board[row][1] = row % 2 ? 'rood' : 'geel'
  const before = structuredClone(board)
  assert.equal(findDropRow(board, 1), -1)
  assert.equal(placeDisc(board, 1, 'rood'), null, 'full column rejects move')
  assert.deepEqual(board, before, 'rejected full-column move must not mutate board')
}

for (const [column, player] of [[-1, 'rood'], [COLS, 'geel'], [0, 'blauw']]) {
  const board = createBoard()
  const before = structuredClone(board)
  assert.equal(placeDisc(board, column, player), null, `invalid move rejected: ${column}/${player}`)
  assert.deepEqual(board, before, 'invalid move must not mutate board')
}

{
  const board = Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, column) => ((row + column) % 2 ? 'rood' : 'geel')),
  )
  assert.equal(isDraw(board), true)
}

assert.equal(nextPlayer('rood'), 'geel')
assert.equal(nextPlayer('geel'), 'rood')
assert.equal(findDropRow(createBoard(), -1), -1)
assert.equal(findDropRow(createBoard(), COLS), -1)

console.log('vier-op-een-rij core tests: ok')
