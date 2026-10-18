import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="container page empty-state">
      <span className="eyebrow">Página não encontrada</span>
      <h1>Esta página não existe</h1>
      <Link to="/" className="button">
        Voltar à vitrine
      </Link>
    </div>
  )
}
