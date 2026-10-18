import { productImageUrl } from '@/shared/api/product-image-url'

interface ProductImageProps {
  imageId: number | null
  name: string
  className?: string
}

export function ProductImage({ imageId, name, className = '' }: ProductImageProps) {
  if (imageId === null) {
    return <div className={`product-image product-image--empty ${className}`} aria-hidden="true" />
  }
  return (
    <img
      className={`product-image ${className}`}
      src={productImageUrl(imageId)}
      alt={name}
      loading="lazy"
    />
  )
}
