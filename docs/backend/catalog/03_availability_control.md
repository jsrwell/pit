---
code: "BE-CAT-03"
name: "Controle de disponibilidade"
updated: "2026/10/18"
---

# Controle de disponibilidade

Atende ao cartão **US14** (gerenciar a disponibilidade dos produtos) e sustenta as regras de compra do US06 e US07.

## Operação

`PATCH /api/catalog/admin/products/{product_id}/availability` (papel `admin`):

| Campo                   | Efeito                                                   |
| ----------------------- | -------------------------------------------------------- |
| `is_available`          | `true` libera a compra; `false` suspende                 |
| `show_when_unavailable` | Mantém o produto visível na vitrine enquanto indisponível (padrão `true`) |

A rota responde com o produto atualizado. A mesma mudança também pode ser feita pela edição completa do produto.

## Propagação

Não existe cache de disponibilidade: vitrine, detalhe, carrinho, cotação e checkout leem o produto a cada requisição. A mudança vale na próxima chamada de qualquer cliente (RNF#1).

| Ponto do sistema   | Comportamento com o produto indisponível                                   |
| ------------------ | -------------------------------------------------------------------------- |
| Vitrine e detalhe  | Sinalizado como indisponível, ou oculto se `show_when_unavailable=false`   |
| Adicionar ao carrinho | Recusado com `CS-CAT-0007` (CA#3)                                       |
| Linha já no carrinho | Marcada como indisponível, fora do subtotal; só pode diminuir ou ser removida |
| Cotação e checkout | Recusados com `CS-ORD-0003` até a linha sair do carrinho                   |

## Regras de negócio

| Regra                                                                 | Atendimento                                     |
| --------------------------------------------------------------------- | ----------------------------------------------- |
| CA#1: marcar disponível ou indisponível                               | Rota de disponibilidade                         |
| CA#2: refletir na vitrine e no fluxo de compra                        | Leitura sempre do estado atual                  |
| CA#3: impedir inclusão no carrinho                                    | `get_purchasable_product` nas operações de carrinho |
| RN#1: disponibilidade atual prevalece sobre o carrinho salvo          | `summarize_cart` reavalia cada linha            |
| RN#2: indisponível pode ficar visível, mas não comprável, se a loja optar | `show_when_unavailable`                     |

## Serviços oferecidos a outros módulos

`modules/catalog/services/purchasable_products.py` concentra a regra de "pode ser comprado agora" (ativo e disponível), usada pelo carrinho, pela cotação e pelo checkout. Os demais módulos não acessam o model de produto diretamente.
