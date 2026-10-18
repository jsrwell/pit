import type { ReactNode } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { useAsync } from '@/shared/hooks/use-async'

import { listProducts } from '../api/list-products'
import type { ProductSummary } from '../api/product'
import { ProductGrid } from './ProductGrid'

import './catalog.css'

interface StorefrontProps {
  renderProductAction?: (product: ProductSummary) => ReactNode
}

export function Storefront({ renderProductAction }: StorefrontProps) {
  const { state } = useAsync(listProducts)

  return (
    <AsyncContent state={state} loadingLabel="Carregando a vitrine...">
      {(products) => {
        const featured = products.filter((product) => product.is_featured)
        return (
          <div className="storefront">
            {featured.length > 0 && (
              <section aria-labelledby="featured-heading" className="storefront__section">
                <div className="section-heading">
                  <span className="eyebrow">Seleção da casa</span>
                  <h2 id="featured-heading">Destaques</h2>
                </div>
                <ProductGrid
                  products={featured}
                  renderAction={renderProductAction}
                  variant="featured"
                />
              </section>
            )}
            <section aria-labelledby="catalog-heading" className="storefront__section">
              <div className="section-heading">
                <span className="eyebrow">Vitrine completa</span>
                <h2 id="catalog-heading">Nossos cupcakes</h2>
                <p>Receitas autorais, preparadas diariamente com ingredientes nobres.</p>
              </div>
              {products.length === 0 ? (
                <p className="empty-state">Nenhum cupcake disponível no momento.</p>
              ) : (
                <ProductGrid products={products} renderAction={renderProductAction} />
              )}
            </section>
          </div>
        )
      }}
    </AsyncContent>
  )
}
