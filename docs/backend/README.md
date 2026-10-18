---
code: "BE-00"
name: "Documentação do backend"
updated: "2026/10/18"
---

# Documentação do backend

API REST da Loja Virtual de Cupcakes Gourmet, em Python 3.13 com FastAPI, SQLAlchemy e PostgreSQL. Implementa o Model e o Controller do MVC e é organizada como monolito modular.

## Funcionalidades entregues

| Funcionalidade                                   | Cartões          | Documento                                                          |
| ------------------------------------------------ | ---------------- | ------------------------------------------------------------------ |
| Vitrine com destaques, filtros, busca e detalhe  | US01, US02, US03 | [Vitrine, busca e detalhe](catalog/01_storefront_and_search.md)    |
| Cadastro de clientes                             | US04             | [Cadastro de clientes](accounts/01_customer_registration.md)       |
| Login com sessão expirável e bloqueio            | US05             | [Desenho da autenticação](authentication/01_authentication_design.md) |
| Carrinho com recálculo e combos                  | US06, US07       | [Carrinho e precificação](cart/01_cart_and_pricing.md)             |
| Retirada ou entrega com taxa                     | US08             | [Modalidade e cotação](orders/01_fulfillment_and_quote.md)         |
| Endereços com principal                          | US09             | [Endereços de entrega](accounts/02_delivery_addresses.md)          |
| Checkout com Pix, cartão ou dinheiro             | US10             | [Checkout e pagamento](orders/02_checkout_and_payment.md)          |
| Acompanhamento com histórico de status           | US11             | [Ciclo de vida do pedido](orders/03_order_lifecycle.md)            |
| Encomendas especiais com aprovação               | US12             | [Encomendas especiais](orders/04_custom_orders.md)                 |
| Gestão do catálogo com upload de imagens         | US13             | [Gestão do catálogo](catalog/02_catalog_management.md)             |
| Disponibilidade propagada à loja e ao carrinho   | US14             | [Controle de disponibilidade](catalog/03_availability_control.md)  |
| Painel operacional com máquina de estados        | US15             | [Ciclo de vida do pedido](orders/03_order_lifecycle.md)            |
| Campanhas, destaques e combos                    | US16             | [Campanhas, destaques e combos](promotions/01_campaigns_featured_and_combos.md) |

## Índice

| Código      | Documento                                                                  |
| ----------- | -------------------------------------------------------------------------- |
| BE-ARCH     | [Arquitetura do backend](ARCHITECTURE.md)                                  |
| BE-API-01   | [Referência de endpoints](api/01_endpoint_reference.md)                   |
| BE-API-02   | [Catálogo de erros](api/02_error_catalog.md)                               |
| BE-DB-01    | [Modelo de dados](database/01_data_model.md)                               |
| BE-DB-02    | [Dicionário de dados](database/02_data_dictionary.md)                      |
| BE-DB-03    | [Dados iniciais](database/03_seed_data.md)                                 |
| BE-AUTH-01  | [Desenho da autenticação](authentication/01_authentication_design.md)      |
| BE-AUTH-02  | [Estratégia de segurança](authentication/02_security_strategy.md)          |
| BE-ACC-01   | [Cadastro de clientes](accounts/01_customer_registration.md)               |
| BE-ACC-02   | [Endereços de entrega](accounts/02_delivery_addresses.md)                  |
| BE-CAT-01   | [Vitrine, busca e detalhe do produto](catalog/01_storefront_and_search.md) |
| BE-CAT-02   | [Gestão do catálogo](catalog/02_catalog_management.md)                     |
| BE-CAT-03   | [Controle de disponibilidade](catalog/03_availability_control.md)          |
| BE-CRT-01   | [Carrinho e precificação](cart/01_cart_and_pricing.md)                     |
| BE-ORD-01   | [Modalidade de recebimento e cotação](orders/01_fulfillment_and_quote.md) |
| BE-ORD-02   | [Checkout e pagamento](orders/02_checkout_and_payment.md)                  |
| BE-ORD-03   | [Ciclo de vida e acompanhamento do pedido](orders/03_order_lifecycle.md)   |
| BE-ORD-04   | [Encomendas especiais](orders/04_custom_orders.md)                         |
| BE-PRM-01   | [Campanhas, destaques e combos](promotions/01_campaigns_featured_and_combos.md) |
| BE-OPS-01   | [Configuração do backend](operations/01_configuration.md)                  |
| BE-OPS-02   | [Publicação no Render](operations/02_render_deployment.md)                 |
| BE-QA-01    | [Estratégia de testes](quality/01_test_strategy.md)                        |
| BE-QA-02    | [Rastreabilidade de requisitos](quality/02_requirements_traceability.md)   |
