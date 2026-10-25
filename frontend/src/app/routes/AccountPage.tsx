import { Link, useNavigate } from 'react-router'

import { AccountOverview } from '@/features/accounts/components/AccountOverview'
import { AddressBook } from '@/features/accounts/components/AddressBook'
import { DeleteAccount } from '@/features/accounts/components/DeleteAccount'
import { PasswordForm } from '@/features/accounts/components/PasswordForm'

const SHORTCUTS = [
  { to: '/pedidos', title: 'Meus pedidos', text: 'Acompanhe o status e o histórico.' },
  { to: '/encomendas', title: 'Encomendas', text: 'Peça cupcakes sob medida para eventos.' },
  { to: '/carrinho', title: 'Carrinho', text: 'Revise os itens e finalize a compra.' },
]

export function AccountPage() {
  const navigate = useNavigate()

  return (
    <div className="container page">
      <div className="page-title">
        <span className="eyebrow">Minha conta</span>
        <h1>Sua área pessoal</h1>
        <p>Mantenha seus dados, endereços e senha em dia e acompanhe seus pedidos.</p>
      </div>
      <div className="stack stack--loose">
        <AccountOverview />
        <nav className="shortcut-grid" aria-label="Atalhos da conta">
          {SHORTCUTS.map((shortcut) => (
            <Link key={shortcut.to} to={shortcut.to} className="shortcut">
              <strong>{shortcut.title}</strong>
              <span>{shortcut.text}</span>
            </Link>
          ))}
        </nav>
        <AddressBook />
        <div className="account-settings">
          <PasswordForm />
          <DeleteAccount onDeleted={() => navigate('/', { replace: true })} />
        </div>
      </div>
    </div>
  )
}
