import { Link } from 'react-router'

import { AdminProductList } from '@/features/catalog/components/admin/AdminProductList'

export function AdminProductsPage() {
  return (
    <section className="stack" aria-labelledby="admin-products-heading">
      <div className="row row--between">
        <h2 id="admin-products-heading">Catálogo</h2>
        <Link to="/admin/produtos/novo" className="button">
          Novo produto
        </Link>
      </div>
      <AdminProductList />
    </section>
  )
}
