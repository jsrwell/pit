const DATE_TIME = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const DATE = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' })

export function formatDateTime(value: string): string {
  return DATE_TIME.format(new Date(value))
}

export function formatDate(value: string): string {
  return DATE.format(new Date(`${value}T00:00:00Z`))
}
