import { useCallback, useState, type ReactNode } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { useAsync } from '@/shared/hooks/use-async'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'

import { listProducts, type ProductFilters } from '../api/list-products'
import type { ProductSummary } from '../api/product'
import { FilterBar } from './FilterBar'
import { ProductGrid } from './ProductGrid'

import './catalog.css'

interface StorefrontProps {
  renderProductAction?: (product: ProductSummary) => ReactNode
}

function isFiltering(filters: ProductFilters): boolean {
  return Object.values(filters).some((value) => value !== undefined && value !== '')
}

export function Storefront({ renderProductAction }: StorefrontProps) {
  const [filters, setFilters] = useState<ProductFilters>({})
  const appliedFilters = useDebouncedValue(filters)
  const load = useCallback(() => listProducts(appliedFilters), [appliedFilters])
  const { state } = useAsync(load)
  const filtering = isFiltering(appliedFilters)

  return (
    <div className="storefront">
      {!filtering && state.status === 'success' && (
        <FeaturedSection
          products={state.data.filter((product) => product.is_featured)}
          renderProductAction={renderProductAction}
        />
      )}
      <section aria-labelledby="catalog-heading" className="storefront__section">
        <div className="section-heading">
          <span className="eyebrow">Vitrine completa</span>
          <h2 id="catalog-heading">Nossos cupcakes</h2>
          <p>Receitas autorais, preparadas diariamente com ingredientes nobres.</p>
        </div>
        <FilterBar filters={filters} onChange={setFilters} />
        <AsyncContent state={state} loadingLabel="Carregando a vitrine...">
          {(products) =>
            products.length === 0 ? (
              <p className="empty-state">
                {filtering
                  ? 'Nenhum cupcake corresponde aos filtros escolhidos.'
                  : 'Nenhum cupcake disponível no momento.'}
              </p>
            ) : (
              <ProductGrid products={products} renderAction={renderProductAction} />
            )
          }
        </AsyncContent>
      </section>
    </div>
  )
}

interface FeaturedSectionProps extends StorefrontProps {
  products: ProductSummary[]
}

function FeaturedSection({ products, renderProductAction }: FeaturedSectionProps) {
  if (products.length === 0) {
    return null
  }
  return (
    <section aria-labelledby="featured-heading" className="storefront__section">
      <div className="section-heading">
        <span className="eyebrow">Seleção da casa</span>
        <h2 id="featured-heading">Destaques</h2>
      </div>
      <ProductGrid products={products} renderAction={renderProductAction} variant="featured" />
    </section>
  )
}
