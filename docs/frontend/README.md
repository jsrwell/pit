---
code: "FE-00"
name: "Documentação do frontend"
updated: "2026/10/25"
---

# Documentação do frontend

SPA da Loja Virtual de Cupcakes Gourmet, em React e TypeScript com Vite. Implementa a View do MVC: apresenta a loja ao cliente e o painel de gestão ao administrador, conversando com o backend apenas pela API REST.

## Funcionalidades entregues

| Área                       | O que o usuário faz                                                     | Cartões          | Documento                                               |
| -------------------------- | ----------------------------------------------------------------------- | ---------------- | ------------------------------------------------------- |
| Vitrine                    | Explora destaques, combos e o catálogo; filtra, busca e favorita        | US01, US02, US16, IMP02 | [Jornada do cliente](journeys/01_customer_journey.md)   |
| Produto                    | Vê detalhes, composição e diferenciais e adiciona ao carrinho           | US03, US06       | [Jornada do cliente](journeys/01_customer_journey.md)   |
| Conta                      | Cria conta, entra, mantém dados e endereços                             | US04, US05, US09 | [Jornada do cliente](journeys/01_customer_journey.md)   |
| Compra                     | Ajusta o carrinho, escolhe recebimento e pagamento, aplica cupom e confirma | US06, US07, US08, US10, IMP06 | [Jornada do cliente](journeys/01_customer_journey.md) |
| Pós-compra                 | Acompanha pedidos, solicita encomendas especiais e fala com a loja      | US11, US12, IMP05 | [Jornada do cliente](journeys/01_customer_journey.md)   |
| Painel da loja             | Opera pedidos, analisa encomendas, mantém catálogo, disponibilidade e promoções | US12 a US16 | [Painel administrativo](journeys/02_admin_panel.md)   |

## Índice

| Código    | Documento                                                                      |
| --------- | ------------------------------------------------------------------------------ |
| FE-ARCH   | [Arquitetura do frontend](ARCHITECTURE.md)                                     |
| FE-UI-01  | [Identidade visual](design-system/01_visual_identity.md)                       |
| FE-UI-02  | [Layout e componentes](design-system/02_layout_and_components.md)              |
| FE-JRN-01 | [Jornada do cliente](journeys/01_customer_journey.md)                          |
| FE-JRN-02 | [Painel administrativo](journeys/02_admin_panel.md)                            |
| FE-STA-01 | [Sessão e cliente HTTP](state/01_session_and_api_client.md)                    |
| FE-STA-02 | [Estado do carrinho e composição de features](state/02_cart_and_feature_composition.md) |
| FE-OPS-01 | [Build e publicação](operations/01_build_and_deployment.md)                    |
| FE-QA-01  | [Testes e rastreabilidade](quality/01_test_strategy_and_traceability.md)       |
