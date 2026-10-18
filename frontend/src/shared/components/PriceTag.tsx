import { formatPrice } from '@/shared/format/currency'

interface PriceTagProps {
  price: string
  promotionalPrice?: string | null
  className?: string
}

export function PriceTag({ price, promotionalPrice, className = '' }: PriceTagProps) {
  if (promotionalPrice === null || promotionalPrice === undefined) {
    return <span className={`price ${className}`}>{formatPrice(price)}</span>
  }
  return (
    <span className={`price ${className}`}>
      <s className="price--old" aria-label={`De ${formatPrice(price)}`}>
        {formatPrice(price)}
      </s>
      <span aria-label={`Por ${formatPrice(promotionalPrice)}`}>
        {formatPrice(promotionalPrice)}
      </span>
    </span>
  )
}
