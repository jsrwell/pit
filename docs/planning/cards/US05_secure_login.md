---
code: "US05"
name: "Acessar a conta de forma segura"
status: "implemented"
history:
  - date: "2026/10/25"
    description: "Inclusão da RN#3: conta excluída pelo próprio cliente não pode mais entrar, conforme a melhoria IMP08 originada nos testes com usuários."
---

# US05 — Acessar a conta de forma segura

## História

Como **cliente cadastrado**, eu quero realizar login no aplicativo, para que possa acessar minha área pessoal, carrinho e histórico de pedidos com segurança.

- **Requerente:** Cliente cadastrado
- **Prioridade:** A
- **Estimativa:** 3 pontos (~19h)
- **Eixo:** Autenticação e perfil

O login sustenta a continuidade da jornada. Precisa equilibrar segurança com fluidez.

## Critérios de aceitação

- **CA#1:** O sistema deve autenticar o cliente com e-mail e senha válidos.
- **CA#2:** O sistema deve informar falha de autenticação quando as credenciais estiverem incorretas.
- **CA#3:** O sistema deve redirecionar o cliente autenticado para sua área principal.

## Regras de negócio

- **RN#1:** Tentativas inválidas sucessivas devem acionar proteção adicional.
- **RN#2:** Sessões expiradas devem exigir novo login.
- **RN#3:** Contas excluídas não podem mais entrar no sistema ([IMP08](../revision/IMP08_manage_own_account.md)).

## Requisito não funcional

- **RNF#1:** O processo de autenticação deve ocorrer de forma segura e previsível.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Implementar endpoint de autenticação com geração de token | 6h | Concluída |
| 2 | Desenvolver tela de login com feedback de erro | 6h | Concluída |
| 3 | Implementar proteção contra tentativas excessivas | 4h | Concluída |
| 4 | Escrever testes de autenticação | 3h | Concluída |
| **Total** | | **19h** | |

## Relacionamentos

- Requer uma conta criada em [US04](./US04_create_account.md).
- Protege carrinho, endereços, checkout e acompanhamento descritos em [US06](./US06_add_to_cart.md), [US09](./US09_manage_delivery_address.md), [US10](./US10_secure_checkout.md) e [US11](./US11_track_order.md).

## Navegação

[Anterior: US04](./US04_create_account.md) · [Índice](../README.md) · [Documento original](../original/SP01.md) · [Próximo: US06](./US06_add_to_cart.md)
