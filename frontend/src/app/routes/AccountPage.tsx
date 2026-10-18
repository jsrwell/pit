import { AccountOverview } from '@/features/accounts/components/AccountOverview'

export function AccountPage() {
  return (
    <div className="container page stack">
      <div className="page-title">
        <span className="eyebrow">Minha conta</span>
        <h1>Sua área pessoal</h1>
        <p>Acompanhe seus dados, endereços e pedidos.</p>
      </div>
      <AccountOverview />
    </div>
  )
}
