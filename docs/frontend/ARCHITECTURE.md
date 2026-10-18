# Arquitetura do frontend

SPA da Loja Virtual de Cupcakes Gourmet. Implementa a View do MVC e conversa com o backend apenas pela API REST. A visão do sistema como um todo está em [Visão geral da arquitetura](../ARCHITECTURE.md).

## Princípios

- **Organização por funcionalidade**: o código de cada área de negócio fica junto, espelhando os módulos do backend.
- **Uma única porta para a API**: toda chamada HTTP passa pelo cliente de `shared/api/`, que padroniza URL base, cabeçalhos e erros.
- **Erros pelo código**: o texto mostrado ao usuário vem do `code` do Problem Details, nunca do `title` ou `detail` da API.
- **Configuração no build, destino no proxy**: a SPA chama sempre `/api`; quem decide para onde isso vai é o proxy do ambiente.
- **Tipagem estrita**: sem `any`; dados externos entram como `unknown` e são estreitados.

## Stack

| Item      | Escolha                                      | Motivo                                                        |
| --------- | -------------------------------------------- | ------------------------------------------------------------- |
| Linguagem | TypeScript (strict)                          | Gera HTML, CSS e JavaScript, como pede o enunciado            |
| UI        | React 19                                     | Componentes e ecossistema de testes maduro                    |
| Build     | Vite                                         | Servidor de desenvolvimento rápido e build estático           |
| Testes    | Vitest e Testing Library (jsdom)             | Mesma configuração do Vite; testes pelo comportamento visível |
| Qualidade | ESLint (typescript-eslint strict) e Prettier | Lint lógico e formatação única                                |
| Servidor  | nginx (imagem de release)                    | Arquivos estáticos e proxy `/api`                             |

## Estrutura de diretórios

```text
frontend/
├── index.html
├── vite.config.ts              alias @, proxy /api e configuração do Vitest
├── eslint.config.js
├── tsconfig*.json
└── src/
    ├── main.tsx                monta a aplicação
    ├── app/                    composição: App, rotas, layout e estilos globais
    ├── features/
    │   └── <módulo>/
    │       ├── api/            funções de chamada e tipos do contrato do módulo
    │       ├── components/     componentes e telas do módulo
    │       └── hooks/          estado e efeitos reutilizados dentro do módulo
    ├── shared/
    │   ├── api/                cliente HTTP, ApiError, Problem Details e mensagens de erro
    │   ├── auth/               sessão do usuário (token, expiração e conta) guardada no navegador
    │   ├── config/             leitura das variáveis VITE_*
    │   ├── format/             formatação de moeda e datas em pt-BR
    │   ├── hooks/              estado reutilizado, como o carregamento assíncrono
    │   └── components/         componentes visuais genéricos (botão, campo, alerta)
    └── test/                   setup do Vitest
```

## Módulos

As pastas de `features/` usam os mesmos nomes dos módulos do backend, o que torna direta a correspondência entre tela, chamada e regra.

| Feature      | Telas previstas                                          | Cartões                      |
| ------------ | -------------------------------------------------------- | ---------------------------- |
| `system`     | Indicador de disponibilidade da API                      | —                            |
| `catalog`    | Vitrine, filtros, detalhe do produto, painel de catálogo | US01, US02, US03, US13, US14 |
| `accounts`   | Cadastro, login, endereços                               | US04, US05, US09             |
| `cart`       | Carrinho                                                 | US06, US07                   |
| `orders`     | Checkout, acompanhamento, encomenda, painel de pedidos   | US08, US10, US11, US12, US15 |
| `promotions` | Destaques na vitrine e painel de campanhas               | US16                         |

Regras de dependência:

- `features/<a>` nunca importa de `features/<b>`; o que for comum sobe para `shared/`.
- `shared/` nunca importa de `features/` nem de `app/`.
- `app/` compõe as features (rotas e layout) e não contém regra de tela.
- Quando uma tela precisa de uma ação de outra feature (por exemplo, o botão de adicionar ao carrinho dentro do card da vitrine), a tela expõe uma propriedade de renderização (`renderProductAction`) e `app/routes/` encaixa ali o componente da outra feature.

## Comunicação com a API

- `request<T>(path, init)` em `shared/api/http-client.ts` prefixa `env.apiBaseUrl` (padrão `/api`), envia `Accept: application/json` e devolve o corpo já convertido.
- Respostas não-2xx viram `ApiError`: com o Problem Details do backend quando o corpo é um, ou com `CS-SYS-0001` quando não é (por exemplo, um 502 do proxy).
- Falha de rede vira `ApiError` com o código local `CS-NET-0001` e status `0`.
- Com sessão ativa, `request` envia `Authorization: Bearer`; uma resposta `CS-SYS-0005` (sessão ausente ou expirada) apaga a sessão, e as rotas protegidas por `RequireAuth` levam o usuário ao login.
- Cada feature expõe funções nomeadas pelo caso de uso (`getHealth`, `listProducts`) em `features/<módulo>/api/`, com os tipos de entrada e saída espelhando os schemas do backend.

## Tratamento de erros

- `shared/api/error-messages.ts` é o catálogo de mensagens em português, chaveado pelo `code` da API; um código desconhecido cai na mensagem genérica de erro inesperado.
- `ApiError.message` já é a mensagem para o usuário; componentes exibem `error.message` e não montam textos a partir da resposta.
- Em `422`, `error.problem.errors` traz cada campo inválido como JSON Pointer (`/body/email`), que o formulário usa para marcar o campo correspondente.
- Todo erro novo declarado no backend ganha sua entrada no catálogo de mensagens no mesmo cartão.

## Configuração

| Variável            | Padrão      | Uso                                                                   |
| ------------------- | ----------- | --------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | `/api`      | Só muda em hospedagem estática sem proxy, apontando para a URL da API |
| `VITE_APP_VERSION`  | `0.0.0-dev` | Preenchida pelo build de release com a versão publicada               |

- Variáveis `VITE_*` são fixadas no momento do build; mudar o valor exige novo build.
- `public/health.json` é publicado junto com a SPA e servido pelo nginx com CORS liberado; o [lançador](../launcher/ARCHITECTURE.md) o usa para saber se o frontend já acordou.
- O destino real de `/api` é configurado fora da SPA: `server.proxy` do Vite em desenvolvimento e `API_UPSTREAM` do nginx na imagem de release.

## Interface

- Textos da interface em português do Brasil; código, nomes e testes em inglês.
- Layout pensado primeiro para celular, como pedem os requisitos não funcionais dos cartões.
- Estados de carregamento usam `role="status"` e erros usam `role="alert"`, o que melhora a acessibilidade e permite testar pelo papel do elemento.

## Testes

- Testes ficam ao lado do arquivo testado (`ApiStatus.test.tsx`).
- Componentes são testados pelo que o usuário vê (texto, papel, rótulo), com as funções de `api/` substituídas por `vi.spyOn`.
- O cliente HTTP é testado com `fetch` substituído, cobrindo sucesso, Problem Details, corpo inesperado e falha de rede.
- Cada critério de aceitação de tela do cartão vira ao menos um teste.
