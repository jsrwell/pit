import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { AdminLayout } from './layout/AdminLayout'
import { AppLayout } from './layout/AppLayout'
import { AccountPage } from './routes/AccountPage'
import { CartPage } from './routes/CartPage'
import { AdminProductFormPage } from './routes/admin/AdminProductFormPage'
import { AdminProductsPage } from './routes/admin/AdminProductsPage'
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
            <Route path="carrinho" element={<CartPage />} />
          </Route>
          <Route element={<RequireAuth role="admin" />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="produtos" replace />} />
              <Route path="produtos" element={<AdminProductsPage />} />
              <Route path="produtos/novo" element={<AdminProductFormPage />} />
              <Route path="produtos/:productId" element={<AdminProductFormPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
