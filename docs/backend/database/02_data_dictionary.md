---
code: "BE-DB-02"
name: "Dicionário de dados"
updated: "2026/10/25"
---

# Dicionário de dados

Colunas de todas as tabelas, conforme as migrações. Todas as colunas são obrigatórias, exceto as marcadas como opcionais. `created_at` e `updated_at` (`timestamptz`, padrão `now()`) existem em todas as tabelas marcadas com *auditoria* e não são repetidas abaixo.

## `users` (auditoria)

| Coluna                  | Tipo           | Regras                                   | Descrição                          |
| ----------------------- | -------------- | ---------------------------------------- | ---------------------------------- |
| `id`                    | integer        | PK                                       | Identificador                      |
| `name`                  | varchar(100)   |                                          | Nome completo                      |
| `email`                 | varchar(254)   | único, gravado em minúsculas             | Login                              |
| `phone`                 | varchar(20)    |                                          | Telefone de contato, só dígitos (IMP04) |
| `password_hash`         | varchar(100)   |                                          | Hash bcrypt; a senha nunca é gravada |
| `role`                  | varchar(20)    | padrão `customer`; `customer` ou `admin` | Papel de acesso                    |
| `failed_login_attempts` | integer        | padrão `0`                               | Falhas seguidas de login           |
| `locked_until`          | timestamptz    | opcional                                 | Fim do bloqueio de login           |
| `deleted_at`            | timestamptz    | opcional                                 | Exclusão pelo cliente; nome, e-mail e telefone ficam anonimizados (IMP08) |

## `addresses` (auditoria)

| Coluna       | Tipo         | Regras                         | Descrição               |
| ------------ | ------------ | ------------------------------ | ----------------------- |
| `id`         | integer      | PK                             | Identificador           |
| `user_id`    | integer      | FK `users.id`, cascata, índice | Dono                    |
| `label`      | varchar(40)  |                                | Identificação ("Casa")  |
| `zip_code`   | varchar(9)   | formato `00000-000`            | CEP                     |
| `street`     | varchar(120) |                                | Rua                     |
| `number`     | varchar(10)  |                                | Número                  |
| `complement` | varchar(60)  | padrão vazio                   | Complemento             |
| `district`   | varchar(60)  |                                | Bairro                  |
| `reference`  | varchar(120) | padrão vazio                   | Ponto de referência     |
| `is_primary` | boolean      | padrão `false`                 | Endereço principal      |

## `categories` e `flavors`

| Coluna | Tipo        | Regras | Descrição                  |
| ------ | ----------- | ------ | -------------------------- |
| `id`   | integer     | PK     | Identificador              |
| `name` | varchar(60) | único  | Nome exibido e filtrável   |

## `product_images`

| Coluna         | Tipo        | Regras        | Descrição                         |
| -------------- | ----------- | ------------- | --------------------------------- |
| `id`           | integer     | PK            | Identificador usado na URL        |
| `content_type` | varchar(50) |               | Tipo MIME servido                 |
| `data`         | bytea       |               | Conteúdo da imagem                |
| `created_at`   | timestamptz | padrão `now()` | Momento do upload                |

## `products` (auditoria)

| Coluna                  | Tipo          | Regras                      | Descrição                                    |
| ----------------------- | ------------- | --------------------------- | -------------------------------------------- |
| `id`                    | integer       | PK                          | Identificador                                |
| `name`                  | varchar(80)   |                             | Nome do cupcake                              |
| `description`           | text          |                             | Descrição comercial                          |
| `composition`           | text          | padrão vazio                | Ingredientes                                 |
| `highlights`            | text          | padrão vazio                | Diferenciais, um por linha                   |
| `price`                 | numeric(10,2) |                             | Preço base                                   |
| `category_id`           | integer       | FK `categories.id`          | Categoria                                    |
| `flavor_id`             | integer       | FK `flavors.id`             | Sabor                                        |
| `image_id`              | integer       | FK `product_images.id`, opcional | Imagem principal                        |
| `is_active`             | boolean       | padrão `true`               | Publicado; inativo some da loja              |
| `is_available`          | boolean       | padrão `true`               | Pode ser comprado agora                      |
| `show_when_unavailable` | boolean       | padrão `true`               | Continua visível quando indisponível         |
| `is_featured`           | boolean       | padrão `false`              | Destaque na vitrine                          |

## `cart_items` (auditoria)

| Coluna       | Tipo    | Regras                          | Descrição       |
| ------------ | ------- | ------------------------------- | --------------- |
| `id`         | integer | PK                              | Identificador   |
| `user_id`    | integer | FK `users.id`, cascata, índice  | Dono do carrinho |
| `product_id` | integer | FK `products.id`                | Produto         |
| `quantity`   | integer | de 1 a 50                       | Unidades        |

Restrição única em `(user_id, product_id)`.

## `orders` (auditoria)

