---
code: "IMP05"
name: "Oferecer canal de contato direto com a loja"
status: "implemented"
history: []
---

# IMP05 — Oferecer canal de contato direto com a loja

## Solicitação

Como **cliente visitante**, eu quero encontrar um meio de contato direto com a loja, para que possa tirar dúvidas durante a navegação ou sobre um pedido.

- **Origem:** [REV03](./ORIGINAL_REVISIONS.md#rev03)
- **Prioridade:** B
- **Estimativa:** 1 ponto (~3h)
- **Eixo:** Atendimento

O rodapé possui a coluna "Atendimento", mas ela traz apenas textos informativos, sem nenhum canal de contato.

## Critérios de aceitação

- **CA#1:** A coluna "Atendimento" do rodapé deve exibir WhatsApp, telefone e e-mail da loja como links acionáveis.
- **CA#2:** O link de WhatsApp deve abrir uma conversa com mensagem inicial preenchida.
- **CA#3:** Os canais devem estar visíveis em todas as páginas da loja.

## Regras de negócio

- **RN#1:** Os dados de contato devem ficar em um único ponto de configuração do frontend.

## Requisito não funcional

- **RNF#1:** Os links devem ser acessíveis por teclado e identificados para leitores de tela.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Centralizar os dados de contato da loja em configuração | 1h | Concluída |
| 2 | Exibir os canais de contato no rodapé | 1h | Concluída |
| 3 | Escrever teste do rodapé com os links de contato | 1h | Concluída |
| **Total** | | **3h** | |

## Relacionamentos

- Apoia o acompanhamento de pedidos de [US11](../cards/US11_track_order.md) e as encomendas de [US12](../cards/US12_custom_order.md).

## Navegação

[Anterior: IMP04](./IMP04_validate_signup_fields.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP06](./IMP06_discount_coupons.md)
