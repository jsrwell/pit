import { Storefront } from '@/features/catalog/components/Storefront'

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <span className="eyebrow">Confeitaria artesanal de luxo</span>
          <h1>
            A arte da confeitaria em <em>cada detalhe</em>
          </h1>
          <p>
            Cupcakes autorais preparados à mão, com chocolate belga, baunilha de Madagascar e frutas
            selecionadas. Retire na loja ou receba em casa.
          </p>
          <div className="row">
            <a href="#vitrine" className="button button--gold">
              Explorar a vitrine
            </a>
          </div>
        </div>
      </section>
      <div id="vitrine" className="container page">
        <Storefront />
      </div>
    </>
  )
}
