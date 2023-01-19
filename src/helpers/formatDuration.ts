import { MillisecondDurations } from '../constants/MillisecondDurations'

/**
 * Formats a milliseconds value to formatted duration,
 * in the format: "576d 23h 59m 59s".
 */
export function formatDuration(
  value: string | number | Date,
  {
    highestMeasurement='weeks',
    useDoubleDigitsHMS,
  }: FormatDurationOptions={},
): string {
  const repr = {
    weeks: 'wk',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
  }

  const date = new Date(value)

  if (date.toString() == 'Invalid Date') return '–'

  const durationMs = date.getTime()

  // Determine how much of what
  let wk = 0
  let d = 0
  let h = 0
  let m = 0
  let s = 0
  let remainingTimeMs = durationMs

  if (remainingTimeMs >= MillisecondDurations.week) {
    wk = Math.floor(remainingTimeMs / MillisecondDurations.week)
    remainingTimeMs -= wk * MillisecondDurations.week
  }
  if (remainingTimeMs >= MillisecondDurations.day) {
    d = Math.floor(remainingTimeMs / MillisecondDurations.day)
    remainingTimeMs -= d * MillisecondDurations.day
  }
  if (remainingTimeMs >= MillisecondDurations.hour) {
    h = Math.floor(remainingTimeMs / MillisecondDurations.hour)
    remainingTimeMs -= h * MillisecondDurations.hour
  }
  if (remainingTimeMs >= MillisecondDurations.minute) {
    m = Math.floor(remainingTimeMs / MillisecondDurations.minute)
    remainingTimeMs -= m * MillisecondDurations.minute
  }
  if (remainingTimeMs >= MillisecondDurations.second) {
    s = Math.floor(remainingTimeMs / MillisecondDurations.second)
    remainingTimeMs -= s * MillisecondDurations.second
  }

  // Convert values depending on `highestMeasurement`
  switch (highestMeasurement) {
    case 'weeks':
    case 'days':
    case 'hours':
    case 'minutes':
    case 'seconds':
      if (highestMeasurement == 'weeks') break

      d += wk * 7
      wk = 0
      if (highestMeasurement == 'days') break

      h += d * 24
      d = 0
      if (highestMeasurement == 'hours') break

      m += h * 60
      h = 0
      if (highestMeasurement == 'minutes') break

      s += m * 60
      m = 0
      if (highestMeasurement == 'seconds') break
  }

  // Stitch together values into final string
  let product = ''
  const getZeroHMS = (val: number) => (useDoubleDigitsHMS && val < 10) ? '0' : ''
  const getSpace = (prevVal: number) => prevVal ? ' ' : ''

  if (wk) {
    product += wk + repr.weeks
  }
  if (d) {
    product += getSpace(wk) + d + repr.days
  }
  if (h) {
    product += getSpace(d) + getZeroHMS(h) + h + repr.hours
  }
  if (m) {
    product += getSpace(h) + getZeroHMS(m) + m + repr.minutes
  }
  if (s) {
    product += getSpace(m) + getZeroHMS(s) + s + repr.seconds
  }

  return product
}

export interface FormatDurationOptions {
  /** Default: `weeks`. */
  highestMeasurement?:
    | 'weeks'
    | 'days'
    | 'hours'
    | 'minutes'
    | 'seconds'
  useDoubleDigitsHMS?: boolean
}
