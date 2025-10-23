'use strict'

var gBoard
var gGameIsON
var gTimerId
var gStartTime
var gStopTime
var gWiningTime
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

onInit()

function onInit(length = 4, mines = 2) {
    // Stop any running timer
    if (gTimerId) {
        clearInterval(gTimerId)
        gTimerId = null
    }

    // Reset game state
    setGameVariables(mines)

    // Build the board
    gBoard = buildBoard(length)

    // Render everything
    renderBoard(gBoard)
    renderLives()
    renderHints()
    initLocalStorage()
}

function setGameVariables(mines) {
    gGame.isOn = true
    gGame.totalMines = mines
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.revealedCount = 0
    gGame.lives = 3
    gGame.hints = [false, false, false]
    gGame.hintInUse = false
    gGame.hintClicked = false
    gWiningTime = null

    var elTimer = document.querySelector('.timer')
    elTimer.innerText = 'YOUR TIME:'
}

function initLocalStorage() {
    const elBestEasy = document.querySelector('.easy span')
    const elBestIntermediate = document.querySelector('.easy span')
    const elBestExpert = document.querySelector('.easy span')

    if (localStorage.getItem('bestEasy') === null) {
        localStorage.setItem('bestEasy', Infinity)
        elBestEasy.innerText = ''
    } else {
        elBestEasy.innerText = getTimeStr(localStorage.getItem('bestEasy'))
    }

    if (localStorage.getItem('bestIntermediate') === null) {
        localStorage.setItem('bestEasy', Infinity)
        elBestIntermediate.innerText = ''
    } else {
        elBestIntermediate.innerText = getTimeStr(
            localStorage.getItem('bestEasy')
        )
    }

    if (localStorage.getItem('bestExpert') === null) {
        localStorage.setItem('bestExpert', Infinity)
        elBestExpert.innerText = ''
    } else {
        elBestExpert.innerText = getTimeStr(localStorage.getItem('bestEasy'))
    }
}

function changeLevel(newLevel) {
    // Stop any running timer before resetting
    if (gTimerId) {
        clearInterval(gTimerId)
        gTimerId = null
    }

    var boardSize
    var mineCount

    if (newLevel === 'easy') {
        boardSize = 4
        mineCount = 2
    } else if (newLevel === 'intermediate') {
        boardSize = 8
        mineCount = 14
    } else if (newLevel === 'expert') {
        boardSize = 12
        mineCount = 32
    } else {
        boardSize = 4
        mineCount = 2
    }

    // Reset timer display
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = 'YOUR TIME:'

    // Initialize the game with the selected level
    onInit(boardSize, mineCount)
}

function buildBoard(size) {
    var board = []

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

function resetGame() {
    gGame.livesCount = 3
    onInit()
    const elGameOver = document.querySelector('.reset-area')
    elGameOver.classList.add('hidden')
    const elVictory = document.querySelector('.victory-area')
    elVictory.classList.add('hidden')
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = 'YOUR TIME:'
    gGame.isOn = false
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.timeElapsed = null
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

function renderMinesOnLoss(elCell, cell) {
    if (!cell.isMine) return

    if (cell.isRevealed) {
        elCell.innerText = BLAST
    } else {
        elCell.innerText = MINE
    }

    elCell.classList.add('revealed')
}

function renderHints() {
    const elHints = document.querySelectorAll('.hint')
    for (var i = 0; i < 3; i++) {
        gGame.hints[i] = false
        elHints[i].classList.add('unused')
    }
}

function renderLives() {
    const elLives = document.querySelector('.lives-left')
    const aliveCount = gGame.livesCount
    const deadCount = 3 - aliveCount

    var strLives = `LIVES LEFT: `

    for (var i = 0; i < deadCount; i++) {
        strLives += `${DEAD}  `
    }
    for (var i = 0; i < aliveCount; i++) {
        strLives += `${ALIVE}  `
    }

    elLives.innerText = strLives
}
