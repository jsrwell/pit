import { Link } from 'react-router'

import { AddBundleToCart } from '@/features/cart/components/AddBundleToCart'
import { AddToCart } from '@/features/cart/components/AddToCart'
import { Storefront } from '@/features/catalog/components/Storefront'
import { ComboShowcase } from '@/features/promotions/components/ComboShowcase'

import { HeroArt } from './HeroArt'

const PROMISES = ['Feito à mão todos os dias', 'Retirada ou entrega', 'Encomendas sob medida']

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="eyebrow">Confeitaria artesanal de luxo</span>
            <h1>
              A arte da confeitaria em <em>cada detalhe</em>
            </h1>
            <p>
              Cupcakes autorais preparados à mão, com chocolate belga, baunilha de Madagascar e
              frutas selecionadas. Retire na loja ou receba em casa.
            </p>
            <div className="hero__actions">
              <a href="#vitrine" className="button button--gold">
                Explorar a vitrine
              </a>
              <Link to="/encomendas" className="button button--outline-light">
                Encomendas especiais
              </Link>
            </div>
            <ul className="hero__promises">
              {PROMISES.map((promise) => (
                <li key={promise}>{promise}</li>
              ))}
            </ul>
          </div>
          <HeroArt />
        </div>
      </section>
      <div className="container home-combos">
        <ComboShowcase
          renderAction={(combo) => <AddBundleToCart name={combo.name} items={combo.items} />}
        />
      </div>
      <div id="vitrine" className="container page">
        <Storefront
          renderProductAction={(product) => (
            <AddToCart
              productId={product.id}
              productName={product.name}
              available={product.is_available}
            />
          )}
        />
      </div>
    </>
  )
}
