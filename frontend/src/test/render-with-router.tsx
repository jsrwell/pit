import { render, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

interface RouterOptions {
  path?: string
  route?: string
}

export function renderWithRouter(
  ui: ReactElement,
  { path = '/', route = '/' }: RouterOptions = {},
): RenderResult {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
        <Route path="*" element={<p>Outra página</p>} />
      </Routes>
    </MemoryRouter>,
  )
}
