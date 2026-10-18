---
code: "SYS-ARCH"
name: "Visão geral da arquitetura"
updated: "2026/10/18"
---

# Visão geral da arquitetura

Este documento descreve como as partes do sistema se encaixam, como são executadas e como chegam a produção. Os detalhes internos de cada aplicação ficam em [Arquitetura do backend](backend/ARCHITECTURE.md), [Arquitetura do frontend](frontend/ARCHITECTURE.md) e [Arquitetura do lançador](launcher/ARCHITECTURE.md).

## Componentes

```mermaid
flowchart LR
    user([Cliente ou administrador]) --> launcher[Lançador estático] -. acorda e redireciona .-> frontend
    subgraph frontend [Frontend - View]
        spa[SPA React] --> proxy[nginx /api]
    end
    proxy --> backend
    subgraph backend [Backend - Model e Controller]
        api[FastAPI] --> services[Services] --> orm[SQLAlchemy]
    end
    orm --> database[(PostgreSQL)]
```

- **Frontend**: SPA em React e TypeScript, servida como arquivos estáticos. Toda chamada à API usa o caminho relativo `/api`.
- **Backend**: API REST em FastAPI, organizada como monolito modular. Todas as rotas ficam sob `/api`.
- **Banco de dados**: PostgreSQL, com o esquema versionado por migrações do Alembic.
- **Lançador**: página estática de entrada da demonstração, sempre no ar, que acorda frontend e backend hospedados em planos gratuitos e redireciona para a loja quando os dois respondem.

## Mapeamento MVC

O enunciado do PIT indica o padrão MVC. Numa API com frontend separado, as responsabilidades ficam assim:

| Papel      | Onde                                                        | Responsabilidade                                         |
| ---------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| Model      | `backend/src/app/modules/*/{models,repositories,services}/` | Dados, regras de negócio e validação                     |
| Controller | `backend/src/app/modules/*/api/`                            | Recebe a requisição, chama o service, devolve a resposta |
| View       | `frontend/src/`                                             | Apresenta os dados e coleta as ações do usuário          |

## Estrutura do repositório

```text
pit/
├── backend/               API (Model e Controller)
├── frontend/              SPA (View)
├── launcher/              página estática que acorda os serviços e leva à loja
├── docker/
│   ├── dev/               banco de dados para desenvolvimento local
│   └── release/           Dockerfiles de release do backend e do frontend
├── docs/                  arquitetura e planejamento (cartões US01 a US16)
├── .github/               CI, release e scripts do semantic-release
├── .claude/               regras e hooks para agentes
├── .vscode/               configuração do editor para as duas linguagens
└── planning/              material da disciplina (local, fora do Git)
```

## Execução local

O desenvolvimento roda backend e frontend nativamente, com apenas o banco em contêiner:

1. `docker compose -f docker/dev/docker-compose.yml up -d` sobe o PostgreSQL em `localhost:5432` (usuário, senha e banco `cupcakes`).
2. O backend lê `backend/.env` (modelo em `backend/.env.example`), aplica as migrações com `poetry run alembic upgrade head`, carrega os dados iniciais com `poetry run python src/seed.py` e serve em `http://localhost:8000`.
3. O servidor do Vite serve o frontend em `http://localhost:5173` e encaminha `/api` para o backend, por isso não há CORS em desenvolvimento.

No VS Code, a configuração composta **Full stack** sobe o banco, o backend com depurador e o frontend no Chrome.

## Configuração por ambiente

As duas aplicações são configuradas apenas por variáveis de ambiente, com padrões que funcionam sem nenhuma configuração no ambiente correspondente.

