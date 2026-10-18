import type { ReactNode } from 'react'

import type { ProductSummary } from '../api/product'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: ProductSummary[]
  renderAction?: (product: ProductSummary) => ReactNode
  variant?: 'regular' | 'featured'
}

export function ProductGrid({ products, renderAction, variant = 'regular' }: ProductGridProps) {
  return (
    <div className={`product-grid product-grid--${variant}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} action={renderAction?.(product)} />
      ))}
    </div>
  )
}
