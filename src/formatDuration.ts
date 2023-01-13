/**
 * Formats a value that can be converted to a `Date`
 * in an intuitive human form.
 */
export function formatDuration(
  value: string | number | Date,
): string {
  let productSt = ''
  const date = new Date(value)

  if (!(date instanceof Date)) return '0s'

  // TODO: This is great and all,
  // but it does not account for hours past the amount of 24,
  // which is not ideal
  let h = date.getUTCHours()
  let m = date.getUTCMinutes()
  let s = date.getUTCSeconds()
  let hSt: string = ''
  let mSt: string = ''
  let sSt: string = ''

  if (h) {
    hSt = h.toString()
    productSt += h + 'h'
  }
  if (m || hSt) {
    mSt = m.toString()
    if (hSt) productSt += ' '
    if (hSt && mSt.length == 1) mSt = `0${mSt}`
    productSt += mSt + 'm'
  }
  /* Always return seconds */ {
    sSt = s.toString()
    if (mSt) productSt += ' '
    if (mSt && sSt.length == 1) sSt = `0${sSt}`
    productSt += sSt + 's'
  }

  return productSt
}
