export function fromLocalInput(value: string): string {
  return value === '' ? '' : new Date(value).toISOString()
}
