---
code: "PLAN"
name: "Planejamento do APP Loja Virtual de Cupcakes Gourmet"
status: "implemented"
history: []
---

# Planejamento do projeto

Este diretório concentra a continuação do planejamento do APP Loja Virtual de Cupcakes Gourmet. O documento [Situação Problema 1 - Loja de Cupcakes](./original/SP01.md) é a entrega do primeiro PIT e permanece como referência histórica. O conteúdo operacional foi separado em cartões para facilitar busca, implementação e rastreabilidade.

## Estrutura

- `README.md`: convenções e índice do planejamento.
- `original/SP01.md`: entrega original consolidada do primeiro PIT.
- `cards/`: um arquivo Markdown por história do usuário, incluindo requisitos, tarefas, vínculos e navegação.

## Cartões

| Eixo | Cartões |
| --- | --- |
| Vitrine e descoberta | [US01](./cards/US01_explore_storefront.md), [US02](./cards/US02_filter_products.md), [US03](./cards/US03_view_product_details.md) |
| Autenticação e perfil | [US04](./cards/US04_create_account.md), [US05](./cards/US05_secure_login.md) |
| Carrinho e pedido | [US06](./cards/US06_add_to_cart.md), [US07](./cards/US07_update_cart.md), [US08](./cards/US08_choose_fulfillment.md), [US10](./cards/US10_secure_checkout.md), [US12](./cards/US12_custom_order.md) |
| Entrega e logística | [US09](./cards/US09_manage_delivery_address.md), [US11](./cards/US11_track_order.md) |
| Administração | [US13](./cards/US13_manage_catalog.md), [US14](./cards/US14_manage_availability.md), [US15](./cards/US15_manage_orders.md), [US16](./cards/US16_manage_promotions.md) |

## Cabeçalho YAML obrigatório

Todo arquivo Markdown de planejamento deve começar com um front matter YAML válido:

```yaml
---
code: "US01"
name: "Explorar a vitrine digital da loja"
status: "pending"
history: []
---
```

Campos:

- `code`: identificador único e estável do documento ou cartão.
- `name`: nome legível do item planejado.
- `status`: use somente `pending` enquanto houver trabalho pendente ou `implemented` quando o item estiver concluído.
- `history`: lista cronológica das mudanças feitas no planejamento; deve ficar vazia (`[]`) enquanto não houver alterações.

## Histórico obrigatório de mudanças

Toda mudança futura no planejamento deve ser registrada no `history` do próprio arquivo alterado, no mesmo commit da mudança. Cada registro deve informar a data no formato `AAAA/MM/DD` e descrever objetivamente o que mudou e por quê:

```yaml
history:
  - date: "2026/10/18"
    description: "Alteração do objetivo X para adequá-lo ao requisito Y."
```

Não registre reorganizações puramente editoriais como mudança de requisito. Mudanças de objetivo, escopo, regra de negócio, critério de aceitação, prioridade, estimativa, dependência ou tarefa devem sempre ser historiadas. A entrega original consolidada não deve ter seu conteúdo reescrito; evoluções devem ocorrer nos arquivos de `cards/`.

## Convenção de nomes

Os cartões usam o padrão `CODIGO_nome-curto-em-ingles.md`, com o código em maiúsculas, `_` como separador e uma descrição curta em inglês usando `snake_case`. Exemplo: `US01_explore_storefront.md`.
