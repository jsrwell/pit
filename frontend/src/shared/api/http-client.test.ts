import { ApiError } from './api-error'
import { request } from './http-client'

function respondWith(body: string, status: number, contentType: string): void {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(body, { status, headers: { 'Content-Type': contentType } }),
  )
}

describe('request', () => {
  it('returns the parsed body on success', async () => {
    respondWith(JSON.stringify({ status: 'ok' }), 200, 'application/json')

    await expect(request('/health')).resolves.toEqual({ status: 'ok' })
    expect(fetch).toHaveBeenCalledWith('/api/health', expect.anything())
  })

  it('throws an ApiError carrying the problem details', async () => {
    const problem = { type: 'urn:x', title: 'Invalid request', status: 422, code: 'CS-SYS-0002' }
    respondWith(JSON.stringify(problem), 422, 'application/problem+json')

    const error = await request('/health').catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      code: 'CS-SYS-0002',
      message: 'Alguns campos estão inválidos. Revise e tente novamente.',
    })
  })

  it('throws a network ApiError when the server is unreachable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(request('/health')).rejects.toMatchObject({ code: 'CS-NET-0001', status: 0 })
  })

  it('falls back to an unexpected error when the body is not a problem', async () => {
    respondWith('<html>Bad gateway</html>', 502, 'text/html')

    await expect(request('/health')).rejects.toMatchObject({ code: 'CS-SYS-0001', status: 502 })
  })
})
