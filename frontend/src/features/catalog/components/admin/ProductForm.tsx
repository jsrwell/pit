import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

import { ApiError } from '@/shared/api/api-error'
import { ErrorMessage } from '@/shared/components/ErrorMessage'
import { TextAreaField } from '@/shared/components/TextAreaField'
import { TextField } from '@/shared/components/TextField'
import { useSubmit } from '@/shared/hooks/use-submit'

import {
  createProduct,
  updateProduct,
  uploadImage,
  type AdminProduct,
  type ProductInput,
} from '../../api/admin-products'
import { listCategories, listFlavors } from '../../api/list-classifications'
import type { NamedItem } from '../../api/product'
import { ProductImage } from '../ProductImage'

import '../catalog.css'

interface ProductFormProps {
  product?: AdminProduct
  onSaved: (product: AdminProduct) => void
}

type FormValues = Omit<ProductInput, 'highlights'> & { highlights: string }

function initialValues(product?: AdminProduct): FormValues {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    composition: product?.composition ?? '',
    highlights: product?.highlights.join('\n') ?? '',
    price: product?.price ?? '',
    category_name: product?.category.name ?? '',
    flavor_name: product?.flavor.name ?? '',
    image_id: product?.image_id ?? null,
    is_active: product?.is_active ?? true,
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
  }
}

function toInput(values: FormValues): ProductInput {
  return { ...values, highlights: values.highlights.split('\n') }
}

export function ProductForm({ product, onSaved }: ProductFormProps) {
  const [values, setValues] = useState<FormValues>(() => initialValues(product))
  const [categories, setCategories] = useState<NamedItem[]>([])
  const [flavors, setFlavors] = useState<NamedItem[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const save = useSubmit((input: ProductInput) =>
    product ? updateProduct(product.id, input) : createProduct(input),
  )

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
    listFlavors()
      .then(setFlavors)
      .catch(() => setFlavors([]))
  }, [])

  function update<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const image = await uploadImage(file)
      update('image_id', image.id)
    } catch (error: unknown) {
      setUploadError(ApiError.from(error).message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const saved = await save.submit(toInput(values))
    if (saved !== null) onSaved(saved)
  }

  return (
    <form className="form panel product-form" onSubmit={handleSubmit} noValidate>
      {save.error && <ErrorMessage message={save.error} />}
      <div className="product-form__layout">
        <div className="product-form__image">
          <div className="product-form__preview">
            <ProductImage imageId={values.image_id} name={values.name || 'Pré-visualização'} />
          </div>
          <div className="field">
            <label htmlFor="product-image">Imagem (PNG, JPEG ou WebP)</label>
            <input
              id="product-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImage}
            />
            {uploading && (
              <span role="status" className="field-hint">
                Enviando imagem...
              </span>
            )}
            {uploadError && <span className="field-error">{uploadError}</span>}
          </div>
        </div>
        <div className="form">
          <TextField
            id="product-name"
            label="Nome"
            value={values.name}
            error={save.fields.name}
            onChange={(event) => update('name', event.target.value)}
          />
          <div className="form-grid">
            <TextField
              id="product-category"
              label="Categoria"
              list="product-category-options"
              value={values.category_name}
              error={save.fields.category_name}
              onChange={(event) => update('category_name', event.target.value)}
            />
            <TextField
              id="product-flavor"
              label="Sabor"
              list="product-flavor-options"
              value={values.flavor_name}
              error={save.fields.flavor_name}
              onChange={(event) => update('flavor_name', event.target.value)}
            />
            <TextField
              id="product-price"
              label="Preço (R$)"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={values.price}
              error={save.fields.price}
              onChange={(event) => update('price', event.target.value)}
            />
          </div>
          <datalist id="product-category-options">
            {categories.map((category) => (
              <option key={category.id} value={category.name} />
            ))}
          </datalist>
          <datalist id="product-flavor-options">
            {flavors.map((flavor) => (
              <option key={flavor.id} value={flavor.name} />
            ))}
          </datalist>
          <TextAreaField
            id="product-description"
            label="Descrição"
            value={values.description}
            error={save.fields.description}
            onChange={(event) => update('description', event.target.value)}
          />
          <TextAreaField
            id="product-composition"
            label="Composição"
            value={values.composition}
            error={save.fields.composition}
            onChange={(event) => update('composition', event.target.value)}
          />
          <TextAreaField
            id="product-highlights"
            label="Diferenciais"
            hint="Um diferencial por linha."
            value={values.highlights}
            onChange={(event) => update('highlights', event.target.value)}
          />
          <fieldset className="product-form__flags">
            <legend className="visually-hidden">Situação do produto</legend>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={values.is_active}
                onChange={(event) => update('is_active', event.target.checked)}
              />
              Ativo na vitrine
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={values.is_available}
                onChange={(event) => update('is_available', event.target.checked)}
              />
              Disponível para compra
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={values.is_featured}
                onChange={(event) => update('is_featured', event.target.checked)}
              />
              Destaque na vitrine
            </label>
          </fieldset>
          <p className="field-hint">
            Para publicar (ativo), o produto precisa de descrição, composição e imagem.
          </p>
          <div className="row">
            <button type="submit" className="button" disabled={save.submitting || uploading}>
              {save.submitting ? 'Salvando...' : 'Salvar produto'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
