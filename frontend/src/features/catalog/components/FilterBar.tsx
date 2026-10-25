import { useEffect, useState } from 'react'

import { listCategories, listFlavors } from '../api/list-classifications'
import type { ProductFilters } from '../api/list-products'
import type { NamedItem } from '../api/product'

interface FilterBarProps {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
  onlyFavorites: boolean
  favoriteCount: number
  onOnlyFavoritesChange: (onlyFavorites: boolean) => void
  search: string
  onClearSearch: () => void
  onClearAll: () => void
}

function toId(value: string): number | undefined {
  return value === '' ? undefined : Number(value)
}

export function FilterBar({
  filters,
  onChange,
  onlyFavorites,
  favoriteCount,
  onOnlyFavoritesChange,
  search,
  onClearSearch,
  onClearAll,
}: FilterBarProps) {
  const [categories, setCategories] = useState<NamedItem[]>([])
  const [flavors, setFlavors] = useState<NamedItem[]>([])

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
    listFlavors()
      .then(setFlavors)
      .catch(() => setFlavors([]))
  }, [])

  const hasFilters =
    onlyFavorites ||
    search !== '' ||
    Object.values(filters).some((value) => value !== undefined && value !== '')

  return (
    <div className="filter-bar" role="group" aria-label="Filtros da vitrine">
      {search !== '' && (
        <div className="filter-bar__term">
          <span>
            Resultados para <strong>“{search}”</strong>
          </span>
          <button type="button" className="link-button" onClick={onClearSearch}>
            Limpar busca
          </button>
        </div>
      )}
      <div className="field">
        <label htmlFor="filter-category">Categoria</label>
        <select
          id="filter-category"
          value={filters.category_id ?? ''}
          onChange={(event) => onChange({ ...filters, category_id: toId(event.target.value) })}
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="filter-flavor">Sabor</label>
        <select
          id="filter-flavor"
          value={filters.flavor_id ?? ''}
          onChange={(event) => onChange({ ...filters, flavor_id: toId(event.target.value) })}
        >
          <option value="">Todos</option>
          {flavors.map((flavor) => (
            <option key={flavor.id} value={flavor.id}>
              {flavor.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="filter-min-price">Preço mínimo</label>
        <input
          id="filter-min-price"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={filters.min_price ?? ''}
          onChange={(event) => onChange({ ...filters, min_price: event.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="filter-max-price">Preço máximo</label>
        <input
          id="filter-max-price"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={filters.max_price ?? ''}
          onChange={(event) => onChange({ ...filters, max_price: event.target.value })}
        />
      </div>
      <div className="filter-bar__footer">
        <div className="pill-group" role="group" aria-label="Exibir">
          <button
            type="button"
            className="pill"
            aria-pressed={!onlyFavorites}
            onClick={() => onOnlyFavoritesChange(false)}
          >
            Todos
          </button>
          <button
            type="button"
            className="pill pill--favorites"
            aria-pressed={onlyFavorites}
            onClick={() => onOnlyFavoritesChange(true)}
          >
            Favoritos
            <span className="pill__count" aria-label={`${favoriteCount} marcados`}>
              {favoriteCount}
            </span>
          </button>
        </div>
        {hasFilters && (
          <button type="button" className="link-button" onClick={onClearAll}>
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}
