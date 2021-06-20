const moment = require('moment')
const axios = require('axios')
const cleanstr = require('cleanstr')

const getInvoicesByMonth = async ({ month }) => {
  if (!month) {
    month = moment().add(1, 'month').format('YYYY-MM')
  }

  const dateFilter = `${month}-${process.env.ORGANIZZE_CREDITCARD_CLOSEDAY}`

  const invoices = await axios.get(
    `${process.env.ORGANIZZE_URL}/credit_cards/${process.env.ORGANIZZE_CREDITCARD}/invoices`,
    {
      headers: { Authorization: process.env.ORGANIZZE_CREDENTIALS },
    }
  )

  if (!invoices.data || !invoices.data.length) {
    throw new Error('Nenhuma informação retornada!')
  }

  const invoicesFiltered = invoices.data.filter((value) => {
    return value.date === dateFilter
  })

  return invoicesFiltered[0].id
}

const getInvoiceById = async ({ invoiceId }) => {
  const invoice = await axios.get(
    `${process.env.ORGANIZZE_URL}/credit_cards/${process.env.ORGANIZZE_CREDITCARD}/invoices/${invoiceId}`,
    {
      headers: { Authorization: process.env.ORGANIZZE_CREDENTIALS },
    }
  )

  if (!invoice.data) {
    throw new Error('Nenhuma informação retornada!')
  }

  if (!invoice.data.transactions.length) {
    throw new Error('Nenhuma transação retornada!')
  }

  return invoice.data
}

const getOrganizzeTransactions = async () => {
  const invoiceId = await getInvoicesByMonth({ month: '2021-07' })
  const valores = await getInvoiceById({ invoiceId })

  const sortedTransactions = valores.transactions
    .map((value) => {
      return value.amount_cents
    })
    .sort((a, b) => {
      return a - b
    })

  const valoresBRL = sortedTransactions.map((value) => {
    let valorBRL = (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    valorBRL = valorBRL.replace(/\R\$/g, '')
    if (valorBRL.indexOf('-') > -1) {
      valorBRL = valorBRL.replace(/\-/g, '')
      return cleanstr.clean(valorBRL)
    }

    return '-' + cleanstr.clean(valorBRL)
  })

  return valoresBRL
}

module.exports = {
  getOrganizzeTransactions,
}
