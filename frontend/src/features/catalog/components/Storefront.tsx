import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { useAsync } from '@/shared/hooks/use-async'

import { listProducts, type ProductFilters } from '../api/list-products'
import type { ProductSummary } from '../api/product'
import { useFavorites } from '../hooks/favorites-store'
import { useStorefrontSearch } from '../hooks/use-storefront-search'
import { FeaturedCarousel } from './FeaturedCarousel'
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
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const favorites = useFavorites()
  const [search, setSearch] = useStorefrontSearch()
  const section = useRef<HTMLElement>(null)
  const { category_id, flavor_id, min_price, max_price } = filters
  const appliedFilters = useMemo<ProductFilters>(
    () => ({ category_id, flavor_id, min_price, max_price, search }),
    [category_id, flavor_id, min_price, max_price, search],
  )
  const load = useCallback(() => listProducts(appliedFilters), [appliedFilters])
  const { state, refreshing } = useAsync(load)
  const updating = refreshing
  const filtering = onlyFavorites || isFiltering(appliedFilters)

  useEffect(() => {
    if (search !== '') section.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }, [search])

  function clearAll() {
    setFilters({})
    setOnlyFavorites(false)
    setSearch('')
  }

  function visible(products: ProductSummary[]): ProductSummary[] {
    return onlyFavorites ? products.filter((product) => favorites.includes(product.id)) : products
  }

  function emptyMessage(): string {
    if (onlyFavorites && favorites.length === 0) {
      return 'Você ainda não tem favoritos. Toque no coração de um cupcake para guardá-lo aqui.'
    }
    if (search !== '' && !onlyFavorites && !isFiltering({ category_id, flavor_id })) {
      return `Nenhum cupcake encontrado para “${search}”. Experimente outro termo ou percorra a vitrine completa.`
    }
    return filtering
      ? 'Nenhum cupcake corresponde aos filtros escolhidos.'
      : 'Nenhum cupcake disponível no momento.'
  }

  return (
    <div className="storefront">
      {!filtering && state.status === 'success' && (
        <FeaturedCarousel
          products={state.data.filter((product) => product.is_featured)}
          renderProductAction={renderProductAction}
        />
      )}
      <section aria-labelledby="catalog-heading" className="storefront__section" ref={section}>
        <div className="section-heading">
          <span className="eyebrow">Vitrine completa</span>
          <h2 id="catalog-heading">Nossos cupcakes</h2>
          <p>Receitas autorais, preparadas diariamente com ingredientes nobres.</p>
        </div>
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onlyFavorites={onlyFavorites}
          favoriteCount={favorites.length}
          onOnlyFavoritesChange={setOnlyFavorites}
          search={search}
          onClearSearch={() => setSearch('')}
          onClearAll={clearAll}
        />
        <div
          className={
            updating ? 'storefront__results storefront__results--updating' : 'storefront__results'
          }
          aria-busy={updating}
        >
          <div className="storefront__progress" aria-hidden="true" />
          <p role="status" className="visually-hidden">
            {updating ? 'Atualizando a vitrine...' : ''}
          </p>
          <AsyncContent state={state} loadingLabel="Carregando a vitrine...">
            {(products) => {
              const shown = visible(products)
              return shown.length === 0 ? (
                <p className="empty-state">{emptyMessage()}</p>
              ) : (
                <ProductGrid products={shown} renderAction={renderProductAction} />
              )
            }}
          </AsyncContent>
        </div>
      </section>
    </div>
  )
}
