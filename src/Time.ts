import { isMonthNum, MonthName, MonthNames } from './constants/MonthNames'
import { MonthShortName, MonthShortNames } from './constants/MonthShortNames'

export class Time {
  #config: TimeConfig | null
  ms = 0
  defaultValue = '–'
  date: Date
  isValid: boolean

  constructor(
    value: string | number | Date,
    config?: TimeConfig,
  ) {
    const date = new Date(value)
    this.date = date

    if (date instanceof Date) {
      this.ms = date.getTime()
      this.isValid = true
    } else {
      this.isValid = false
    }

    this.#config = config ?? null
  }

  getDate(): string {
    if (!this.isValid) return this.defaultValue

    const month = this.#getMonthRepr()
    if (month == null) return this.defaultValue

    const day = this.#getDayRepr()
    const year = this.#getYearRepr()
  
    const date = `${month} ${day}, ${year}`
  
    return date
  }

  getTime(): string {
    if (!this.isValid) return this.defaultValue

    const hours = this.#getHoursRepr()
    const minutes = this.#getMinutesRepr()  
    const ampm = this.#getAMPM() ?? ''

    const time = `${hours}:${minutes}${ampm}`
  
    return time
  }

  getDateTime(): string {
    if (!this.isValid) return this.defaultValue

    const dateSt = this.getDate()
    const timeSt = this.getTime()
  
    const dateTime = `${dateSt} ${timeSt}`

    return dateTime
  }

  #getYearRepr(): string {
    const year = String(this.date.getFullYear())

    return year
  }

  #getMonthRepr(): MonthName | MonthShortName | null {
    const monthNum = this.date.getMonth()
    if (!isMonthNum(monthNum)) return null

    const monthName = this.#config?.useShortMonthNames
      ? MonthShortNames[monthNum]
      : MonthNames[monthNum]
    
    return monthName
  }

  #getDayRepr(): string {
    return this.#formatNumber(this.date.getDate())
  }

  #getHoursRepr(): string {
    let hours = this.date.getHours()

    if (!this.#config?.use24hClock) {
      if (hours == 0) hours = 12
      if (hours > 12) hours -= 12
    }

    return this.#formatNumber(hours)
  }

  #getMinutesRepr(): string {
    return this.#formatNumber(this.date.getMinutes())
  }

  #getAMPM(): string | null {
    if (this.#config?.use24hClock) return null
    if (this.date.getHours() >= 12) return 'pm'
    else return 'am'
  }

  #formatNumber(
    num: number,
  ): string {
    let st = String(num)

    if (
      this.#config?.useDoubleDigitsAlways &&
      st.length == 1
    ) st = `0${st}`

    return st
  }
}

export interface TimeConfig {
  useShortMonthNames?: boolean
  useDoubleDigitsAlways?: boolean
  use24hClock?: boolean
}
