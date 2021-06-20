const fs = require('fs/promises')
const cleanstr = require('cleanstr')

const getNubankTransactions = async () => {
  const nubankRawFile = await fs.readFile('./nubank_raw.txt', {
    encoding: 'utf-8',
  })

  const matches = nubankRawFile.match(/(-)?\d+(?:\.\d{3})*?,\d{2}/gm)

  if (!matches.length) {
    console.log('Nenhuma transação encontrada no nubank raw!')
    return
  }

  const floats = matches.map((value) => {
    let valor = value.replace(/\./g, '')
    valor = valor.replace(/\,/g, '.')
    return parseFloat(valor)
  })

  const sortedTransactions = floats.sort((a, b) => {
    return b - a
  })

  const valoresBRL = sortedTransactions.map((value) => {
    let valorBRL = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    valorBRL = valorBRL.replace(/\R\$/g, '')
    valorBRL = cleanstr.clean(valorBRL)
    return valorBRL
  })

  return valoresBRL
}

module.exports = {
  getNubankTransactions,
}
