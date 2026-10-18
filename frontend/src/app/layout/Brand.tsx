import { Link } from 'react-router'

export function BrandMark() {
  return (
    <svg className="brand__mark" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="currentColor" />
      <path
        d="M11 24.5c-1.6-6.4 3.7-9.9 7.3-9 0-4.5 3.4-7.3 6.2-7.3s6.3 2.8 6.3 7.3c3.6-.9 8.9 2.6 7.3 9z"
        fill="#faf6f0"
        opacity=".9"
      />
      <rect x="10.5" y="23.6" width="27" height="2.6" rx="1.3" fill="#dcc394" />
      <path d="M13 27.2h22l-3.2 12.6H16.2z" fill="#faf6f0" />
      <circle cx="24.6" cy="8.6" r="2.6" fill="#dcc394" />
    </svg>
  )
}

export function Brand({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <Link to="/" className={`brand brand--${tone}`} aria-label="Cupcakes Gourmet, página inicial">
      <BrandMark />
      <span className="brand__text">
        <span className="brand__name">Cupcakes Gourmet</span>
        <span className="brand__tagline">Maison de confeitaria</span>
      </span>
    </Link>
  )
}
