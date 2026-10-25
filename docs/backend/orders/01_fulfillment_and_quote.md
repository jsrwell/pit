---
code: "BE-ORD-01"
name: "Modalidade de recebimento e cotação"
updated: "2026/10/25"
---

# Modalidade de recebimento e cotação

Atende ao cartão **US08** (definir a modalidade de recebimento) e prepara os valores do checkout (US10).

## Cotação — `POST /api/orders/quote`

Calcula o pedido sem criá-lo, a partir do carrinho atual e da modalidade escolhida. A tela de checkout chama a cotação sempre que o cliente troca de modalidade ou de endereço.

| Campo de entrada     | Regra                                            |
| -------------------- | ------------------------------------------------ |
| `fulfillment_method` | `pickup` (retirada na loja) ou `delivery` (entrega) |
| `address_id`         | Obrigatório na entrega; ignorado na retirada     |
| `coupon_code`        | Opcional; vazio equivale a nenhum cupom ([Cupons de desconto](../promotions/02_discount_coupons.md)) |

| Campo de saída    | Conteúdo                                                  |
| ----------------- | --------------------------------------------------------- |
| `lines`           | Itens com preço efetivo                                   |
| `address`         | Cópia do endereço escolhido, ou nulo na retirada          |
| `subtotal`        | Soma dos itens                                            |
| `discount`        | Economia dos combos                                       |
| `coupon_code`     | Cupom aplicado, em maiúsculas, ou nulo                    |
| `coupon_discount` | Percentual do cupom sobre os itens, após os combos        |
| `delivery_fee`    | `0.00` na retirada; `STORE__DELIVERY_FEE` na entrega      |
| `total`           | `subtotal - discount - coupon_discount + delivery_fee`    |
| `pickup_address`  | Endereço da loja, `STORE__PICKUP_ADDRESS`, para exibição  |

## Regras de negócio

| Regra                                                         | Implementação                               | Erro          |
| ------------------------------------------------------------- | ------------------------------------------- | ------------- |
| CA#1: escolher retirada ou entrega                            | `FulfillmentMethod`                         | `CS-SYS-0002` |
| CA#2: fluxo adaptado à opção                                  | Endereço só é pedido e validado na entrega  | —             |
| CA#3: incidência correta da taxa                              | Taxa só na entrega                          | —             |
| RN#1: retirada não exige endereço                             | `address_id` ignorado                       | —             |
| RN#2: entrega exige endereço cadastrado válido                | Endereço obrigatório e da própria conta     | `CS-ORD-0001`, `CS-ACC-0005` |
| Carrinho precisa ter itens                                    | Verificação antes do cálculo                | `CS-ORD-0002` |
| Carrinho sem itens indisponíveis                              | Verificação antes do cálculo                | `CS-ORD-0003` |
| IMP06 CA#3: cupom inexistente, inativo ou fora da vigência    | `apply_coupon`                              | `CS-PRM-0007` |

## Cálculo único

A cotação e o checkout usam o mesmo caso de uso, `price_order`. Isso garante que o valor mostrado ao cliente é exatamente o valor cobrado (US10, RN#2), e que a taxa e as validações nunca divergem entre as duas telas.

## Configuração

| Variável                | Padrão                                         |
| ----------------------- | ---------------------------------------------- |
| `STORE__DELIVERY_FEE`   | `12.00`                                        |
| `STORE__PICKUP_ADDRESS` | `Rua das Confeitarias, 100 - Centro, São Paulo` |
