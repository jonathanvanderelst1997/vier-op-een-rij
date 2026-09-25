import { COLS, ROWS, applyMove, createGameState, findDropRow, resetGameState } from './game-core.mjs'

document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.getElementById('spelbord')
  const columnControls = document.getElementById('kolomknoppen')
  const statusElement = document.getElementById('status')
  const resetButton = document.getElementById('opnieuw')

  let state = createGameState()

  const playerLabel = (player) => player === 'rood' ? 'Rood' : 'Geel'
  const isColumnFull = (column) => findDropRow(state.board, column) < 0
  const setStatus = (message) => { statusElement.textContent = message }

  function renderBoard() {
    boardElement.replaceChildren()
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLS; column += 1) {
        const cell = document.createElement('button')
        const occupant = state.board[row][column]
        cell.type = 'button'
        cell.className = `cel${occupant ? ` ${occupant}` : ''}`
        cell.dataset.column = String(column)
        cell.dataset.row = String(row)
        cell.setAttribute('aria-rowindex', String(row + 1))
        cell.setAttribute('aria-colindex', String(column + 1))
        cell.setAttribute('aria-label', occupant
          ? `Rij ${row + 1}, kolom ${column + 1}: ${playerLabel(occupant)}`
          : `Rij ${row + 1}, kolom ${column + 1}: leeg. Plaats in kolom ${column + 1}`)
        cell.disabled = state.gameOver || isColumnFull(column)
        cell.addEventListener('click', () => handleMove(column))
        boardElement.appendChild(cell)
      }
    }
  }

  function renderColumnControls() {
    columnControls.replaceChildren()
    for (let column = 0; column < COLS; column += 1) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'kolomknop'
      button.textContent = String(column + 1)
      button.dataset.column = String(column)
      button.setAttribute('aria-label', `Plaats schijf in kolom ${column + 1}`)
      button.disabled = state.gameOver || isColumnFull(column)
      button.addEventListener('click', () => handleMove(column))
      columnControls.appendChild(button)
    }
  }

  function refresh(focusColumn = null) {
    renderColumnControls()
    renderBoard()
    if (Number.isInteger(focusColumn) && !state.gameOver) {
      const preferred = columnControls.querySelector(`button[data-column="${focusColumn}"]:not(:disabled)`)
      const fallback = columnControls.querySelector('button:not(:disabled)')
      ;(preferred || fallback)?.focus()
    }
  }

  function handleMove(column) {
    const result = applyMove(state, column)
    if (result.reason === 'game_over') return
    if (result.reason === 'invalid_or_full') {
      setStatus(`Kolom ${column + 1} is vol. ${playerLabel(state.currentPlayer)} is nog aan de beurt.`)
      refresh(column)
      return
    }

    state = result.state
    if (result.reason === 'win') {
      setStatus(`${playerLabel(state.winner)} wint!`)
      refresh()
      resetButton.focus()
      return
    }
    if (result.reason === 'draw') {
      setStatus('Gelijkspel: het bord is vol.')
      refresh()
      resetButton.focus()
      return
    }

    setStatus(`${playerLabel(state.currentPlayer)} is aan de beurt.`)
    refresh(column)
  }

  function resetGame() {
    state = resetGameState()
    setStatus('Rood begint.')
    refresh(0)
  }

  resetButton.addEventListener('click', resetGame)
  setStatus('Rood begint.')
  refresh()
})
