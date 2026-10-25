import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'

import { HeaderSearch } from './HeaderSearch'

function CurrentLocation() {
  const location = useLocation()
  return <p data-testid="location">{`${location.pathname}${location.search}`}</p>
}

function renderAt(route: string, onSearched = vi.fn()) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <HeaderSearch onSearched={onSearched} />
      <Routes>
        <Route path="*" element={<CurrentLocation />} />
      </Routes>
    </MemoryRouter>,
  )
  return onSearched
}

describe('HeaderSearch', () => {
  it('is a search region that leads any page to the filtered storefront', async () => {
    const user = userEvent.setup()
    const onSearched = renderAt('/pedidos')

    expect(screen.getByRole('search', { name: 'Buscar na loja' })).toBeInTheDocument()
    await user.type(screen.getByRole('searchbox', { name: 'Buscar cupcakes' }), ' red velvet ')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(screen.getByTestId('location')).toHaveTextContent('/?busca=red+velvet')
    expect(onSearched).toHaveBeenCalled()
  })

  it('shows the active term and goes back to the full storefront when emptied', async () => {
    const user = userEvent.setup()
    renderAt('/?busca=trufa')
    const field = screen.getByRole('searchbox', { name: 'Buscar cupcakes' })

    expect(field).toHaveValue('trufa')
    await user.clear(field)
    await user.keyboard('{Enter}')

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
  })
})
