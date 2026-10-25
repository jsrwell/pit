---
code: "IMP04"
name: "Validar o formato dos campos do cadastro"
status: "implemented"
history: []
---

# IMP04 — Validar o formato dos campos do cadastro

## Solicitação

Como **cliente visitante**, eu quero ser avisado no próprio formulário quando o e-mail ou o telefone estiverem em formato inválido, para que corrija os dados antes de concluir o cadastro.

- **Origem:** [REV03](./ORIGINAL_REVISIONS.md#rev03), [REV04](./ORIGINAL_REVISIONS.md#rev04)
- **Prioridade:** A
- **Estimativa:** 3 pontos (~7h)
- **Eixo:** Autenticação e perfil

O formulário de cadastro desativa a validação do navegador e não limita o tamanho dos campos; o telefone aceita qualquer combinação de dígitos e símbolos entre 10 e 20 caracteres.

## Critérios de aceitação

- **CA#1:** O formulário deve recusar, antes do envio, e-mail sem formato válido (usuário, `@` e domínio), exibindo mensagem no próprio campo.
- **CA#2:** O campo de telefone deve aceitar apenas dígitos, aplicar a máscara `(00) 00000-0000` e limitar a entrada a 11 dígitos.
- **CA#3:** Os campos de nome, e-mail e senha devem ter limite de caracteres igual ao aceito pela API.
- **CA#4:** A API deve rejeitar telefone que não tenha 10 ou 11 dígitos, com DDD, retornando erro de validação no campo.

## Regras de negócio

- **RN#1:** O telefone é armazenado apenas com dígitos, independentemente da máscara exibida.
- **RN#2:** A validação da interface complementa, e não substitui, a validação da API.

## Requisito não funcional

- **RNF#1:** As mensagens de erro devem ser claras, em português, e associadas ao campo para leitores de tela.

## Tarefas

| # | Tarefa | Estimativa | Status |
| --- | --- | ---: | --- |
| 1 | Restringir o formato do telefone no esquema de cadastro da API | 2h | Concluída |
| 2 | Adicionar validação de e-mail, máscara de telefone e limites de tamanho no formulário | 3h | Concluída |
| 3 | Escrever testes de API e de interface para dados inválidos | 2h | Concluída |
| **Total** | | **7h** | |

## Relacionamentos

- Reforça o CA#2 de [US04](../cards/US04_create_account.md); a implementação deve registrar a mudança no `history` desse cartão.
- As mesmas regras valem para a edição de dados de [IMP08](./IMP08_manage_own_account.md).
- Os limites de tamanho seguem o padrão definido em [IMP07](./IMP07_limit_text_fields.md).

## Navegação

[Anterior: IMP03](./IMP03_filter_loading_feedback.md) · [Revisões originais](./ORIGINAL_REVISIONS.md) · [Índice](../README.md) · [Próximo: IMP05](./IMP05_store_contact_channel.md)
