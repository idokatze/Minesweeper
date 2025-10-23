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
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function getRandomColor() {
    const excludedColor = 'rgb(0, 0, 128)'

    while (true) {
        const r = Math.floor(Math.random() * 256) // Random red value (0-255)
        const g = Math.floor(Math.random() * 256) // Random green value (0-255)
        const b = Math.floor(Math.random() * 256) // Random blue value (0-255)
        var color = `rgb(${r}, ${g}, ${b})`
        if (color !== excludedColor) return color
    }
}

function getTimeStr(elapsedTime) {
    var minutes = String(Math.floor(elapsedTime / 60000)).padStart(2, '0')
    var seconds = String(Math.floor((elapsedTime % 60000) / 1000)).padStart(
        2,
        '0'
    )
    var hundredths = String(Math.floor((elapsedTime % 1000) / 10)).padStart(
        2,
        '0'
    )
    var strTimer = ''
    strTimer += `YOUR TIME: ${minutes}:${seconds}.${hundredths}`
    return strTimer
}