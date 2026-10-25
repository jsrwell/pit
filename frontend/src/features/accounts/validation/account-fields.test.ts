import { validateContact } from './account-fields'

const valid = { name: 'Ana Souza', email: 'ana@example.com', phone: '11987654321' }

describe('validateContact', () => {
  it('accepts a complete contact', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it.each(['ana.example.com', 'ana@', '@example.com', 'ana @example.com'])(
    'refuses the e-mail %s',
    (email) => {
      expect(validateContact({ ...valid, email }).email).toMatch(/e-mail válido/)
    },
  )

  it('refuses a phone without area code', () => {
    expect(validateContact({ ...valid, phone: '987654321' }).phone).toMatch(/DDD/)
  })
})
