---
code: "LN-OPS-01"
name: "Publicação no Cloudflare Pages"
updated: "2026/10/18"
---

# Publicação no Cloudflare Pages

O lançador é publicado como site estático no Cloudflare Pages, ligado ao repositório. A cada push na branch de produção, o Pages refaz o build e publica.

## Projeto

| Campo                    | Valor            |
| ------------------------ | ---------------- |
| Production branch        | `main`           |
| Framework preset         | `None`           |
| Root directory           | `launcher`       |
| Build command            | `npm run build`  |
| Build output directory   | `dist`           |

Com o diretório raiz em `launcher`, o comando roda dentro dessa pasta e a saída `dist` é lida em relação a ela. Sem diretório raiz, o equivalente é `cd launcher && npm run build` com saída `launcher/dist`.

Se o projeto for criado pelo fluxo de Workers em vez do Pages, o comando de implantação precisa publicar a pasta de saída, por exemplo `npx wrangler deploy --assets=./dist --name=<projeto> --compatibility-date=2025-01-01`.

## Variáveis de ambiente

| Variável                           | Valor                                   |
| ---------------------------------- | --------------------------------------- |
| `LAUNCHER_FRONTEND_URL`            | `https://<frontend>.onrender.com`       |
| `LAUNCHER_BACKEND_URL`             | `https://<backend>.onrender.com`        |
| `LAUNCHER_POLL_SECONDS`            | `10`                                    |
| `LAUNCHER_REQUEST_TIMEOUT_SECONDS` | `8`                                     |
| `NODE_VERSION`                     | `22`                                    |

- URLs sem barra no final; a do backend sem `/api`.
- Os valores são gravados no build. Depois de alterar uma variável, refaça o deploy.
- Um valor inválido faz o build falhar com o nome da variável no log, em vez de publicar uma página quebrada.

## Ajustes nos serviços do Render

| Serviço  | Ajuste                                                                                     |
| -------- | ------------------------------------------------------------------------------------------ |
| Backend  | Incluir a origem exata do lançador em `CORS__ALLOW_ORIGINS`, por exemplo `["https://<projeto>.pages.dev","https://<frontend>.onrender.com"]` |
| Frontend | `API_UPSTREAM` apontando para o backend                                                    |

## Recomendações

- **Build watch paths:** incluir apenas `launcher/*`, para que mudanças no backend ou no frontend não reconstruam o lançador.
- **Domínio próprio:** se configurado, também precisa entrar em `CORS__ALLOW_ORIGINS`.
- **Deploys de preview** recebem subdomínios aleatórios que não estão liberados no CORS; teste sempre pelo endereço de produção.
- Divulgue o endereço do lançador como endereço oficial da demonstração.
