'use strict'

var gBoard
var gLevel
var gameIsON

const FLAG = '🚩'
const MINE = '💣'
const BLAST = '💥'
const EMPTY = ''

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    timeElapsed: null,
}

onInit()

// Called when page loads
function onInit() {
    gBoard = buildBoard(4)
    console.log(gBoard)

    gGame.isOn = true
    renderBoard(gBoard)
}

// Builds the board
// Set some mines Call setMinesNegsCount()
// Return the created board
function buildBoard(size) {
    // later change size???  to accept user input
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAround: null,
                isMine: false,
                isRevealed: false,
                isMarked: false,
                isBlast: false,
            }

            if ((i === 1 && j === 1) || (i === 2 && j === 3)) {
                // don't forget to remove
                board[i][j].isMine = true
            }
        }
    }

    return board
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            var currCell = gBoard[i][j]
            // var icon = emojiToDisplay(currCell)

            strHTML += `<td class="cell cell-${i}-${j}" onclick="onCellClicked(this, ${i}, ${j})"></td>`
        }

        strHTML += `</tr>`

        const elContainer = document.querySelector('.board')
        elContainer.innerHTML = strHTML
    }
}

function emojiToDisplay(cell) {
    const toDisplay = ''

    // if (cell.isRevealed === false) {
    // }

    if (gGame.isOn === true) return EMPTY

    if (cell.isMine === true) {
        return MINE
    } else return EMPTY

    //    if (cell.isMine === true) {
    //     return MINE
    // }
    // if (cell.isMarked === true) {
    //     if (cell.isRevealed === true) {
    //     }
    // }
}

// Count mines around each cell and
// set the cell's minesAroundCount

function setMinesAndCountNeighbors(firstI, firstJ) {
    // TODO -> get random indexis to set mines
    // don't forget to not put a mine on first cell
    console.log('hi')
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].minesAround = getNeighborMines(i, j)
        }
    }
}

// Called when a cell is clicked

function getNeighborMines(rowIdx, colIdx) {
    var neighborMines = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (
                i < 0 ||
                i >= gBoard.length ||
                j < 0 ||
                j >= gBoard[0].length ||
                (i === rowIdx && j === colIdx)
            )
                continue

            if (gBoard[i][j].isMine) neighborMines++
        }
    }

    return neighborMines
}

function onCellClicked(elCell, i, j) {
    console.log(elCell)
    if (gGame.revealedCount === 0) {
        setMinesAndCountNeighbors(i, j)

        // first click, set mines
    }

    const currCell = gBoard[i][j]
    console.log(currCell)

    if (currCell.isRevealed) return

    currCell.isRevealed = true
    gGame.revealedCount++
    elCell.classList.add('revealed')

    if (!currCell.isMine) {
        if (currCell.minesAround > 0) {
            elCell.innerText = `${currCell.minesAround}`
            return
        }
    } else {
        gameLost()
        elCell.innerText = `${BLAST}`
    }
    console.log(elCell)
}

function gameLost() {
    console.log('lost')
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            renderCellonLoss(elCell, cell)
        }
    }

    var gameOver = document.querySelector('.reset-area')
    gameOver.classList.remove('hidden')
}

function resetGame() {
    onInit()
    var gameOver = document.querySelector('.reset-area')
    gameOver.classList.add('hidden')

    gGame = {
        isOn: false,
        revealedCount: 0,
        markedCount: 0,
        timeElapsed: null,
    }
}

function renderCellonLoss(elCell, cell) {
    var emoji = ''

    if (cell.isMine) {
        emoji = MINE
    } else if (cell.minesAround > 0) {
        emoji = `${cell.minesAround}`
    }

    elCell.innerText = emoji
    elCell.classList.add('revealed')
}

// Called when a cell is right- clicked
// See how you can hide the context menu on right click
function onCellMarked(elCell, i, j) {}

// The game ends when all mines are marked,
// and all the other cells are revealed
function checkGameOver() {}

//  i, j) When the user clicks a cell with no mines around,
// reveal not only that cell, but also its neighbors.
function expandReveal(board, elCell, i, j) {}
