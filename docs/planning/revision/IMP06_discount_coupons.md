---
code: "IMP06"
name: "Aplicar cupom de desconto no checkout"
status: "pending"
history: []
---

# IMP06 — Aplicar cupom de desconto no checkout

## Solicitação

Como **cliente autenticado**, eu quero informar um cupom de desconto na etapa de pagamento, para que receba o desconto de uma campanha da loja no total do pedido.

- **Origem:** [REV03](./ORIGINAL_REVISIONS.md#rev03)
- **Prioridade:** B
- **Estimativa:** 5 pontos (~14h)
- **Eixo:** Carrinho e pedido

O cupom entra no módulo de promoções existente como um percentual de desconto sobre o subtotal, reaproveitando a regra de vigência das campanhas, sem limites de uso por cliente.

## Critérios de aceitação

- **CA#1:** O administrador deve poder cadastrar, ativar e desativar cupons com código, percentual de desconto e período de vigência, na área de promoções.
- **CA#2:** O checkout deve ter um campo para informar o cupom e exibir o desconto no resumo antes da confirmação.
- **CA#3:** Cupom inexistente, inativo ou fora da vigência deve ser recusado com mensagem clara, sem impedir a finalização sem cupom.
- **CA#4:** O pedido confirmado deve registrar o código do cupom e o valor do desconto aplicado.

## Regras de negócio

- **RN#1:** O código do cupom é único e comparado sem diferenciar maiúsculas de minúsculas.
- **RN#2:** O percentual deve estar entre 1% e 100% e incide sobre o subtotal dos itens, sem alcançar a taxa de entrega.
- **RN#3:** Apenas um cupom pode ser aplicado por pedido, e ele se soma aos preços promocionais já vigentes.
- **RN#4:** O desconto é recalculado pela API na confirmação; o valor exibido pela interface não é aceito como verdade.

## Requisito não funcional

- **RNF#1:** A validação do cupom deve responder rapidamente e não reiniciar os dados já preenchidos no checkout.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Criar modelo e migração de cupons no módulo de promoções | 2h | Pendente |
| 2 | Implementar rotas administrativas de cupons e a validação de cupom na cotação do pedido | 4h | Pendente |
| 3 | Registrar cupom e desconto no pedido confirmado | 2h | Pendente |
| 4 | Adicionar gestão de cupons na tela de promoções e campo de cupom no checkout | 3h | Pendente |
| 5 | Escrever testes de API e de interface dos cupons | 3h | Pendente |
| **Total** | | **14h** | |

## Relacionamentos

- Amplia as campanhas de [US16](../cards/US16_manage_promotions.md) e o checkout de [US10](../cards/US10_secure_checkout.md); a implementação deve registrar a mudança no `history` desses cartões.
- O desconto aparece no acompanhamento de [US11](../cards/US11_track_order.md) e na gestão de pedidos de [US15](../cards/US15_manage_orders.md).

## Navegação

[Anterior: IMP05](./IMP05_store_contact_channel.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP07](./IMP07_limit_text_fields.md)
