import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import * as classificationsApi from '../api/list-classifications'
import type { ProductFilters } from '../api/list-products'
import { FilterBar } from './FilterBar'

function Harness({ onChange }: { onChange: (filters: ProductFilters) => void }) {
  const [filters, setFilters] = useState<ProductFilters>({})
  return (
    <FilterBar
      filters={filters}
      onChange={(next) => {
        setFilters(next)
        onChange(next)
      }}
      onlyFavorites={false}
      favoriteCount={0}
      onOnlyFavoritesChange={vi.fn()}
      search=""
      onClearSearch={vi.fn()}
      onClearAll={vi.fn()}
    />
  )
}

describe('FilterBar', () => {
  beforeEach(() => {
    vi.spyOn(classificationsApi, 'listCategories').mockResolvedValue([{ id: 3, name: 'Veganos' }])
    vi.spyOn(classificationsApi, 'listFlavors').mockResolvedValue([{ id: 5, name: 'Pistache' }])
  })

  it('emits category, flavor and price range criteria', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChange={onChange} />)

    await waitFor(() => expect(screen.getByRole('option', { name: 'Veganos' })).toBeInTheDocument())
    await user.selectOptions(screen.getByLabelText('Categoria'), '3')
    await user.selectOptions(screen.getByLabelText('Sabor'), '5')
    await user.type(screen.getByLabelText('Preço mínimo'), '10')
    await user.type(screen.getByLabelText('Preço máximo'), '20')

    expect(onChange).toHaveBeenLastCalledWith({
      category_id: 3,
      flavor_id: 5,
      min_price: '10',
      max_price: '20',
    })
  })

  it('has no text search of its own', () => {
    render(<Harness onChange={vi.fn()} />)

    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })
})
