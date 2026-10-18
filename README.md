# Cupcakes Gourmet — Loja Virtual

![Versão](https://img.shields.io/badge/versao-1.4.0-blue)

Aplicação web da Loja Virtual de Cupcakes Gourmet, desenvolvida no Projeto Integrador Transdisciplinar em Engenharia de Software II. O cliente navega pela vitrine, monta o pedido, escolhe retirada ou entrega, paga e acompanha o pedido; o administrador mantém catálogo, disponibilidade, pedidos e promoções.

## Componentes

| Diretório                | Papel no MVC       | Tecnologia                                            |
| ------------------------ | ------------------ | ----------------------------------------------------- |
| [`backend/`](backend/)   | Model e Controller | Python 3.13, FastAPI, SQLAlchemy, Alembic, PostgreSQL |
| [`frontend/`](frontend/) | View               | React, TypeScript, Vite                               |
| [`docker/`](docker/)     | Infraestrutura     | Banco de desenvolvimento e imagens de release         |
| [`docs/`](docs/)         | Documentação       | Arquitetura e planejamento                            |

## Documentação

- [Visão geral da arquitetura](docs/ARCHITECTURE.md): componentes, execução local, configuração, CI e release.
- [Arquitetura do backend](docs/backend/ARCHITECTURE.md): monolito modular, camadas, persistência e contrato de erros.
- [Arquitetura do frontend](docs/frontend/ARCHITECTURE.md): organização por funcionalidade, cliente HTTP e tratamento de erros.
- [Planejamento](docs/planning/README.md): histórias de usuário (US01 a US16) que guiam a implementação.

## Execução local

Pré-requisitos: Python 3.13, Poetry 2, Node.js 22 e Docker.

1. Suba o banco: `docker compose -f docker/dev/docker-compose.yml up -d`.
2. Backend, em `backend/`: copie `.env.example` para `.env`, rode `poetry install`, `poetry run alembic upgrade head`, `poetry run python src/seed.py` (dados iniciais) e `poetry run python src/run.py`.
3. Frontend, em `frontend/`: rode `npm ci` e `npm run dev`, e acesse `http://localhost:5173`.

A documentação interativa da API fica em `http://localhost:8000/api/docs`.

## Versionamento

Versões e imagens Docker são geradas automaticamente pelo semantic-release a partir das mensagens de commit, com backend e frontend sempre publicados juntos na mesma versão. Detalhes em [Visão geral da arquitetura](docs/ARCHITECTURE.md#ci-e-release).
