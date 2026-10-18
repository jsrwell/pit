import { BrowserRouter, Route, Routes } from 'react-router'

import { AppLayout } from './layout/AppLayout'
import { HomePage } from './routes/HomePage'
import { NotFoundPage } from './routes/NotFoundPage'
import { ProductPage } from './routes/ProductPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="produtos/:productId" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
