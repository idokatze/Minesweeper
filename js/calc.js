'use strict'

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
}