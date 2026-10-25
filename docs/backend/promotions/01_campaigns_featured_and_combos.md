---
code: "BE-PRM-01"
name: "Campanhas, destaques e combos"
updated: "2026/10/25"
---

# Campanhas, destaques e combos

Atende ao cartão **US16** (gerenciar promoções e destaques).

## Recursos

| Recurso   | O que é                                                         | Critério |
| --------- | --------------------------------------------------------------- | -------- |
| Campanha  | Preço promocional de um produto durante um período              | CA#1     |
| Destaque  | Marca `is_featured` do produto; aparece primeiro e em evidência | CA#2     |
| Combo     | Conjunto de produtos e quantidades com preço fechado            | CA#3     |
| Cupom     | Código com percentual sobre os itens do pedido, informado no checkout; ver [Cupons de desconto](02_discount_coupons.md) | CA#4 (IMP06) |

## Rotas

| Rota                                             | Acesso  | Finalidade                           |
| ------------------------------------------------ | ------- | ------------------------------------ |
| `GET /api/promotions/combos`                     | Público | Combos em vigor para a vitrine        |
| `/api/promotions/admin/promotions`               | Admin   | Listar, criar, editar e excluir campanhas |
| `/api/promotions/admin/combos`                   | Admin   | Listar, criar, editar e excluir combos |
| `/api/promotions/admin/coupons`                  | Admin   | Listar, criar, editar, ativar, desativar e excluir cupons |
| `PATCH /api/catalog/admin/products/{id}/featured` | Admin  | Marcar ou desmarcar destaque          |

As listagens administrativas trazem `is_running`, que indica se a campanha ou o combo afeta preços neste momento.

## Vigência

Uma campanha, um combo ou um cupom está **em vigor** quando está habilitado (`is_active`) e o instante atual está em `[starts_at, ends_at)`. Fora disso, não afeta nenhum preço (RN#1).

- Datas exigem fuso horário explícito; o painel envia o horário local convertido para UTC.
- `ends_at` igual ou anterior a `starts_at` responde `CS-PRM-0001`.
- Produto inexistente responde `CS-PRM-0004`.
- Excluir ou desabilitar uma campanha devolve o preço normal na hora.

## Preço promocional

Enquanto a campanha está em vigor, o preço promocional **prevalece** (RN#2) em todos os pontos:

| Ponto              | Efeito                                                           |
| ------------------ | ---------------------------------------------------------------- |
| Vitrine e detalhe  | `promotional_price` preenchido ao lado do preço base             |
| Carrinho           | Preço unitário da linha passa a ser o promocional                |
| Cotação e checkout | Totais e itens do pedido usam o preço promocional                |

Se mais de uma campanha do mesmo produto estiver em vigor, vale o menor preço.

## Combos

- Um combo tem de 2 a 10 itens, cada um com produto e quantidade (de 1 a 50).
- O cliente adiciona os produtos ao carrinho, individualmente ou pelo botão do combo na vitrine. Quando o carrinho contém um conjunto completo, a diferença entre o preço normal do conjunto e o preço do combo vira desconto.
- O combo é aplicado tantas vezes quantos conjuntos completos houver. As unidades usadas por um combo não são reutilizadas por outro, e os de maior economia são aplicados primeiro.
- O desconto aparece no carrinho, na cotação e fica gravado no pedido (`orders.discount`).

## Dependências entre módulos

`promotions` não importa nenhum outro módulo: a existência do produto é garantida pela chave estrangeira. O `catalog` consulta `promotional_prices` para exibir e cobrar o preço vigente, o `cart` consulta `combo_discounts` para calcular o desconto e o `orders` consulta `apply_coupon` para o cupom. Assim não há dependência circular entre catálogo e promoções.
