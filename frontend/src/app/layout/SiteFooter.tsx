import { Link } from 'react-router'

import { ApiStatus } from '@/features/system/components/ApiStatus'
import { env } from '@/shared/config/env'

import { Brand } from './Brand'
import { ContactChannels } from './ContactChannels'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__about">
          <Brand tone="light" />
          <p>
            Confeitaria artesanal de luxo. Cupcakes autorais preparados à mão todos os dias, com
            ingredientes nobres e acabamento impecável.
          </p>
        </div>
        <nav className="site-footer__column" aria-label="Loja">
          <h2>Loja</h2>
          <Link to="/">Vitrine</Link>
          <Link to="/encomendas">Encomendas especiais</Link>
          <Link to="/carrinho">Carrinho</Link>
        </nav>
        <nav className="site-footer__column" aria-label="Sua conta">
          <h2>Sua conta</h2>
          <Link to="/conta">Minha conta</Link>
          <Link to="/pedidos">Meus pedidos</Link>
          <Link to="/cadastro">Criar conta</Link>
        </nav>
        <section
          className="site-footer__column site-footer__contact"
          aria-labelledby="footer-contact"
        >
          <h2 id="footer-contact">Atendimento</h2>
          <ContactChannels />
          <p className="site-footer__note">Retirada na loja ou entrega no seu endereço.</p>
        </section>
      </div>
      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} Cupcakes Gourmet · Projeto acadêmico</p>
        <div className="site-footer__status">
          <ApiStatus />
          <span>App {env.appVersion}</span>
        </div>
      </div>
    </footer>
  )
}
