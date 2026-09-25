import assert from 'node:assert/strict'
import { createBoard, hasWinner, isDraw, nextPlayer, placeDisc } from './game-core.mjs'

function replay(sequence) {
  const board = createBoard()
  let player = 'rood'
  let winner = null
  for (const column of sequence) {
    const move = placeDisc(board, column, player)
    assert(move, `sequence attempted invalid move in column ${column}`)
    if (hasWinner(board, player)) {
      winner = player
      break
    }
    player = nextPlayer(player)
  }
  return { board, winner, next: player, draw: isDraw(board) }
}

const fixtures = [
  { name: 'horizontal red', sequence: [0, 6, 1, 6, 2, 5, 3], winner: 'rood' },
  { name: 'vertical red', sequence: [0, 1, 0, 1, 0, 2, 0], winner: 'rood' },
  { name: 'diagonal red', sequence: [0, 1, 1, 2, 4, 2, 2, 3, 4, 3, 5, 3, 3], winner: 'rood' },
]

for (const fixture of fixtures) {
  const result = replay(fixture.sequence)
  assert.equal(result.winner, fixture.winner, fixture.name)
}

{
  const board = createBoard()
  let player = 'rood'
  for (let index = 0; index < 6; index += 1) {
    assert(placeDisc(board, 0, player))
    player = nextPlayer(player)
  }
  const snapshot = JSON.stringify(board)
  assert.equal(placeDisc(board, 0, player), null)
  assert.equal(JSON.stringify(board), snapshot, 'full-column rejection must not mutate board')
}

{
  const drawSequence = [1,0,6,4,1,6,4,4,5,3,3,2,5,6,1,6,6,6,4,0,5,1,4,0,0,5,3,3,5,5,0,2,4,3,2,1,0,3,1,2,2,2]
  const result = replay(drawSequence)
  assert.equal(result.winner, null, 'draw replay must not contain an earlier winner')
  assert.equal(result.draw, true, 'draw replay must fill the board without a winner')
}

console.log('vier-op-een-rij deterministic replay fixtures: ok')
