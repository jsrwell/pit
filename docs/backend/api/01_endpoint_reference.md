---
code: "BE-API-01"
name: "Referência de endpoints"
updated: "2026/10/18"
---

# Referência de endpoints

Todas as rotas ficam sob `/api`. A documentação interativa, gerada a partir do código, está em `/api/docs` e o contrato OpenAPI em `/api/openapi.json`; esta página é o mapa resumido para leitura.

Legenda de acesso: **Público** não exige sessão; **Cliente** exige `Authorization: Bearer <token>` de qualquer conta; **Admin** exige conta com papel `admin`.

## Sistema

| Método | Caminho   | Acesso  | Finalidade                                             |
| ------ | --------- | ------- | ------------------------------------------------------ |
| GET    | `/health` | Público | Verificação de vida e versão; não consulta o banco      |

## Catálogo (US01, US02, US03)

| Método | Caminho                          | Acesso  | Finalidade                                               |
| ------ | -------------------------------- | ------- | -------------------------------------------------------- |
| GET    | `/catalog/products`              | Público | Vitrine com filtros `category_id`, `flavor_id`, `min_price`, `max_price`, `search` |
| GET    | `/catalog/products/{product_id}` | Público | Detalhe com descrição, composição e diferenciais         |
| GET    | `/catalog/images/{image_id}`     | Público | Conteúdo binário da imagem, com cache imutável           |
| GET    | `/catalog/categories`            | Público | Opções de categoria para os filtros                      |
| GET    | `/catalog/flavors`               | Público | Opções de sabor para os filtros                          |

## Administração do catálogo (US13, US14, US16)

| Método | Caminho                                              | Acesso | Finalidade                                  |
| ------ | ---------------------------------------------------- | ------ | ------------------------------------------- |
| GET    | `/catalog/admin/products`                            | Admin  | Todos os produtos, inclusive inativos        |
| POST   | `/catalog/admin/products`                            | Admin  | Cadastro de produto                          |
| GET    | `/catalog/admin/products/{product_id}`               | Admin  | Produto em qualquer situação                 |
| PUT    | `/catalog/admin/products/{product_id}`               | Admin  | Edição completa e inativação                 |
| PATCH  | `/catalog/admin/products/{product_id}/availability`  | Admin  | Disponível ou indisponível e visibilidade    |
| PATCH  | `/catalog/admin/products/{product_id}/featured`      | Admin  | Destaque na vitrine                          |
| POST   | `/catalog/admin/images`                              | Admin  | Upload de imagem (multipart, campo `file`)   |

## Contas, sessão e endereços (US04, US05, US09)

| Método | Caminho                                        | Acesso  | Finalidade                         |
| ------ | ---------------------------------------------- | ------- | ---------------------------------- |
| POST   | `/accounts`                                    | Público | Cadastro de cliente                |
| POST   | `/accounts/sessions`                           | Público | Login; devolve token e conta       |
| GET    | `/accounts/me`                                 | Cliente | Dados da conta autenticada         |
| GET    | `/accounts/me/addresses`                       | Cliente | Endereços, principal primeiro      |
| POST   | `/accounts/me/addresses`                       | Cliente | Novo endereço                      |
| PUT    | `/accounts/me/addresses/{address_id}`          | Cliente | Edição de endereço                 |
| DELETE | `/accounts/me/addresses/{address_id}`          | Cliente | Exclusão de endereço               |
| POST   | `/accounts/me/addresses/{address_id}/primary`  | Cliente | Define o endereço principal        |

## Carrinho (US06, US07)

| Método | Caminho                     | Acesso  | Finalidade                                   |
| ------ | --------------------------- | ------- | -------------------------------------------- |
| GET    | `/cart`                     | Cliente | Carrinho com preços e disponibilidade atuais |
| POST   | `/cart/items`               | Cliente | Adiciona unidades de um produto              |
| PATCH  | `/cart/items/{product_id}`  | Cliente | Altera a quantidade de uma linha             |
| DELETE | `/cart/items/{product_id}`  | Cliente | Remove a linha                               |

## Pedidos (US08, US10, US11, US12)

| Método | Caminho              | Acesso  | Finalidade                                         |
| ------ | -------------------- | ------- | -------------------------------------------------- |
| POST   | `/orders/quote`      | Cliente | Total para retirada ou entrega, sem criar pedido   |
| POST   | `/orders`            | Cliente | Checkout: pagamento e criação do pedido            |
| GET    | `/orders`            | Cliente | Pedidos do cliente, mais recentes primeiro         |
| GET    | `/orders/{order_id}` | Cliente | Acompanhamento com histórico de status             |
| POST   | `/orders/custom`     | Cliente | Solicitação de encomenda especial                  |
| GET    | `/orders/custom`     | Cliente | Encomendas do cliente                              |

## Administração de pedidos (US12, US15)

| Método | Caminho                                              | Acesso | Finalidade                                     |
| ------ | ---------------------------------------------------- | ------ | ---------------------------------------------- |
| GET    | `/orders/admin`                                      | Admin  | Painel de pedidos, filtro opcional `status`    |
| GET    | `/orders/admin/{order_id}`                           | Admin  | Pedido com contato do cliente                  |
| PATCH  | `/orders/admin/{order_id}/status`                    | Admin  | Avança o pedido na máquina de estados          |
| GET    | `/orders/admin/custom`                               | Admin  | Encomendas, filtro opcional `status`           |
| PATCH  | `/orders/admin/custom/{custom_order_id}/review`      | Admin  | Aprova com preço ou recusa                     |

## Promoções (US16)

| Método | Caminho                                        | Acesso  | Finalidade                         |
| ------ | ---------------------------------------------- | ------- | ---------------------------------- |
| GET    | `/promotions/combos`                           | Público | Combos em vigor para a vitrine     |
| GET    | `/promotions/admin/promotions`                 | Admin   | Campanhas, com indicação de vigência |
| POST   | `/promotions/admin/promotions`                 | Admin   | Nova campanha                      |
| PUT    | `/promotions/admin/promotions/{promotion_id}`  | Admin   | Edição de campanha                 |
| DELETE | `/promotions/admin/promotions/{promotion_id}`  | Admin   | Exclusão de campanha               |
| GET    | `/promotions/admin/combos`                     | Admin   | Combos                             |
| POST   | `/promotions/admin/combos`                     | Admin   | Novo combo                         |
| PUT    | `/promotions/admin/combos/{combo_id}`          | Admin   | Edição de combo                    |
| DELETE | `/promotions/admin/combos/{combo_id}`          | Admin   | Exclusão de combo                  |

## Convenções

- Corpos em JSON, exceto o upload de imagem (`multipart/form-data`) e a leitura de imagem (binário).
- Valores monetários trafegam como texto decimal (`"18.90"`) para não perder precisão.
- Datas e horas em ISO 8601 com fuso; campos de período de promoções exigem fuso explícito.
- Toda resposta de erro segue o [catálogo de erros](02_error_catalog.md).
