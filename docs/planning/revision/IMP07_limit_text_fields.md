---
code: "IMP07"
name: "Limitar o tamanho dos campos de texto e preservar o layout móvel"
status: "implemented"
history: []
---

# IMP07 — Limitar o tamanho dos campos de texto e preservar o layout móvel

## Solicitação

Como **cliente**, eu quero que os campos de texto indiquem e respeitem seu tamanho máximo, para que não perca o que escrevi ao enviar e a tela continue legível no celular.

- **Origem:** [REV04](./ORIGINAL_REVISIONS.md#rev04)
- **Prioridade:** A
- **Estimativa:** 2 pontos (~6h)
- **Eixo:** Carrinho e pedido

A API já limita os textos (por exemplo, 1000 caracteres na descrição da encomenda), mas os formulários não aplicam esse limite, e textos longos sem espaços quebram o layout móvel nas telas que os exibem.

## Critérios de aceitação

- **CA#1:** Todos os campos de texto dos formulários do cliente devem impedir digitação além do limite aceito pela API.
- **CA#2:** As áreas de texto devem exibir contador de caracteres restantes.
- **CA#3:** Textos longos, inclusive palavras sem espaços, devem quebrar linha sem gerar rolagem horizontal em telas de celular.

## Regras de negócio

- **RN#1:** O limite exibido na interface deve ser igual ao validado pela API.

## Requisito não funcional

- **RNF#1:** A vitrine, o carrinho, o checkout, as encomendas e o acompanhamento não devem ter rolagem horizontal a partir de 320px de largura.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Adicionar suporte a limite e contador nos componentes compartilhados de campo | 2h | Concluída |
| 2 | Aplicar os limites nos formulários de encomenda, endereço e checkout | 2h | Concluída |
| 3 | Ajustar a quebra de textos longos nas telas de pedido e encomenda | 1h | Concluída |
| 4 | Escrever testes dos limites e do contador | 1h | Concluída |
| **Total** | | **6h** | |

## Relacionamentos

- Ajusta os formulários de [US09](../cards/US09_manage_delivery_address.md), [US10](../cards/US10_secure_checkout.md) e [US12](../cards/US12_custom_order.md).
- Fornece os componentes usados pelos limites de [IMP04](./IMP04_validate_signup_fields.md) e [IMP08](./IMP08_manage_own_account.md).

## Navegação

[Anterior: IMP06](./IMP06_discount_coupons.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP08](./IMP08_manage_own_account.md)
