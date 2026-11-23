const TIME_ZONE = 'Asia/Jakarta'

const formatters = {
  date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: TIME_ZONE }),
  shortDate: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: TIME_ZONE }),
  day: new Intl.DateTimeFormat('id-ID', { day: 'numeric', timeZone: TIME_ZONE }),
  monthYear: new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }),
  time: new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
  }),
}

export type DateFormat = keyof typeof formatters

export function formatDate(value: string | Date, style: DateFormat = 'date') {
  return formatters[style].format(typeof value === 'string' ? new Date(value) : value)
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}
