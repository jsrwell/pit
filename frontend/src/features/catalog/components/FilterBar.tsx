import { useEffect, useState } from 'react'

import { listCategories, listFlavors } from '../api/list-classifications'
import type { ProductFilters } from '../api/list-products'
import type { NamedItem } from '../api/product'

interface FilterBarProps {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
}

function toId(value: string): number | undefined {
  return value === '' ? undefined : Number(value)
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
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

  const hasFilters = Object.values(filters).some((value) => value !== undefined && value !== '')

  return (
    <form className="filter-bar" role="search" onSubmit={(event) => event.preventDefault()}>
      <div className="field filter-bar__search">
        <label htmlFor="filter-search">Buscar</label>
        <input
          id="filter-search"
          type="search"
          placeholder="Nome do cupcake"
          value={filters.search ?? ''}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </div>
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
      {hasFilters && (
        <button
          type="button"
          className="link-button filter-bar__clear"
          onClick={() => onChange({})}
        >
          Limpar filtros
        </button>
      )}
    </form>
  )
}
