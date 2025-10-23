'use strict'

var gBoard
var gameIsON
var gTimerId
var gStartTime
var gStopTime
var gHintTimer

const FLAG = '🚩'
const MINE = '💣'
const BLAST = '💥'
const ALIVE = '🤡'
const DEAD = '☠️'
const EMPTY = ''

const gGame = {
    isOn: false,
    revealedCount: 0,
    totalMines: 2,
    markedCount: 0,
    livesCount: 3,
    timeElapsed: null,
    hints: [],
    hintClicked: false,
    hintInUse: false,
}

const gLevel = {
    beginner: { length: 4, mines: 2 },
    intermediate: { length: 8, mines: 14 },
    expert: { length: 12, mines: 32 },
}

onInit()

function onInit(length = 4, mines = 2) {
    gBoard = buildBoard(length)
    gGame.isOn = true
    gGame.totalMines = mines
    renderBoard(gBoard)
    renderLives()
    renderHints()
}

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

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td class="cell cell-${i}-${j}"><div class="cell-${i}-${j} cover" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onFlag(event, this, ${i}, ${j})"></div><div class="content"></div></td>`
        }

        strHTML += `</tr>`

        const elContainer = document.querySelector('.board')
        elContainer.innerHTML = strHTML
    }
}

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
    const currCell = gBoard[i][j]
    if (currCell.isRevealed || currCell.isMarked) return

    if (gGame.hintClicked) {
        revealOnHint(elCell, i, j)
        return
    }

    if (gGame.revealedCount === 0) {
        gGame.isOn = true
        startStopTimer()
        setMinesAndCountNeighbors(i, j)
    }

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
        gGame.livesCount--
        renderLives()
        elCell.innerText = `${BLAST}`
        console.log(gGame.livesCount)
        if (gGame.livesCount === 0) {
            gGame.isOn = false
            startStopTimer()
            gameLost()
        }
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
    gGame.livesCount = 3
    onInit()
    var elGameOver = document.querySelector('.reset-area')
    elGameOver.classList.add('hidden')
    var elVictory = document.querySelector('.victory-area')
    elVictory.classList.add('hidden')
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = 'YOUR TIME:'
    gGame.isOn = false
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.timeElapsed = null
}

function onHint(elHint, hintIdx) {
    if (gGame.revealedCount === 0) return
    if (gGame.hints[hintIdx] === true) return
    if (gGame.hintInUse) return

    gGame.hints[hintIdx] = true
    elHint.classList.remove('unused')

    gGame.hintClicked = true
}

function revealOnHint(elCell, i, j) {
    clearTimeout(gHintTimer)

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

function checkGameOver() {
    // const totalCells = gLevel.beginner.length ** 2
    const totalCells = gLevel.beginner.length ** 2

    if (gGame.revealedCount + gGame.markedCount === totalCells) {
        gGame.isOn = false
        startStopTimer()
        console.log('victory')

        var victory = document.querySelector('.victory-area')
        victory.classList.remove('hidden')
    }
}

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

function startStopTimer() {
    if (gGame.isOn) {
        clearInterval(gTimerId)
        gStartTime = Date.now()

        gTimerId = setInterval(() => {
            gGame.timeElapsed = Date.now() - gStartTime
            const elTimer = document.querySelector('.timer')
            elTimer.innerText = getTimeStr(gGame.timeElapsed)
        }, 100)
    } else {
        clearInterval(gTimerId)
        gTimerId = null
    }
}

function renderHints() {
    var elHints = document.querySelectorAll('.hint')
    for (var i = 0; i < 3; i++) {
        gGame.hints[i] = false
        elHints[i].classList.add('unused')
    }
}

function renderLives() {
    var elLives = document.querySelector('.lives-left')
    var aliveCount = gGame.livesCount
    console.log(aliveCount)
    var deadCount = 3 - aliveCount

    var strLives = `LIVES LEFT: `

    for (var i = 0; i < deadCount; i++) {
        strLives += `${DEAD}  `
    }
    for (var i = 0; i < aliveCount; i++) {
        strLives += `${ALIVE}  `
    }

    elLives.innerText = strLives
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
