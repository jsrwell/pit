---
code: "FE-OPS-01"
name: "Build e publicação do frontend"
updated: "2026/10/18"
---

# Build e publicação do frontend

## Build

`npm run build` executa o `tsc` e o Vite e gera arquivos estáticos em `dist/`. Erro de tipo interrompe o build.

| Variável de build   | Padrão      | Uso                                                          |
| ------------------- | ----------- | ------------------------------------------------------------ |
| `VITE_API_BASE_URL` | `/api`      | Base da API; só muda em hospedagem sem proxy                 |
| `VITE_APP_VERSION`  | `0.0.0-dev` | Versão exibida no rodapé; preenchida pelo release            |

Variáveis `VITE_*` são fixadas no build. Localmente podem vir de `frontend/.env` (modelo em `.env.example`).

## Imagem de release

A imagem (`docker/release/frontend/`) serve o build com nginx e encaminha `/api` para o backend.

| Variável de execução | Padrão                | Uso                                         |
| -------------------- | --------------------- | ------------------------------------------- |
| `API_UPSTREAM`       | `http://backend:8000` | Endereço do backend, sem `/api` e sem barra final |
| `NGINX_PORT`         | `80`                  | Porta de escuta                             |

| Caminho          | Comportamento                                                     |
| ---------------- | ----------------------------------------------------------------- |
| `/api/`          | Encaminhado para `API_UPSTREAM`                                   |
| `/assets/`       | Arquivos com hash no nome; cache de um ano                        |
| `/health.json`   | `{ "status": "ok" }` sem cache e com CORS aberto, usado pelo lançador |
| demais caminhos  | `index.html`, para que as rotas da SPA funcionem ao recarregar   |

## Publicação no Render

1. Criar o serviço do backend antes: o nginx resolve `API_UPSTREAM` ao iniciar e o contêiner não sobe se o host não existir.
2. Criar o serviço do frontend com a imagem `ghcr.io/<dono>/<repositório>/frontend` e `API_UPSTREAM=https://<backend>.onrender.com`.
3. Como a SPA chama `/api` no mesmo domínio e o nginx repassa ao backend, o navegador não faz chamadas entre origens e o frontend não precisa de CORS.
4. Conferir `https://<frontend>.onrender.com/health.json` e a vitrine.

O endereço público da demonstração é o do [lançador](../../launcher/README.md), que acorda frontend e backend antes de redirecionar para a loja.

## Desenvolvimento local

```bash
cd frontend
npm ci
npm run dev
```

O Vite serve em `http://localhost:5173` e encaminha `/api` para `http://localhost:8000`.
