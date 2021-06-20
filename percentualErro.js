function toFloat (stringNum) {
    return Math.abs(parseFloat(parseFloat(stringNum.replace(/\,/g, '.')).toFixed(2)))
  }

module.exports = function (valor) {
    let numero = toFloat(valor)
    if (numero <= 10) {
        return 10
    }

    if (numero <= 50) {
        return 5
    }

    if (numero <= 100) {
        return 1
    }

    if (numero <= 1000) {
        return 0.5
    }

    return 0.2
}
