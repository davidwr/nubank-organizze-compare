const columnLength = 11

const leftPad = require('left-pad')
const _ = require('lodash')

const percentualErro = require('./percentualErro')

function toFloat(stringNum) {
  return parseFloat(stringNum.replace(/\,/g, '.')).toFixed(2)
}

function fillColumn(valor) {
  return valor
}

function space() {
  return ';'
}

const generate = ({ valoresNubank, valoresOrganizze }) => {
  let report = ''

  if (valoresOrganizze.length >= valoresNubank.length) {
    report = `${fillColumn('ORGANIZZE')}${space()}${fillColumn(
      'NUBANK'
    )}${space()}${fillColumn('DIFERENÇA')}\n`
    for (let i = 0; i < valoresOrganizze.length; i++) {
      if (valoresNubank[i]) {
        report += `${fillColumn(valoresOrganizze[i])}${space()}${fillColumn(
          valoresNubank[i]
        )}${space()}${fillColumn(
          (toFloat(valoresOrganizze[i]) - toFloat(valoresNubank[i])).toFixed(2)
        )}\n`
        continue
      }

      report += `${fillColumn(valoresOrganizze[i])}${space()}${fillColumn(
        ''
      )}${space()}${fillColumn('')}\n`
      continue
    }
  }

  if (valoresNubank.length >= valoresOrganizze.length) {
    report = `${fillColumn('NUBANK')}${space()}${fillColumn(
      'ORGANIZZE'
    )}${space()}${fillColumn('DIFERENÇA')}\n`
    for (let i = 0; i < valoresNubank.length; i++) {
      if (valoresOrganizze[i]) {
        report += `${fillColumn(valoresNubank[i])}${space()}${fillColumn(
          valoresOrganizze[i]
        )}${space()}${fillColumn(
          (toFloat(valoresNubank[i]) - toFloat(valoresOrganizze[i])).toFixed(2)
        )}\n`
        continue
      }

      report += `${fillColumn(valoresNubank[i])}${space()}${fillColumn(
        ''
      )}${space()}${fillColumn('')}\n`
      continue
    }
  }

  return report
}

const generateV2 = ({ valoresNubank, valoresOrganizze }) => {
  let report = ''

  const firstColumn = []
  const secondColumn = []
  const thirdColumn = []

  if (valoresOrganizze.length >= valoresNubank.length) {
    report = `${fillColumn('ORGANIZZE')}${space()}${fillColumn(
      'NUBANK'
    )}${space()}${fillColumn('DIFERENÇA')}\n`
    for (let i = 0; i < valoresOrganizze.length; i++) {
      for (let j = 0; j < valoresNubank.length; j++) {
        if (valoresOrganizze[i] === valoresNubank[j]) {
          firstColumn[i] = (' ' + valoresOrganizze[i]).slice(1)
          secondColumn[i] = (' ' + valoresNubank[j]).slice(1)
          thirdColumn[i] = (
            toFloat(firstColumn[i]) - toFloat(secondColumn[i])
          ).toFixed(2)
          break
        }
      }

      if (!firstColumn[i]) {
        firstColumn[i] = (' ' + valoresOrganizze[i]).slice(1)
        secondColumn[i] = '-'
        thirdColumn[i] = '-'
        continue
      }
    }
  }

  if (valoresNubank.length >= valoresOrganizze.length) {
    report = `${fillColumn('NUBANK')}${space()}${fillColumn(
      'ORGANIZZE'
    )}${space()}${fillColumn('DIFERENÇA')}\n`
    for (let i = 0; i < valoresNubank.length; i++) {
      for (let j = 0; j < valoresOrganizze.length; j++) {
        if (valoresNubank[i] === valoresOrganizze[j]) {
          firstColumn[i] = (' ' + valoresNubank[i]).slice(1)
          secondColumn[i] = (' ' + valoresOrganizze[j]).slice(1)
          thirdColumn[i] = (
            toFloat(firstColumn[i]) - toFloat(secondColumn[i])
          ).toFixed(2)
          break
        }
      }

      if (!firstColumn[i]) {
        firstColumn[i] = (' ' + valoresNubank[i]).slice(1)
        secondColumn[i] = '-'
        thirdColumn[i] = '-'
        continue
      }
    }
  }

  for (let k = 0; k < firstColumn.length; k++) {
    report += `${fillColumn(firstColumn[k])}${space()}${fillColumn(
      secondColumn[k]
    )}${space()}${fillColumn(thirdColumn[k])}\n`
  }

  return report
}

