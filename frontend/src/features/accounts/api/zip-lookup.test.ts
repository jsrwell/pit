import { formatZip, lookupZip } from './zip-lookup'

function respondWith(body: unknown, status = 200): void {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
}

describe('lookupZip', () => {
  it('asks ViaCEP for the digits only and returns street and district', async () => {
    respondWith({ logradouro: 'Avenida Paulista', bairro: 'Bela Vista', localidade: 'São Paulo' })

    await expect(lookupZip('01310-100')).resolves.toEqual({
      street: 'Avenida Paulista',
      district: 'Bela Vista',
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/01310100/json/',
      expect.not.objectContaining({
        headers: expect.objectContaining({ Authorization: expect.anything() }),
      }),
    )
  })

  it('returns nothing for an unknown CEP', async () => {
    respondWith({ erro: 'true' })

    await expect(lookupZip('99999999')).resolves.toBeNull()
  })

  it('fails as a network error when the service is unreachable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(lookupZip('01310100')).rejects.toMatchObject({ code: 'CS-NET-0001' })
  })
})

describe('formatZip', () => {
  it('keeps eight digits with the hyphen', () => {
    expect(formatZip('01310')).toBe('01310')
    expect(formatZip('013101009')).toBe('01310-100')
    expect(formatZip('01.310-1a0')).toBe('01310-10')
  })
})
