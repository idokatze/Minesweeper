'use strict'

var gBoard
var gameIsON

const FLAG = '🚩'
const MINE = '💣'
const BLAST = '💥'
const EMPTY = ''

const gGame = {
    isOn: false,
    revealedCount: 0,
    totalMines: 2,
    markedCount: 0,
    timeElapsed: null,
}

const gLevel = {
    beginner: { length: 4, mines: 2 },
    intermediate: { length: 8, mines: 14 },
    expert: { length: 12, mines: 32 },
}

onInit()

// Called when page loads
function onInit(length = 4, mines = 2) {
    gBoard = buildBoard(length)
    gGame.isOn = true
    gGame.totalMines = mines
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
            strHTML += `<td class="cell cell-${i}-${j}"><div class="cover" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onFlag(event, this, ${i}, ${j})"></div><div class="content"></div></td>`
        }

        strHTML += `</tr>`

        const elContainer = document.querySelector('.board')
        elContainer.innerHTML = strHTML
    }
}

// Count mines around each cell and
// set the cell's minesAroundCount

function setMinesAndCountNeighbors(firstI, first) {
    var numOfMines = gGame.totalMines

    // ------ Random Mines ------

    // var minesToLay = level.mines
    // var length = level.length
    // console.log(minesToLay)

    // for (var i = 0; i < minesToLay; i++) {
    //     while (true) {
    //         var randomRowIdx = getRandomInt(0, level.length)
    //         var randomColIdx = getRandomInt(0, level.length)
    //         var currCell = gBoard[randomRowIdx][randomColIdx]
    //         if (
    //             (randomRowIdx !== firstI || randomColIdx !== firstJ) &&
    //             !currCell.isMine
    //         ) {
    //             currCell.isMine = true
    //             console.log(currCell)
    //             break
    //         }
    //     }
    // }

    gBoard[1][2].isMine = true
    gBoard[2][3].isMine = true

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
    // console.log(elCell)
    const currCell = gBoard[i][j]
    if (currCell.isRevealed || currCell.isMarked) return

    if (gGame.revealedCount === 0) {
        setMinesAndCountNeighbors(i, j)

        // first click, set mines
    }

    // console.log(currCell)

    currCell.isRevealed = true
    gGame.revealedCount++
    elCell.classList.add('revealed')

    if (currCell.minesAround === 0) {
        expandReveal(i, j)
    }
    checkGameOver()

    if (!currCell.isMine) {
        if (currCell.minesAround > 0) {
            elCell.innerText = `${currCell.minesAround}`
            return
        }
    } else {
        gameLost()
        elCell.innerText = `${BLAST}`
    }
}

function onFlag(ev, elCell, i, j) {
    ev.preventDefault()
    console.log(elCell)
    const cell = gBoard[i][j]

    if (!cell.isMarked) {
        cell.isMarked = true
        gGame.markedCount++
        elCell.innerText = FLAG
    } else {
        cell.isMarked = false
        gGame.markedCount--
        elCell.innerText = EMPTY
    }

    checkGameOver()
}

function gameLost() {
    console.log('lost')
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            renderMinesOnLoss(elCell, cell)
        }
    }

    var gameOver = document.querySelector('.reset-area')
    gameOver.classList.remove('hidden')
}

function resetGame() {
    onInit()
    var gameOver = document.querySelector('.reset-area')
    gameOver.classList.add('hidden')
    gGame.isOn = false
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.timeElapsed = null
}

function renderMinesOnLoss(elCell, cell) {
    if (!cell.isMine) return

    if (cell.isRevealed) {
        elCell.innerText = BLAST
    } else {
        elCell.innerText = MINE
    }

    elCell.classList.add('revealed')
}

// The game ends when all mines are marked,
// and all the other cells are revealed
function checkGameOver() {
    // const totalCells = gLevel.beginner.length ** 2
    const totalCells = gLevel.beginner.length ** 2

    if (gGame.revealedCount + gGame.markedCount === totalCells) {
        console.log('victory')
    }
}

//  i, j) When the user clicks a cell with no mines around,
// reveal not only that cell, but also its neighbors.
function expandReveal(rowIdx, colIdx) {
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

            var currCell = gBoard[i][j]
            if (currCell.isRevealed || currCell.isMarked) continue
            currCell.isRevealed = true
            gGame.revealedCount++

            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('revealed')

            if (currCell.minesAround > 0) {
                var elContent = elCell.querySelector('.content')
                elContent.innerText = `${currCell.minesAround}`
                elContent.style.display = 'block'
            }
        }
    }
}

function getCellByClass(i, j) {
    return document.querySelector(`.cell-${i}-${j}`)
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
