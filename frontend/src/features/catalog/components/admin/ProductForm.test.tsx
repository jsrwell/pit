import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ApiError } from '@/shared/api/api-error'

import * as adminApi from '../../api/admin-products'
import * as classificationsApi from '../../api/list-classifications'
import { ProductForm } from './ProductForm'

const saved: adminApi.AdminProduct = {
  id: 9,
  name: 'Cupcake de Avelã',
  price: '19.90',
  image_id: 5,
  category: { id: 1, name: 'Gourmet' },
  flavor: { id: 1, name: 'Avelã' },
  is_available: true,
  is_featured: false,
  is_active: true,
  description: 'Massa de avelã.',
  composition: 'Farinha, avelã.',
  highlights: ['Avelã piemontesa'],
  created_at: '2026-10-18T12:00:00Z',
  updated_at: '2026-10-18T12:00:00Z',
}

describe('ProductForm', () => {
  beforeEach(() => {
    vi.spyOn(classificationsApi, 'listCategories').mockResolvedValue([])
    vi.spyOn(classificationsApi, 'listFlavors').mockResolvedValue([])
  })

  it('uploads the image and creates the product with every field', async () => {
    vi.spyOn(adminApi, 'uploadImage').mockResolvedValue({ id: 5, content_type: 'image/png' })
    const create = vi.spyOn(adminApi, 'createProduct').mockResolvedValue(saved)
    const onSaved = vi.fn()
    const user = userEvent.setup()

    render(<ProductForm onSaved={onSaved} />)
    await user.upload(
      screen.getByLabelText('Imagem (PNG, JPEG ou WebP)'),
      new File(['png'], 'cupcake.png', { type: 'image/png' }),
    )
    await user.type(screen.getByLabelText('Nome'), 'Cupcake de Avelã')
    await user.type(screen.getByLabelText('Categoria'), 'Gourmet')
    await user.type(screen.getByLabelText('Sabor'), 'Avelã')
    await user.type(screen.getByLabelText('Preço (R$)'), '19.90')
    await user.type(screen.getByLabelText('Descrição'), 'Massa de avelã.')
    await user.type(screen.getByLabelText('Composição'), 'Farinha, avelã.')
    await user.type(screen.getByLabelText('Diferenciais'), 'Avelã piemontesa')
    await user.click(screen.getByLabelText('Disponível para compra'))
    await user.click(screen.getByRole('button', { name: 'Salvar produto' }))

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Cupcake de Avelã',
        category_name: 'Gourmet',
        price: '19.9',
        image_id: 5,
        highlights: ['Avelã piemontesa'],
        is_active: true,
        is_available: false,
      }),
    )
    expect(onSaved).toHaveBeenCalledWith(saved)
  })

  it('explains why an incomplete product cannot be published', async () => {
    vi.spyOn(adminApi, 'updateProduct').mockRejectedValue(
      new ApiError({ type: 'urn:x', title: 'Incomplete', status: 422, code: 'CS-CAT-0004' }),
    )
    const user = userEvent.setup()

    render(<ProductForm product={{ ...saved, image_id: null }} onSaved={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Salvar produto' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'informe descrição, composição e imagem',
    )
  })
})
