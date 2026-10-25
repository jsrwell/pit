---
code: "IMP08"
name: "Editar os dados e excluir a própria conta"
status: "implemented"
history: []
---

# IMP08 — Editar os dados e excluir a própria conta

## Solicitação

Como **cliente autenticado**, eu quero alterar meus dados pessoais e minha senha, e poder excluir minha conta, para que mantenha meu cadastro correto e controle o uso dos meus dados.

- **Origem:** [REV04](./ORIGINAL_REVISIONS.md#rev04), [REV05](./ORIGINAL_REVISIONS.md#rev05)
- **Prioridade:** A
- **Estimativa:** 5 pontos (~14h)
- **Eixo:** Autenticação e perfil

A tela "Minha conta" apenas exibe os dados. A exclusão é lógica: a conta é desativada e os pedidos permanecem para o histórico da loja.

## Critérios de aceitação

- **CA#1:** O cliente deve poder alterar nome, e-mail e telefone na tela "Minha conta", com as mesmas validações do cadastro.
- **CA#2:** O cliente deve poder trocar a senha informando a senha atual e a nova senha.
- **CA#3:** O cliente deve poder excluir a própria conta após confirmação explícita, sendo desconectado em seguida.
- **CA#4:** Uma conta excluída não pode mais entrar no sistema.

## Regras de negócio

- **RN#1:** O novo e-mail continua sujeito à unicidade de RN#1 de [US04](../cards/US04_create_account.md).
- **RN#2:** A nova senha obedece à política mínima de segurança de RN#2 de [US04](../cards/US04_create_account.md).
- **RN#3:** A exclusão registra a data em `deleted_at`, anonimiza nome, e-mail e telefone e preserva pedidos e encomendas.
- **RN#4:** Pedidos ainda em andamento impedem a exclusão até serem concluídos ou cancelados.

## Requisito não funcional

- **RNF#1:** A troca de senha e a exclusão devem exigir sessão válida e nunca expor a senha armazenada.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Adicionar `deleted_at` ao usuário com migração e bloquear o login de contas excluídas | 2h | Concluída |
| 2 | Implementar rotas de edição de dados, troca de senha e exclusão da própria conta | 4h | Concluída |
| 3 | Desenvolver formulários de edição, troca de senha e confirmação de exclusão em "Minha conta" | 4h | Concluída |
| 4 | Escrever testes de API e de interface dos três fluxos | 4h | Concluída |
| **Total** | | **14h** | |

## Relacionamentos

- Amplia o perfil criado em [US04](../cards/US04_create_account.md) e a sessão de [US05](../cards/US05_secure_login.md); a implementação deve registrar a mudança no `history` desses cartões.
- Reaproveita as validações de [IMP04](./IMP04_validate_signup_fields.md) e os limites de [IMP07](./IMP07_limit_text_fields.md).

## Navegação

[Anterior: IMP07](./IMP07_limit_text_fields.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP09](./IMP09_header_search.md)