| Coluna               | Tipo          | Regras                                  | Descrição                                   |
| -------------------- | ------------- | --------------------------------------- | ------------------------------------------- |
| `id`                 | integer       | PK                                      | Número do pedido                            |
| `user_id`            | integer       | FK `users.id`, índice                   | Cliente                                     |
| `status`             | varchar(30)   | índice                                  | Etapa atual (ver ciclo de vida)             |
| `fulfillment_method` | varchar(20)   | `pickup` ou `delivery`                  | Modalidade de recebimento                   |
| `delivery_address`   | text          | opcional                                | Endereço copiado no momento do pedido       |
| `delivery_reference` | varchar(120)  | opcional                                | Referência do endereço                      |
| `payment_method`     | varchar(20)   | `pix`, `credit_card` ou `cash`          | Forma de pagamento                          |
| `payment_status`     | varchar(20)   | `approved` ou `pending`                 | Situação do pagamento                       |
| `payment_reference`  | varchar(40)   |                                         | Identificador da cobrança (só final do cartão) |
| `subtotal`           | numeric(10,2) |                                         | Soma dos itens                              |
| `discount`           | numeric(10,2) | padrão `0`                              | Desconto de combos                          |
| `coupon_code`        | varchar(30)   | opcional                                | Cupom aplicado, copiado como texto (IMP06)  |
| `coupon_discount`    | numeric(10,2) | padrão `0`                              | Desconto do cupom (IMP06)                   |
| `delivery_fee`       | numeric(10,2) |                                         | Taxa de entrega                             |
| `total`              | numeric(10,2) |                                         | Valor cobrado                               |
| `notes`              | text          | padrão vazio                            | Observações do cliente                      |

## `order_items`

| Coluna         | Tipo          | Regras                          | Descrição                    |
| -------------- | ------------- | ------------------------------- | ---------------------------- |
| `id`           | integer       | PK                              | Identificador                |
| `order_id`     | integer       | FK `orders.id`, cascata, índice | Pedido                       |
| `product_id`   | integer       | FK `products.id`                | Produto vendido              |
| `product_name` | varchar(80)   |                                 | Nome no momento da venda     |
| `unit_price`   | numeric(10,2) |                                 | Preço praticado              |
| `quantity`     | integer       |                                 | Unidades                     |
| `line_total`   | numeric(10,2) |                                 | Preço × quantidade           |

## `order_status_changes`

| Coluna       | Tipo        | Regras                          | Descrição            |
| ------------ | ----------- | ------------------------------- | -------------------- |
| `id`         | integer     | PK                              | Identificador        |
| `order_id`   | integer     | FK `orders.id`, cascata, índice | Pedido               |
| `status`     | varchar(30) |                                 | Status alcançado     |
| `changed_at` | timestamptz | padrão `now()`                  | Momento da mudança   |

## `custom_orders` (auditoria)

| Coluna           | Tipo          | Regras                                        | Descrição                      |
| ---------------- | ------------- | --------------------------------------------- | ------------------------------ |
| `id`             | integer       | PK                                            | Número da encomenda            |
| `user_id`        | integer       | FK `users.id`, índice                         | Cliente                        |
| `description`    | text          |                                               | O que o cliente deseja         |
| `quantity`       | integer       | de 6 a 500                                    | Unidades                       |
| `desired_date`   | date          | respeita a antecedência mínima                | Data desejada                  |
| `notes`          | text          | padrão vazio                                  | Observações                    |
| `status`         | varchar(20)   | índice; `pending_review`, `approved`, `rejected` | Situação da análise         |
| `quoted_price`   | numeric(10,2) | opcional; obrigatório na aprovação            | Valor proposto pela loja       |
| `store_response` | text          | padrão vazio                                  | Resposta ao cliente            |
| `reviewed_at`    | timestamptz   | opcional                                      | Momento da análise             |

## `promotions` (auditoria)

| Coluna              | Tipo          | Regras                     | Descrição                 |
| ------------------- | ------------- | -------------------------- | ------------------------- |
| `id`                | integer       | PK                         | Identificador             |
| `name`              | varchar(80)   |                            | Nome da campanha          |
| `product_id`        | integer       | FK `products.id`, índice   | Produto promovido         |
| `promotional_price` | numeric(10,2) |                            | Preço durante a vigência  |
| `starts_at`         | timestamptz   |                            | Início da vigência        |
| `ends_at`           | timestamptz   | posterior a `starts_at`    | Fim da vigência           |
| `is_active`         | boolean       | padrão `true`              | Campanha habilitada       |

## `coupons` (auditoria)

| Coluna             | Tipo        | Regras                     | Descrição                         |
| ------------------ | ----------- | -------------------------- | --------------------------------- |
| `id`               | integer     | PK                         | Identificador                     |
| `code`             | varchar(30) | único, maiúsculas          | Código digitado pelo cliente      |
| `discount_percent` | smallint    | de 1 a 100                 | Percentual sobre os itens         |
| `starts_at`        | timestamptz |                            | Início da vigência                |
| `ends_at`          | timestamptz | posterior a `starts_at`    | Fim da vigência                   |
| `is_active`        | boolean     | padrão `true`              | Cupom habilitado                  |

## `combos` (auditoria) e `combo_items`

| Coluna (`combos`) | Tipo          | Regras                  | Descrição               |
| ----------------- | ------------- | ----------------------- | ----------------------- |
| `id`              | integer       | PK                      | Identificador           |
| `name`            | varchar(80)   |                         | Nome do combo           |
| `description`     | text          | padrão vazio            | Descrição               |
| `price`           | numeric(10,2) |                         | Preço do conjunto       |
| `starts_at`       | timestamptz   |                         | Início da vigência      |
| `ends_at`         | timestamptz   | posterior a `starts_at` | Fim da vigência         |
| `is_active`       | boolean       | padrão `true`           | Combo habilitado        |

| Coluna (`combo_items`) | Tipo    | Regras                          | Descrição          |
| ---------------------- | ------- | ------------------------------- | ------------------ |
| `id`                   | integer | PK                              | Identificador      |
| `combo_id`             | integer | FK `combos.id`, cascata, índice | Combo              |
| `product_id`           | integer | FK `products.id`                | Produto do conjunto |
| `quantity`             | integer | de 1 a 50                       | Unidades no conjunto |
