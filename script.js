import { COLS, ROWS, createBoard, findDropRow, hasWinner, isDraw, nextPlayer, placeDisc } from './game-core.mjs'

document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.getElementById('spelbord')
  const columnControls = document.getElementById('kolomknoppen')
  const statusElement = document.getElementById('status')
  const resetButton = document.getElementById('opnieuw')

  let board = createBoard()
  let currentPlayer = 'rood'
  let gameOver = false

  const playerLabel = (player) => player === 'rood' ? 'Rood' : 'Geel'
  const isColumnFull = (column) => findDropRow(board, column) < 0

  function setStatus(message) { statusElement.textContent = message }

  function renderBoard() {
    boardElement.replaceChildren()
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLS; column += 1) {
        const cell = document.createElement('button')
        const occupant = board[row][column]
        cell.type = 'button'
        cell.className = `cel${occupant ? ` ${occupant}` : ''}`
        cell.dataset.column = String(column)
        cell.dataset.row = String(row)
        cell.setAttribute('aria-label', occupant
          ? `Rij ${row + 1}, kolom ${column + 1}: ${playerLabel(occupant)}`
          : `Rij ${row + 1}, kolom ${column + 1}: leeg. Plaats in kolom ${column + 1}`)
        cell.disabled = gameOver || isColumnFull(column)
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
      button.disabled = gameOver || isColumnFull(column)
      button.addEventListener('click', () => handleMove(column))
      columnControls.appendChild(button)
    }
  }

  function refresh(focusColumn = null) {
    renderColumnControls()
    renderBoard()
    if (Number.isInteger(focusColumn) && !gameOver) {
      const preferred = columnControls.querySelector(`button[data-column="${focusColumn}"]:not(:disabled)`)
      const fallback = columnControls.querySelector('button:not(:disabled)')
      ;(preferred || fallback)?.focus()
    }
  }

  function handleMove(column) {
    if (gameOver) return
    const move = placeDisc(board, column, currentPlayer)
    if (!move) {
      setStatus(`Kolom ${column + 1} is vol. ${playerLabel(currentPlayer)} is nog aan de beurt.`)
      refresh(column)
      return
    }

    if (hasWinner(board, currentPlayer)) {
      gameOver = true
      setStatus(`${playerLabel(currentPlayer)} wint!`)
      refresh()
      resetButton.focus()
      return
    }
    if (isDraw(board)) {
      gameOver = true
      setStatus('Gelijkspel: het bord is vol.')
      refresh()
      resetButton.focus()
      return
    }

    currentPlayer = nextPlayer(currentPlayer)
    setStatus(`${playerLabel(currentPlayer)} is aan de beurt.`)
    refresh(column)
  }

  function resetGame() {
    board = createBoard()
    currentPlayer = 'rood'
    gameOver = false
    setStatus('Rood begint.')
    refresh(0)
  }

  resetButton.addEventListener('click', resetGame)
  setStatus('Rood begint.')
  refresh()
})
