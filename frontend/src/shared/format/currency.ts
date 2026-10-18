const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatPrice(value: string | number): string {
  return BRL.format(Number(value))
}
