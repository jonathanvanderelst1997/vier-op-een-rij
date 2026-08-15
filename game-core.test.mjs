import assert from 'node:assert/strict'
import {
  COLS, ROWS, applyMove, createBoard, createGameState, findDropRow,
  hasWinner, isDraw, nextPlayer, placeDisc, resetGameState,
} from './game-core.mjs'

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

assert.equal(hasWinner(boardWith([[5,0,'rood'],[5,1,'rood'],[5,2,'rood'],[5,3,'rood']]), 'rood'), true)
assert.equal(hasWinner(boardWith([[5,2,'geel'],[4,2,'geel'],[3,2,'geel'],[2,2,'geel']]), 'geel'), true)
assert.equal(hasWinner(boardWith([[5,0,'rood'],[4,1,'rood'],[3,2,'rood'],[2,3,'rood']]), 'rood'), true)
assert.equal(hasWinner(boardWith([[2,0,'geel'],[3,1,'geel'],[4,2,'geel'],[5,3,'geel']]), 'geel'), true)

{
  const board = createBoard()
  for (let row = 0; row < ROWS; row += 1) board[row][1] = row % 2 ? 'rood' : 'geel'
  const before = structuredClone(board)
  assert.equal(findDropRow(board, 1), -1)
  assert.equal(placeDisc(board, 1, 'rood'), null)
  assert.deepEqual(board, before, 'rejected full-column move must not mutate board')
}

for (const [column, player] of [[-1,'rood'],[COLS,'geel'],[0,'blauw']]) {
  const board = createBoard()
  const before = structuredClone(board)
  assert.equal(placeDisc(board, column, player), null)
  assert.deepEqual(board, before, 'invalid move must not mutate board')
}

{
  let state = createGameState()
  for (const column of [0,0,1,1,2,2,3]) state = applyMove(state, column).state
  assert.equal(state.gameOver, true)
  assert.equal(state.winner, 'rood')
  const frozen = structuredClone(state)
  const rejected = applyMove(state, 4)
  assert.equal(rejected.reason, 'game_over')
  assert.deepEqual(rejected.state, frozen, 'post-win move must not mutate terminal state')
  assert.deepEqual(resetGameState(), createGameState(), 'reset restores exact initial state')
}

{
  const fullNoWinner = [
    ['rood','rood','rood','geel','geel','rood','rood'],
    ['geel','geel','geel','rood','geel','geel','geel'],
    ['geel','rood','rood','rood','geel','rood','rood'],
    ['rood','rood','geel','rood','rood','geel','geel'],
    ['geel','rood','geel','geel','rood','geel','rood'],
    ['rood','geel','rood','geel','rood','geel','geel'],
  ]
  assert.equal(hasWinner(fullNoWinner, 'rood'), false)
  assert.equal(hasWinner(fullNoWinner, 'geel'), false)
  assert.equal(isDraw(fullNoWinner), true)
  const almost = fullNoWinner.map((row) => [...row])
  almost[0][0] = null
  const result = applyMove({ board: almost, currentPlayer:'rood', gameOver:false, winner:null, draw:false }, 0)
  assert.equal(result.reason, 'draw')
  assert.equal(result.state.gameOver, true)
  assert.equal(result.state.draw, true)
  const frozen = structuredClone(result.state)
  assert.deepEqual(applyMove(result.state, 1).state, frozen, 'post-draw move must not mutate terminal state')
}

assert.equal(nextPlayer('rood'), 'geel')
assert.equal(nextPlayer('geel'), 'rood')
assert.equal(findDropRow(createBoard(), -1), -1)
assert.equal(findDropRow(createBoard(), COLS), -1)

console.log('vier-op-een-rij core tests: ok')
