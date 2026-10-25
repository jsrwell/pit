import { formatPhone, isValidPhone, nextPhoneDigits, phoneDigits } from './phone'

describe('phone format', () => {
  it('applies the mask while the number is typed', () => {
    expect(formatPhone('1')).toBe('(1')
    expect(formatPhone('119876')).toBe('(11) 9876')
    expect(formatPhone('1134567890')).toBe('(11) 3456-7890')
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
  })

  it('keeps only digits up to eleven', () => {
    expect(phoneDigits('(11) 9a8765-43210')).toBe('11987654321')
  })

  it('accepts mobiles and landlines with area code only', () => {
    expect(isValidPhone('(11) 98765-4321')).toBe(true)
    expect(isValidPhone('(11) 3456-7890')).toBe(true)
    expect(isValidPhone('98765-4321')).toBe(false)
    expect(isValidPhone('(01) 98765-4321')).toBe(false)
  })

  it('erases a digit when backspace only hits a mask character', () => {
    expect(nextPhoneDigits('119', '(11)9')).toBe('11')
    expect(nextPhoneDigits('119', '(11) 98')).toBe('1198')
  })
})
