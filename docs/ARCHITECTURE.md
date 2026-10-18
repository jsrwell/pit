# Visão geral da arquitetura

Este documento descreve como as partes do sistema se encaixam, como são executadas e como chegam a produção. Os detalhes internos de cada aplicação ficam em [Arquitetura do backend](backend/ARCHITECTURE.md) e [Arquitetura do frontend](frontend/ARCHITECTURE.md).

## Componentes

```mermaid
flowchart LR
    user([Cliente ou administrador]) --> frontend
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

| Variável              | Aplicação | Padrão local                                                     | Padrão na imagem de release                                     |
| --------------------- | --------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| `DATABASE__DSN`       | backend   | `postgresql+psycopg://cupcakes:cupcakes@localhost:5432/cupcakes` | `postgresql+psycopg://cupcakes:cupcakes@database:5432/cupcakes` |
| `SERVER__HOST`        | backend   | `0.0.0.0`                                                        | `0.0.0.0`                                                       |
| `SERVER__PORT`        | backend   | `8000`                                                           | `8000`                                                          |
| `SERVER__RELOAD`      | backend   | `false`                                                          | `false`                                                         |
| `CORS__ALLOW_ORIGINS` | backend   | `["http://localhost:5173"]`                                      | `["http://localhost:8080"]`                                     |
| `APP__VERSION`        | backend   | `0.0.0-dev`                                                      | versão do release, gravada no build                             |
| `AUTH__SECRET_KEY`    | backend   | segredo de desenvolvimento                                       | segredo de desenvolvimento; **sempre sobrescrever em produção** |
| `AUTH__ACCESS_TOKEN_MINUTES` | backend | `120`                                                   | `120`: validade da sessão                                       |
| `AUTH__MAX_FAILED_ATTEMPTS` | backend | `5`                                                      | `5`: tentativas de login antes do bloqueio                      |
| `AUTH__LOCKOUT_MINUTES` | backend | `15`                                                           | `15`: duração do bloqueio                                       |
| `ADMIN__EMAIL`, `ADMIN__PASSWORD`, `ADMIN__NAME` | backend | vazios (sem administrador)                     | vazios; quando definidos, o seed cria ou promove o administrador |
| `RUN_MIGRATIONS`      | backend   | não se aplica                                                    | `true`: aplica as migrações antes de servir                     |
| `RUN_SEED`            | backend   | não se aplica (`python src/seed.py` manual)                      | `true`: executa o seed idempotente antes de servir              |
| `SEED__DEMO_CATALOG`  | backend   | `true`                                                           | `true`: o seed carrega o catálogo de demonstração se vazio      |
| `API_UPSTREAM`        | frontend  | não se aplica (proxy do Vite)                                    | `http://backend:8000`                                           |
| `NGINX_PORT`          | frontend  | não se aplica                                                    | `80`                                                            |
| `VITE_API_BASE_URL`   | frontend  | `/api`                                                           | `/api`, fixado no build                                         |

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

- **CI** (`.github/workflows/ci.yml`): em pull requests, roda apenas o lado alterado (backend, frontend ou ambos); quando chamado pelo release, roda tudo. Cada lado valida formatação, lint, testes, build e o build da imagem de release; o backend também aplica as migrações num PostgreSQL de serviço e confere com `alembic check` que nenhum model ficou sem migração.
- **Release** (`.github/workflows/release.yml`): a cada push em `main` ou `develop`, roda o CI e depois o semantic-release.
- **Decisão de versão**: é o semantic-release quem decide, pelas mensagens de commit desde a última tag. `feat` gera minor, `fix` e `perf` geram patch, `BREAKING CHANGE` gera major; os demais tipos não geram versão e, portanto, nenhuma imagem.
- **Lockstep**: backend e frontend recebem sempre a mesma versão e são publicados juntos, mesmo que só um lado tenha mudado. Uma tag do frontend sempre identifica o backend com o qual foi construído.
- **Ordem segura**: as imagens são construídas no passo `prepare`, antes do commit de release e da tag; se um build falhar, nada é versionado. O push para o registro acontece no passo `publish`.
- **Canais**: `main` publica versões estáveis com a tag móvel `latest`; `develop` publica pré-versões `X.Y.Z-beta.N` com a tag móvel `beta`.
- **Registro**: `ghcr.io/<dono>/<repositório>/backend` e `ghcr.io/<dono>/<repositório>/frontend`.
- **Arquivos versionados**: o commit `chore(release)` atualiza `CHANGELOG.md`, o badge do `README.md`, `backend/pyproject.toml` e os `package.json`/`package-lock.json` da raiz e do frontend. As aplicações não leem esses arquivos em execução.

## Hospedagem prevista

| Parte    | Serviço          | Observação                                                  |
| -------- | ---------------- | ----------------------------------------------------------- |
| Frontend | Cloudflare Pages | Build estático com `VITE_API_BASE_URL` apontando para a API |
| Backend  | Render           | Imagem do GHCR; a instância gratuita hiberna sem tráfego    |
| Banco    | Neon             | `DATABASE__DSN` com a URL fornecida pelo Neon               |
