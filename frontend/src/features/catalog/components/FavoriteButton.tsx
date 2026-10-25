import { favoritesStore, useFavorites } from '../hooks/favorites-store'

interface FavoriteButtonProps {
  productId: number
  productName: string
  className?: string
}

export function FavoriteButton({ productId, productName, className = '' }: FavoriteButtonProps) {
  const favorite = useFavorites().includes(productId)
  const label = favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'

  return (
    <button
      type="button"
      className={`favorite-button ${className}`}
      aria-pressed={favorite}
      aria-label={`${label}: ${productName}`}
      title={label}
      onClick={() => favoritesStore.toggle(productId)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 20.3 4.6 13a4.9 4.9 0 0 1 0-7 4.9 4.9 0 0 1 7 0l.4.4.4-.4a4.9 4.9 0 0 1 7 0 4.9 4.9 0 0 1 0 7z" />
      </svg>
    </button>
  )
}
