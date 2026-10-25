import { screen, within } from '@testing-library/react'

import * as healthApi from '@/features/system/api/get-health'
import { renderWithRouter } from '@/test/render-with-router'

import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  beforeEach(() => {
    vi.spyOn(healthApi, 'getHealth').mockResolvedValue({ status: 'ok', version: '1.0.0' })
  })

  it('offers WhatsApp, phone and e-mail as actionable links', () => {
    renderWithRouter(<SiteFooter />)
    const service = screen.getByRole('region', { name: 'Atendimento' })

    const whatsapp = within(service).getByRole('link', { name: /WhatsApp/ })
    expect(whatsapp).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/wa\.me\/55\d+\?text=/),
    )
    expect(decodeURIComponent(whatsapp.getAttribute('href') ?? '')).toContain('Olá!')
    expect(whatsapp).toHaveAttribute('target', '_blank')
    expect(within(service).getByRole('link', { name: /Ligar para a loja/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/^tel:\+55\d{10,11}$/),
    )
    expect(within(service).getByRole('link', { name: /Enviar e-mail/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:.+@.+/),
    )
  })
})
