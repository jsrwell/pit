---
code: "US04"
name: "Criar conta para comprar e acompanhar pedidos"
status: "implemented"
history:
  - date: "2026/10/25"
    description: "CA#2 ampliado para validar também o formato de e-mail e telefone (10 ou 11 dígitos com DDD, gravado só com dígitos) e os limites de tamanho dos campos, conforme a melhoria IMP04 originada nos testes com usuários."
  - date: "2026/10/25"
    description: "Inclusão do CA#4 para que o cliente altere os próprios dados e senha e exclua a conta de forma lógica, preservando pedidos, conforme a melhoria IMP08 originada nos testes com usuários."
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
- **CA#2:** O sistema deve validar campos obrigatórios, o formato de e-mail e telefone e o tamanho máximo dos campos antes de concluir o cadastro ([IMP04](../revision/IMP04_validate_signup_fields.md)).
- **CA#3:** O sistema deve impedir duplicidade de cadastro com o mesmo e-mail.
- **CA#4:** O sistema deve permitir que o cliente altere nome, e-mail, telefone e senha e exclua a própria conta ([IMP08](../revision/IMP08_manage_own_account.md)).

## Regras de negócio

- **RN#1:** O e-mail do cliente deve ser único no sistema, inclusive ao ser alterado.
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
