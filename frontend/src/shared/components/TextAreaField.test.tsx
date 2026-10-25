import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { TextAreaField } from './TextAreaField'

function Harness({ maxLength }: { maxLength?: number }) {
  const [value, setValue] = useState('')
  return (
    <TextAreaField
      id="notes"
      label="Observações"
      hint="Opcional."
      maxLength={maxLength}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  )
}

describe('TextAreaField', () => {
  it('counts the remaining characters and stops at the limit', async () => {
    const user = userEvent.setup()
    render(<Harness maxLength={12} />)
    const field = screen.getByLabelText('Observações')

    expect(field).toHaveAccessibleDescription('Opcional. 12 caracteres restantes')
    await user.type(field, 'Bolo de cenoura')

    expect(field).toHaveValue('Bolo de ceno')
    expect(screen.getByText('0 caracteres restantes')).toHaveClass('field-counter--near')
  })

  it('shows no counter without a limit', () => {
    render(<Harness />)

    expect(screen.queryByText(/restantes/)).not.toBeInTheDocument()
  })
})
