import { render, screen } from '@testing-library/react'

import { TextField } from './TextField'

describe('TextField', () => {
  it('applies the limit and shows the counter only on request', () => {
    render(
      <>
        <TextField id="a" label="Rua" maxLength={120} value="Rua A" onChange={() => undefined} />
        <TextField
          id="b"
          label="Referência"
          maxLength={120}
          showCounter
          value="Perto da praça"
          onChange={() => undefined}
        />
      </>,
    )

    expect(screen.getByLabelText('Rua')).toHaveAttribute('maxlength', '120')
    expect(screen.getByLabelText('Rua')).not.toHaveAccessibleDescription()
    expect(screen.getByLabelText('Referência')).toHaveAccessibleDescription(
      '106 caracteres restantes',
    )
  })
})
