import { addDays  } from 'date-fns'

export function addDaysToDate(date: Date, numberOfDays: number): Date {
    return addDays(date, numberOfDays)
}