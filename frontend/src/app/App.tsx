import { BrowserRouter, Route, Routes } from 'react-router'

import { AppLayout } from './layout/AppLayout'
import { AccountPage } from './routes/AccountPage'
import { HomePage } from './routes/HomePage'
import { LoginPage } from './routes/LoginPage'
import { NotFoundPage } from './routes/NotFoundPage'
import { ProductPage } from './routes/ProductPage'
import { RegisterPage } from './routes/RegisterPage'
import { RequireAuth } from './routes/RequireAuth'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="produtos/:productId" element={<ProductPage />} />
          <Route path="cadastro" element={<RegisterPage />} />
          <Route path="entrar" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="conta" element={<AccountPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
