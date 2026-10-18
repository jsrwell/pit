import { useRef, type ReactNode } from 'react'

import type { ProductSummary } from '../api/product'
import { ProductGrid } from './ProductGrid'

interface FeaturedCarouselProps {
  products: ProductSummary[]
  renderProductAction?: (product: ProductSummary) => ReactNode
}

export function FeaturedCarousel({ products, renderProductAction }: FeaturedCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null)

  function scroll(direction: 1 | -1) {
    const element = scroller.current
    if (element) element.scrollBy({ left: direction * element.clientWidth, behavior: 'smooth' })
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="featured-heading" className="featured">
      <div className="featured__header">
        <div className="section-heading">
          <span className="eyebrow">Seleção da casa</span>
          <h2 id="featured-heading">Destaques</h2>
        </div>
        {products.length > 3 && (
          <div className="featured__arrows">
            <button type="button" aria-label="Destaques anteriores" onClick={() => scroll(-1)}>
              ←
            </button>
            <button type="button" aria-label="Próximos destaques" onClick={() => scroll(1)}>
              →
            </button>
          </div>
        )}
      </div>
      <div className="featured__scroller" ref={scroller}>
        <ProductGrid products={products} renderAction={renderProductAction} variant="featured" />
      </div>
    </section>
  )
}
