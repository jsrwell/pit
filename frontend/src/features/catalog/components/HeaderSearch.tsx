import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import {
  SEARCH_MAX_LENGTH,
  storefrontSearchUrl,
  useStorefrontSearch,
} from '../hooks/use-storefront-search'

import './catalog.css'

interface HeaderSearchProps {
  onSearched?: () => void
}

export function HeaderSearch({ onSearched }: HeaderSearchProps) {
  const navigate = useNavigate()
  const [activeTerm] = useStorefrontSearch()
  const [typed, setTyped] = useState(activeTerm)

  useEffect(() => {
    setTyped(activeTerm)
  }, [activeTerm])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(storefrontSearchUrl(typed))
    onSearched?.()
  }

  return (
    <form
      className="header-search"
      role="search"
      aria-label="Buscar na loja"
      onSubmit={handleSubmit}
    >
      <label htmlFor="header-search" className="visually-hidden">
        Buscar cupcakes
      </label>
      <input
        id="header-search"
        type="search"
        placeholder="Buscar cupcakes"
        autoComplete="off"
        enterKeyHint="search"
        maxLength={SEARCH_MAX_LENGTH}
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
      />
      <button type="submit" aria-label="Buscar">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
        </svg>
      </button>
    </form>
  )
}
