/**
 * @param value A number
 * @returns Float with 2 decimals.
 */
export const numberFormat = (value = 0) => {
  return parseFloat(`${value}`)
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const currencyFormat = (value: number | string, currency = 'R') => {
  if (!value && value !== 0) return ''

  return `${currency} ${numberFormat(parseFloat(`${value}`))}`
}

export default currencyFormat
