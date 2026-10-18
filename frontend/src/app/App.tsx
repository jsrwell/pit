import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { AdminLayout } from './layout/AdminLayout'
import { AppLayout } from './layout/AppLayout'
import { AccountPage } from './routes/AccountPage'
import { CartPage } from './routes/CartPage'
import { CheckoutPage } from './routes/CheckoutPage'
import { AdminCustomOrdersPage } from './routes/admin/AdminCustomOrdersPage'
import { AdminOrdersPage } from './routes/admin/AdminOrdersPage'
import { AdminPromotionsPage } from './routes/admin/AdminPromotionsPage'
import { AdminProductFormPage } from './routes/admin/AdminProductFormPage'
import { AdminProductsPage } from './routes/admin/AdminProductsPage'
import { CustomOrdersPage } from './routes/CustomOrdersPage'
import { HomePage } from './routes/HomePage'
import { LoginPage } from './routes/LoginPage'
import { NotFoundPage } from './routes/NotFoundPage'
import { OrderPage } from './routes/OrderPage'
import { OrdersPage } from './routes/OrdersPage'
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
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="pedidos" element={<OrdersPage />} />
            <Route path="pedidos/:orderId" element={<OrderPage />} />
            <Route path="encomendas" element={<CustomOrdersPage />} />
          </Route>
          <Route element={<RequireAuth role="admin" />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="pedidos" replace />} />
              <Route path="produtos" element={<AdminProductsPage />} />
              <Route path="produtos/novo" element={<AdminProductFormPage />} />
              <Route path="produtos/:productId" element={<AdminProductFormPage />} />
              <Route path="pedidos" element={<AdminOrdersPage />} />
              <Route path="encomendas" element={<AdminCustomOrdersPage />} />
              <Route path="promocoes" element={<AdminPromotionsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
