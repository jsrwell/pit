---
code: "BE-API-02"
name: "Catálogo de erros"
updated: "2026/10/18"
---

# Catálogo de erros

Toda falha da API é respondida em Problem Details (RFC 9457) com o campo `code`, que é estável e é o que o frontend usa para escolher a mensagem em português. O modelo e as regras de criação de erros estão em [Arquitetura do backend](../ARCHITECTURE.md#tratamento-de-erros).

## Transversais (`SYS`)

| Código        | HTTP | Erro                     | Quando ocorre                                        |
| ------------- | ---- | ------------------------ | ---------------------------------------------------- |
| `CS-SYS-0001` | 500  | `UnexpectedError`        | Exceção não tratada; nenhum detalhe interno é exposto |
| `CS-SYS-0002` | 422  | `InvalidRequest`         | Campo ausente ou inválido; traz `errors` com JSON Pointer |
| `CS-SYS-0003` | 404  | `RouteNotFound`          | Caminho inexistente                                   |
| `CS-SYS-0004` | 405  | `MethodNotAllowed`       | Método não aceito pelo caminho                        |
| `CS-SYS-0005` | 401  | `AuthenticationRequired` | Token ausente, inválido ou expirado                   |
| `CS-SYS-0006` | 403  | `AccessDenied`           | Conta sem papel de administrador                      |

## Contas (`ACC`)

| Código        | HTTP | Erro                     | Quando ocorre                                        |
| ------------- | ---- | ------------------------ | ---------------------------------------------------- |
| `CS-ACC-0001` | 409  | `EmailAlreadyRegistered` | E-mail já cadastrado, sem diferenciar maiúsculas      |
| `CS-ACC-0002` | 422  | `WeakPassword`           | Senha com menos de 8 caracteres ou sem letra e número |
| `CS-ACC-0003` | 401  | `InvalidCredentials`     | E-mail ou senha incorretos (conta a tentativa)        |
| `CS-ACC-0004` | 429  | `AccountLocked`          | Conta bloqueada após tentativas seguidas              |
| `CS-ACC-0005` | 404  | `AddressNotFound`        | Endereço inexistente ou de outro cliente              |

## Catálogo (`CAT`)

| Código        | HTTP | Erro                 | Quando ocorre                                          |
| ------------- | ---- | -------------------- | ------------------------------------------------------ |
| `CS-CAT-0001` | 404  | `ImageNotFound`      | Imagem inexistente                                     |
| `CS-CAT-0002` | 422  | `InvalidPriceRange`  | Preço mínimo maior que o máximo no filtro              |
| `CS-CAT-0003` | 404  | `ProductNotFound`    | Produto inexistente ou fora da vitrine                 |
| `CS-CAT-0004` | 422  | `ProductIncomplete`  | Publicação sem descrição, composição ou imagem         |
| `CS-CAT-0005` | 415  | `UnsupportedImage`   | Imagem que não é PNG, JPEG ou WebP                     |
| `CS-CAT-0006` | 413  | `ImageTooLarge`      | Imagem acima de `CATALOG__MAX_IMAGE_BYTES`             |
| `CS-CAT-0007` | 409  | `ProductUnavailable` | Compra de produto inativo ou indisponível              |

## Carrinho (`CRT`)

| Código        | HTTP | Erro                    | Quando ocorre                              |
| ------------- | ---- | ----------------------- | ------------------------------------------ |
| `CS-CRT-0001` | 422  | `QuantityLimitExceeded` | Linha acima de 50 unidades                 |
| `CS-CRT-0002` | 404  | `CartItemNotFound`      | Alteração de produto que não está no carrinho |

## Pedidos (`ORD`)

| Código        | HTTP | Erro                         | Quando ocorre                                     |
| ------------- | ---- | ---------------------------- | ------------------------------------------------- |
| `CS-ORD-0001` | 422  | `AddressRequired`            | Entrega sem endereço                              |
| `CS-ORD-0002` | 422  | `EmptyCart`                  | Cotação ou checkout com carrinho vazio            |
| `CS-ORD-0003` | 409  | `CartHasUnavailableItems`    | Carrinho com item que deixou de estar disponível  |
| `CS-ORD-0004` | 422  | `InvalidCard`                | Cartão ausente, com número, validade ou CVV inválidos |
| `CS-ORD-0005` | 402  | `PaymentDeclined`            | Cobrança recusada; nada é gravado                 |
| `CS-ORD-0006` | 404  | `OrderNotFound`              | Pedido inexistente ou de outro cliente            |
| `CS-ORD-0007` | 409  | `InvalidStatusTransition`    | Mudança de status fora da sequência permitida     |
| `CS-ORD-0008` | 422  | `LeadTimeTooShort`           | Encomenda sem a antecedência mínima               |
| `CS-ORD-0009` | 404  | `CustomOrderNotFound`        | Encomenda inexistente                             |
| `CS-ORD-0010` | 409  | `CustomOrderAlreadyReviewed` | Encomenda já aprovada ou recusada                 |

## Promoções (`PRM`)

| Código        | HTTP | Erro                      | Quando ocorre                                |
| ------------- | ---- | ------------------------- | -------------------------------------------- |
| `CS-PRM-0001` | 422  | `InvalidPeriod`           | Fim da vigência igual ou anterior ao início  |
| `CS-PRM-0002` | 404  | `PromotionNotFound`       | Campanha inexistente                         |
| `CS-PRM-0003` | 404  | `ComboNotFound`           | Combo inexistente                            |
| `CS-PRM-0004` | 404  | `PromotedProductNotFound` | Campanha ou combo com produto inexistente    |

## Regras de manutenção

- Um código nunca é reaproveitado; um erro retirado recebe `deprecated = True`.
- O teste `tests/unit/shared/test_error_catalog.py` valida formato e unicidade de todos os códigos.
- Todo código novo ganha mensagem em `frontend/src/shared/api/error-messages.ts` e uma linha nesta tabela no mesmo commit.