As variáveis essenciais para ligar as partes entre si estão abaixo; a referência completa de cada aplicação está em [Configuração do backend](backend/operations/01_configuration.md), [Build e publicação do frontend](frontend/operations/01_build_and_deployment.md) e [Arquitetura do lançador](launcher/ARCHITECTURE.md#configuração).

| Variável              | Aplicação | Padrão local                                                     | Padrão na imagem de release                                     |
| --------------------- | --------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| `DATABASE__DSN`       | backend   | `postgresql+psycopg://cupcakes:cupcakes@localhost:5432/cupcakes` | `postgresql+psycopg://cupcakes:cupcakes@database:5432/cupcakes` |
| `CORS__ALLOW_ORIGINS` | backend   | `["http://localhost:5173","http://localhost:4173"]`              | `["http://localhost:8080"]`                                     |
| `AUTH__SECRET_KEY`    | backend   | segredo de desenvolvimento                                       | segredo de desenvolvimento; **sempre sobrescrever em produção** |
| `APP__VERSION`        | backend   | `0.0.0-dev`                                                      | versão do release, gravada no build                             |
| `RUN_MIGRATIONS`, `RUN_SEED` | backend | não se aplica                                              | `true`: migrações e seed antes de servir                        |
| `API_UPSTREAM`        | frontend  | não se aplica (proxy do Vite)                                    | `http://backend:8000`                                           |
| `VITE_API_BASE_URL`   | frontend  | `/api`                                                           | `/api`, fixado no build                                         |
| `LAUNCHER_FRONTEND_URL`, `LAUNCHER_BACKEND_URL` | lançador | `http://localhost:5173`, `http://localhost:8000` | definidas no Cloudflare Pages                       |

- Os padrões das imagens assumem uma rede Docker com os serviços `database` e `backend`; em outro ambiente basta sobrescrever as variáveis.
- `DATABASE__DSN` aceita o formato `postgresql://` entregue por provedores como o Neon; o backend converte para o driver `psycopg`.
- O frontend usa caminho relativo para a API: quem decide o destino real é o proxy (Vite em desenvolvimento, nginx na imagem). Só a hospedagem estática sem proxy precisa definir `VITE_API_BASE_URL` no build.

## Imagens de release

| Imagem   | Dockerfile                           | Base               | Conteúdo                                                       |
| -------- | ------------------------------------ | ------------------ | -------------------------------------------------------------- |
| backend  | `docker/release/backend/Dockerfile`  | `python:3.13-slim` | virtualenv só com dependências de produção, `src/` e migrações |
| frontend | `docker/release/frontend/Dockerfile` | `nginx:alpine`     | build estático do Vite e proxy `/api` configurável             |

- O contexto de build é sempre a raiz do repositório; cada Dockerfile tem um `Dockerfile.dockerignore` ao lado, em lista de permissão, para enviar ao daemon só o necessário.
- Ambas são multi-stage: ferramentas de build (Poetry, Node) nunca chegam à imagem final.
- A versão entra pelo argumento de build `APP_VERSION`, exposto pela API em `/api/health` e pelo rodapé do frontend.

## CI e release

```mermaid
flowchart LR
    pr[Pull request] --> ci[CI: só o que mudou]
    push[Push em main ou develop] --> ciall[CI completo] --> sr{semantic-release:<br/>há commit que gera versão?}
    sr -- não --> fim([nada é publicado])
    sr -- sim --> versions[atualiza versões] --> build[build das duas imagens] --> tag[commit e tag] --> push_images[push das duas imagens] --> gh[GitHub Release]
```

- **CI** (`.github/workflows/ci.yml`): em pull requests, roda apenas o lado alterado (backend, frontend, lançador ou mais de um); quando chamado pelo release, roda tudo. Cada lado valida formatação, lint, testes, build e o build da imagem de release; o backend também aplica as migrações num PostgreSQL de serviço e confere com `alembic check` que nenhum model ficou sem migração.
- **Release** (`.github/workflows/release.yml`): a cada push em `main` ou `develop`, roda o CI e depois o semantic-release.
- **Decisão de versão**: é o semantic-release quem decide, pelas mensagens de commit desde a última tag. `feat` gera minor, `fix` e `perf` geram patch, `BREAKING CHANGE` gera major; os demais tipos não geram versão e, portanto, nenhuma imagem.
- **Lockstep**: backend e frontend recebem sempre a mesma versão e são publicados juntos, mesmo que só um lado tenha mudado. Uma tag do frontend sempre identifica o backend com o qual foi construído.
- **Ordem segura**: as imagens são construídas no passo `prepare`, antes do commit de release e da tag; se um build falhar, nada é versionado. O push para o registro acontece no passo `publish`.
- **Canais**: `main` publica versões estáveis com a tag móvel `latest`; `develop` publica pré-versões `X.Y.Z-beta.N` com a tag móvel `beta`.
- **Registro**: `ghcr.io/<dono>/<repositório>/backend` e `ghcr.io/<dono>/<repositório>/frontend`.
- **Arquivos versionados**: o commit `chore(release)` atualiza `CHANGELOG.md`, o badge do `README.md`, `backend/pyproject.toml` e os `package.json`/`package-lock.json` da raiz e do frontend. As aplicações não leem esses arquivos em execução.

## Hospedagem

| Parte    | Serviço          | Observação                                                                         |
| -------- | ---------------- | ---------------------------------------------------------------------------------- |
| Lançador | Cloudflare Pages | Sempre no ar; endereço divulgado da demonstração                                   |
| Frontend | Render           | Imagem do GHCR com `API_UPSTREAM` apontando para o backend; hiberna sem tráfego    |
| Backend  | Render           | Imagem do GHCR; `CORS__ALLOW_ORIGINS` inclui o lançador; hiberna sem tráfego       |
| Banco    | Neon             | `DATABASE__DSN` com a URL fornecida pelo Neon; suspende sem uso                    |

- Como as instâncias gratuitas do Render levam de um a alguns minutos para acordar, o usuário entra sempre pelo lançador, que acompanha a inicialização e só então redireciona. Motivação e detalhes em [Arquitetura do lançador](launcher/ARCHITECTURE.md).
- Passo a passo de publicação: [backend no Render](backend/operations/02_render_deployment.md), [frontend no Render](frontend/operations/01_build_and_deployment.md#publicação-no-render) e [lançador no Cloudflare Pages](launcher/operations/01_cloudflare_deployment.md).
