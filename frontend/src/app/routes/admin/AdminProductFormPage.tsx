import { useNavigate, useParams } from 'react-router'

import { ProductEditor } from '@/features/catalog/components/admin/ProductEditor'
import { ProductForm } from '@/features/catalog/components/admin/ProductForm'

export function AdminProductFormPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const backToList = () => navigate('/admin/produtos')

  return (
    <section className="stack" aria-labelledby="admin-product-form-heading">
      <h2 id="admin-product-form-heading">{productId ? 'Editar produto' : 'Novo produto'}</h2>
      {productId ? (
        <ProductEditor productId={Number(productId)} onSaved={backToList} />
      ) : (
        <ProductForm onSaved={backToList} />
      )}
    </section>
  )
}