function calcularDiferencas({ valoresOrganizze, valoresNubank }) {
  const cloneOrganizze = [...valoresOrganizze]
  const cloneNubank = [...valoresNubank]

  if (valoresNubank.length >= valoresOrganizze.length) {
    for (let i = 0; i < valoresNubank.length; i++) {
      for (let j = 0; j < valoresOrganizze.length; j++) {
        if (cloneNubank[i] === cloneOrganizze[j]) {
          cloneNubank[i] = null
          cloneOrganizze[j] = null
        }
      }
    }
  } else {
    for (let i = 0; i < valoresOrganizze.length; i++) {
      for (let j = 0; j < valoresNubank.length; j++) {
        if (cloneOrganizze[i] === cloneNubank[j]) {
          cloneNubank[j] = null
          cloneOrganizze[i] = null
        }
      }
    }
  }

  const diffOrganizze = _.compact(cloneOrganizze)
  const diffNubank = _.compact(cloneNubank)

  return { diffNubank, diffOrganizze }
}

function calcularCompatibilidades({ diffNubank, diffOrganizze }) {
  const compatabilidades = []

  function pDiff(a, b) {
    let aFloat = parseFloat(toFloat(a))
    let bFloat = parseFloat(toFloat(b))
    return 100 * Math.abs((aFloat - bFloat) / ((aFloat + bFloat) / 2))
  }

  for (let i = 0; i < diffNubank.length; i++) {
    for (let j = 0; j < diffOrganizze.length; j++) {
      const diferencaPercentual = pDiff(diffNubank[i], diffOrganizze[j])
      if (diferencaPercentual <= percentualErro(diffNubank[i])) {
        compatabilidades.push({
          nubank: diffNubank[i],
          organizze: diffOrganizze[j],
          diferenca: diferencaPercentual.toFixed(2) + '%',
        })
      }
    }
  }

  for (let i = 0; i < diffOrganizze.length; i++) {
    for (let j = 0; j < diffNubank.length; j++) {
      const diferencaPercentual = pDiff(diffOrganizze[i], diffNubank[j])
      if (diferencaPercentual <= percentualErro(diffOrganizze[i])) {
        compatabilidades.push({
          nubank: diffNubank[j],
          organizze: diffOrganizze[i],
          diferenca: diferencaPercentual.toFixed(2) + '%',
        })
      }
    }
  }

  return _.uniqWith(compatabilidades, _.isEqual)
}

const generateV3 = ({ valoresNubank, valoresOrganizze }) => {
  let report = ''

  const { diffNubank, diffOrganizze } = calcularDiferencas({
    valoresNubank,
    valoresOrganizze,
  })

  const compatibilidades = calcularCompatibilidades({
    diffNubank,
    diffOrganizze,
  })

  report += `Somente Nubank: ${JSON.stringify(diffNubank)}\n`
  report += `Somente Organizze: ${JSON.stringify(diffOrganizze)}\n`
  report += `Compatabilidades: ${JSON.stringify(compatibilidades)}\n`
  report += `${leftPad('Nubank', 11)}: ${JSON.stringify({
    valores: valoresNubank,
    quantidade: valoresNubank.length,
  })}\n`
  report += `${leftPad('Organizze', 11)}: ${JSON.stringify({
    valores: valoresOrganizze,
    quantidade: valoresOrganizze.length,
  })}\n`

  return report
}

module.exports = { generate, generateV2, generateV3 }
