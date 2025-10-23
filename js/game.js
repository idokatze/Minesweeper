'use strict'

function setMinesAndCountNeighbors(firstI, firstJ) {
    // ------ Random Mines ------
    var minesToLay

    if (gBoard.length === 12) {
        minesToLay = 32
    } else if (gBoard.length === 8) {
        minesToLay = 14
    } else minesToLay = 2

    for (var i = 0; i < minesToLay; i++) {
        while (true) {
            var randomRowIdx = getRandomInt(0, gBoard.length)
            var randomColIdx = getRandomInt(0, gBoard.length)
            var currCell = gBoard[randomRowIdx][randomColIdx]
            if (
                (randomRowIdx !== firstI || randomColIdx !== firstJ) &&
                !currCell.isMine
            ) {
                currCell.isMine = true
                break
            }
        }
    }
    // ------End of Random Mines ------

    // ------ Hard Coded ------
    //     gBoard[1][2].isMine = true
    //     gBoard[2][3].isMine = true
    // ------ End Hard Coded ------

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
    // If GameOver -> return
    if (!gGame.isOn) return

    // If clicked cell has already been revealed or marked -> return
    const currCell = gBoard[i][j]
    if (currCell.isRevealed || currCell.isMarked) return

    // If a hint is being used, then return
    if (gGame.hintClicked) {
        revealOnHint(elCell, i, j)
        return
    }

    // If this is the first clicked cell
    // Start timer and est board with mines
    if (gGame.revealedCount === 0) {
        gGame.isOn = true
        startStopTimer()
        setMinesAndCountNeighbors(i, j)
    }

    // Update variables and reveal cell
    currCell.isRevealed = true
    gGame.revealedCount++
    elCell.classList.add('revealed')

    // Expand and reveal if no neighboring mines
    if (currCell.minesAround === 0) {
        expandReveal(i, j)
    }

    //Check win
    checkGameOver()

    // Rendering mines around
    if (!currCell.isMine) {
        if (currCell.minesAround > 0) {
            elCell.innerText = `${currCell.minesAround}`
            return
        }
    } else { // landed on mine
        gGame.livesCount--
        renderLives()
        elCell.innerText = `${BLAST}`
        if (gGame.livesCount === 0) {
            gGame.isOn = false
            startStopTimer()
            gameLost()
        }
    }
}

function onFlag(ev, elCell, i, j) {
    ev.preventDefault()
    const cell = gBoard[i][j]

    if (cell.isRevealed) return

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
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            renderMinesOnLoss(elCell, cell)
        }
    }

    const gameOver = document.querySelector('.reset-area')
    gameOver.classList.remove('hidden')
}

function onHint(elHint, hintIdx) {
    if (gGame.revealedCount === 0) return
    if (gGame.hints[hintIdx] === true) return
    if (gGame.hintInUse) return

    gGame.hints[hintIdx] = true
    elHint.classList.remove('unused')

    gGame.hintClicked = true
}

function revealOnHint(elCell, rowIdx, colIdx) {
    clearTimeout(gHintTimer)
    const revealedCells = []

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (
                i < 0 ||
                i >= gBoard.length ||
                j < 0 ||
                j >= gBoard[0].length ||
                gBoard[i][j].isRevealed ||
                gBoard[i][j].isMarked
            )
                continue

            const currCell = gBoard[i][j]
            const elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            elCurrCell.classList.add('revealed')
            revealedCells.push(elCurrCell)

            const elContent = elCurrCell.querySelector('.content')
            if (currCell.isMine) {
                elContent.innerText = MINE
                elContent.style.display = 'block'
            } else if (currCell.minesAround > 0) {
                elContent.innerText = `${gBoard[i][j].minesAround}`
                elContent.style.display = 'block'
            }
        }
    }

    gHintTimer = setTimeout(() => {
        for (var k = 0; k < revealedCells.length; k++) {
            revealedCells[k].classList.remove('revealed')
            const elContent = revealedCells[k].querySelector('.content')
            elContent.innerText = ''
            elContent.style.display = 'none'
        }
        gGame.hintInUse = false
        gGame.hintClicked = false
    }, 1500)

    gGame.hintClicked = false
}

function checkGameOver() {
    const totalCells = gBoard.length ** 2

    if (gGame.revealedCount + gGame.markedCount === totalCells) {
        gGame.isOn = false
        startStopTimer()
        console.log('victory')

        const victory = document.querySelector('.victory-area')
        victory.classList.remove('hidden')

        // check if best time
        if (totalCells === 16) {
            const prevBest = +localStorage.getItem('bestEasy')
            console.log(prevBest)
            console.log(gWiningTime)
            if (+gWiningTime < prevBest) {
                localStorage.setItem('bestEasy', gWiningTime)
                const elBest = document.querySelector('.easy span')
                elBest.innerText = getTimeStr(gWiningTime)
            }
        } else if (totalCells === 64) {
            const prevBest = +localStorage.getItem('bestIntermediate')
            console.log(prevBest)
            console.log(gWiningTime)
            if (+gWiningTime < prevBest) {
                localStorage.setItem('bestIntermediate', gWiningTime)
                const elBest = document.querySelector('.intermediate span')
                elBest.innerText = getTimeStr(gWiningTime)
            }
        } else if (totalCells === 144) {
            const prevBest = +localStorage.getItem('bestExpert')
            console.log(prevBest)
            console.log(gWiningTime)
            if (+gWiningTime < prevBest) {
                localStorage.setItem('bestExpert', gWiningTime)
                const elBest = document.querySelector('.expert span')
                elBest.innerText = getTimeStr(gWiningTime)
            }
        } else return
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

            const currCell = gBoard[i][j]
            if (currCell.isRevealed || currCell.isMarked) continue

            currCell.isRevealed = true
            gGame.revealedCount++

            const elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('revealed')

            const elContent = elCell.querySelector('.content')
            if (currCell.minesAround > 0) {
                elContent.innerText = `${currCell.minesAround}`
                elContent.style.display = 'block'
            }

            if (currCell.minesAround === 0) {
                expandReveal(i, j)
            }
        }
    }
}

function startStopTimer() {
    console.log(gBoard.length)
    if (gGame.isOn) {
        clearInterval(gTimerId)
        gStartTime = Date.now()

        gTimerId = setInterval(() => {
            gGame.timeElapsed = Date.now() - gStartTime
            gWiningTime = Date.now() - gStartTime
            const elTimer = document.querySelector('.timer')
            elTimer.innerText = `Your Time: ${getTimeStr(gWiningTime)}`
        }, 100)
    } else {
        clearInterval(gTimerId)
        gTimerId = null
    }
}
