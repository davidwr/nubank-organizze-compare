require('dotenv').config()

const fs = require('fs/promises')

const organizze = require('./organizze')
const nubank = require('./nubank')
const report = require('./report')

async function main () {
  // await fs.unlink('./report.txt')
  // await fs.unlink('./reportV2.txt')
  // await fs.unlink('./reportV3.txt')

  const valoresOrganizze = await organizze.getOrganizzeTransactions()
  const valoresNubank = await nubank.getNubankTransactions()

  const result = report.generate({valoresOrganizze, valoresNubank})
  const result2 = report.generateV2({valoresOrganizze, valoresNubank})
  const result3 = report.generateV3({valoresOrganizze, valoresNubank})

  await fs.writeFile('./report.txt', result)
  await fs.writeFile('./reportV2.txt', result2)
  await fs.writeFile('./reportV3.txt', result3)
}

main()
