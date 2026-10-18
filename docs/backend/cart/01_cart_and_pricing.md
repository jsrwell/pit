---
code: "BE-CRT-01"
name: "Carrinho e precificação"
updated: "2026/10/18"
---

# Carrinho e precificação

Atende aos cartões **US06** (iniciar a composição do pedido) e **US07** (ajustar o pedido antes do fechamento). Todas as rotas exigem sessão de cliente.

## Operações

| Operação          | Rota                              | Regra principal                                        |
| ----------------- | --------------------------------- | ------------------------------------------------------ |
| Consultar         | `GET /api/cart`                   | Recalcula tudo com os dados atuais do catálogo         |
| Adicionar         | `POST /api/cart/items`            | Soma à linha existente do mesmo produto                |
| Alterar quantidade | `PATCH /api/cart/items/{product_id}` | Define a nova quantidade, de 1 a 50                 |
| Remover           | `DELETE /api/cart/items/{product_id}` | Remove a linha inteira                             |

Toda operação responde com o carrinho completo, já recalculado, para que a tela se atualize com uma única chamada (US06, RNF#1; US07, RNF#1).

## Resposta

| Campo             | Conteúdo                                                       |
| ----------------- | -------------------------------------------------------------- |
| `lines`           | Produto, nome, imagem, preço unitário atual, quantidade, total da linha e disponibilidade |
| `item_count`      | Unidades somadas, usado no contador do cabeçalho               |
| `subtotal`        | Soma das linhas disponíveis                                    |
| `applied_combos`  | Combos completos encontrados, vezes aplicados e economia       |
| `discount`        | Soma das economias dos combos                                  |
| `total`           | `subtotal - discount`                                          |
| `has_unavailable` | Se alguma linha deixou de poder ser comprada                   |

## Regras de negócio

| Regra                                                       | Implementação                                   | Erro          |
| ----------------------------------------------------------- | ----------------------------------------------- | ------------- |
| US06 CA#1 e CA#2: adicionar com quantidade escolhida        | `add_to_cart`                                   | —             |
| US06 CA#3 e US07 CA#3: subtotal e total recalculados        | `summarize_cart` a cada resposta                | —             |
| US06 RN#1: quantidade mínima 1                              | Validação do schema                             | `CS-SYS-0002` |
| US06 RN#2: indisponível não entra                           | `get_purchasable_product`                       | `CS-CAT-0007` |
| Limite de 50 unidades por produto                           | Soma conferida antes de gravar                  | `CS-CRT-0001` |
| US07 CA#1 e CA#2: alterar e remover                         | `change_quantity`, `remove_from_cart`           | `CS-CRT-0002` |
| US07 RN#1: zero exige remoção explícita                     | `PATCH` aceita apenas de 1 a 50                 | `CS-SYS-0002` |
| US07 RN#2: alterações respeitam a disponibilidade           | Aumentar exige produto comprável; diminuir sempre é permitido | `CS-CAT-0007` |

## Precificação

1. O preço unitário de cada linha é o **preço efetivo** do produto: o promocional, se houver campanha em vigor, ou o preço base.
2. Linhas indisponíveis aparecem na resposta, mas não entram no subtotal nem nos combos.
3. Os combos em vigor são procurados entre as linhas disponíveis. Um combo é aplicado tantas vezes quantos conjuntos completos houver; unidades usadas por um combo não são reaproveitadas por outro, e os combos que economizam mais por conjunto são aplicados primeiro.

O carrinho não guarda preços: tudo é calculado na leitura. Por isso uma mudança de preço, campanha ou disponibilidade aparece imediatamente no carrinho de todos os clientes.

## Integração com outros módulos

| Módulo usado | Serviço                                   | Para quê                          |
| ------------ | ----------------------------------------- | --------------------------------- |
| `catalog`    | `get_products_by_id`, `is_purchasable`, `effective_prices` | Dados, disponibilidade e preço atual |
| `promotions` | `combo_discounts`                         | Economia dos combos               |

O módulo `orders` usa `summarize_cart` para precificar o pedido e `clear_cart` para esvaziar o carrinho após o checkout.
