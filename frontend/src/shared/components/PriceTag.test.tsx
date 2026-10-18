import { render, screen } from '@testing-library/react'

import { PriceTag } from './PriceTag'

describe('PriceTag', () => {
  it('shows the regular price struck through while a campaign runs', () => {
    render(<PriceTag price="20.00" promotionalPrice="15.00" />)

    expect(screen.getByLabelText(/^De R\$/)).toHaveTextContent('20,00')
    expect(screen.getByLabelText(/^Por R\$/)).toHaveTextContent('15,00')
  })

  it('shows only the regular price without a campaign', () => {
    render(<PriceTag price="20.00" promotionalPrice={null} />)

    expect(screen.getByText(/20,00/)).toBeInTheDocument()
    expect(screen.queryByLabelText(/^Por/)).not.toBeInTheDocument()
  })
})
