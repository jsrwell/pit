---
code: "US04"
name: "Criar conta para comprar e acompanhar pedidos"
status: "implemented"
history: []
---

# US04 — Criar conta para comprar e acompanhar pedidos

## História

Como **cliente visitante**, eu quero realizar cadastro no aplicativo, para que possa ter acesso às funcionalidades de compra, histórico e acompanhamento de pedidos.

- **Requerente:** Cliente visitante
- **Prioridade:** A
- **Estimativa:** 5 pontos (~22h)
- **Eixo:** Autenticação e perfil

O cadastro organiza relacionamento, histórico de compras, endereços e acompanhamento posterior do pedido.

## Critérios de aceitação

- **CA#1:** O sistema deve permitir cadastro com nome, e-mail, telefone e senha.
- **CA#2:** O sistema deve validar campos obrigatórios antes de concluir o cadastro.
- **CA#3:** O sistema deve impedir duplicidade de cadastro com o mesmo e-mail.

## Regras de negócio

- **RN#1:** O e-mail do cliente deve ser único no sistema.
- **RN#2:** A senha deve obedecer a um padrão mínimo de segurança.

## Requisito não funcional

- **RNF#1:** Os dados do cliente devem ser armazenados com proteção adequada.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoint de cadastro com validação de unicidade de e-mail | 6h | Concluída |
| 2 | Desenvolver tela de cadastro com validação de campos | 8h | Concluída |
| 3 | Implementar hash de senha e armazenamento seguro | 4h | Concluída |
| 4 | Escrever testes de cadastro | 4h | Concluída |
| **Total** | | **22h** | |

## Relacionamentos

- Habilita a autenticação de [US05](./US05_secure_login.md).
- Cria o perfil necessário para endereços em [US09](./US09_manage_delivery_address.md), pedidos e acompanhamento em [US11](./US11_track_order.md).

## Navegação

[Anterior: US03](./US03_view_product_details.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US05](./US05_secure_login.md)
