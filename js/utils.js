'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function makeId(length = 6) {
    var txt = ''
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function getTimeStr(elapsedTime) {
    const minutes = String(Math.floor(elapsedTime / 60000)).padStart(2, '0')
    const seconds = String(Math.floor((elapsedTime % 60000) / 1000)).padStart(2,'0')
    const hundredths = String(Math.floor((elapsedTime % 1000) / 10)).padStart(2,'0')
    var strTimer = `${minutes}:${seconds}.${hundredths}`
    return strTimer
}
