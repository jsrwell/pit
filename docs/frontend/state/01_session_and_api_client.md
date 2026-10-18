---
code: "FE-STA-01"
name: "Sessão e cliente HTTP"
updated: "2026/10/18"
---

# Sessão e cliente HTTP

Como a SPA autentica o usuário e conversa com a API. Complementa a seção de comunicação da [Arquitetura do frontend](../ARCHITECTURE.md#comunicação-com-a-api).

## Sessão

`shared/auth/session-store.ts` guarda a sessão no `localStorage`, na chave `cupcakes-gourmet.session`:

| Campo         | Conteúdo                                   |
| ------------- | ------------------------------------------ |
| `accessToken` | Token devolvido pelo login                 |
| `expiresAt`   | Expiração informada pela API               |
| `account`     | Id, nome, e-mail e papel da conta          |

- A sessão é lida e observada com `useSession()` (`useSyncExternalStore`), então cabeçalho, rotas e telas reagem juntos ao login e ao logout.
- Uma sessão vencida é descartada na leitura, antes mesmo de qualquer chamada à API (US05, RN#2).
- O login (`features/accounts/api/sign-in.ts`) grava a sessão; "Sair" a apaga.

## Proteção de rotas

`app/routes/RequireAuth.tsx` envolve as rotas protegidas:

- Sem sessão, redireciona para `/entrar`, guardando a rota pedida; após o login, o usuário volta para ela.
- Com `role="admin"`, contas sem esse papel são levadas à vitrine.
- Depois do login, sem rota pendente, clientes vão para `/conta` e administradores para `/admin` (US05, CA#3).

## Cliente HTTP

Toda chamada passa por `request` ou `sendJson`, em `shared/api/http-client.ts`:

| Comportamento                       | Detalhe                                                         |
| ----------------------------------- | --------------------------------------------------------------- |
| URL base                            | `env.apiBaseUrl` (padrão `/api`)                                |
| Autenticação                        | Envia `Authorization: Bearer` quando há sessão                  |
| Corpo JSON                          | `sendJson` serializa e define `Content-Type`; uploads usam `FormData` |
| Erro com Problem Details            | Vira `ApiError` com o `code` da API                             |
| Erro sem Problem Details (ex.: 502) | Vira `ApiError` `CS-SYS-0001`                                   |
| Falha de rede                       | Vira `ApiError` `CS-NET-0001`                                   |
| `CS-SYS-0005`                       | Apaga a sessão; as rotas protegidas levam ao login              |

## Mensagens de erro

- `shared/api/error-messages.ts` traduz cada `code` da API para uma mensagem em português; códigos desconhecidos caem na mensagem genérica.
- Em `422`, `shared/api/field-errors.ts` converte o JSON Pointer de cada campo (`/body/email`) numa mensagem ao lado do campo correspondente.
- `useSubmit` junta as duas coisas: devolve o resultado da ação ou `null`, e expõe a mensagem geral e os erros por campo para o formulário.
