import { Link } from 'react-router'

import { AsyncContent } from '@/shared/components/AsyncContent'
import { formatPrice } from '@/shared/format/currency'
import { useAsync } from '@/shared/hooks/use-async'

import { listAdminProducts } from '../../api/admin-products'
import { ProductImage } from '../ProductImage'

import '../catalog.css'

export function AdminProductList() {
  const { state } = useAsync(listAdminProducts)

  return (
    <AsyncContent state={state} loadingLabel="Carregando produtos...">
      {(products) => (
        <div className="table-wrap panel">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Produto</th>
                <th scope="col">Categoria</th>
                <th scope="col">Preço</th>
                <th scope="col">Situação</th>
                <th scope="col">
                  <span className="visually-hidden">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-cell">
                      <ProductImage
                        imageId={product.image_id}
                        name={product.name}
                        className="admin-thumb"
                      />
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td>{product.category.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <div className="row">
                      {product.is_active ? (
                        <span className="badge badge--success">Ativo</span>
                      ) : (
                        <span className="badge">Inativo</span>
                      )}
                      {!product.is_available && (
                        <span className="badge badge--muted">Indisponível</span>
                      )}
                      {product.is_featured && <span className="badge badge--gold">Destaque</span>}
                    </div>
                  </td>
                  <td>
                    <Link
                      to={`/admin/produtos/${product.id}`}
                      className="button button--ghost button--small"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AsyncContent>
  )
}
