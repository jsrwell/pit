# Lançador

- Página estática publicada no Cloudflare Pages que acorda backend e frontend no Render e redireciona para a loja; arquitetura em `docs/launcher/ARCHITECTURE.md`.
- HTML, CSS e JavaScript puros, sem dependências nem framework; `npm` só executa os scripts `build`, `serve` e `test`, a partir desta pasta.
- Não tem imagem Docker e não entra no release nem no versionamento das imagens.
- `src/` é publicado como está; `scripts/build.mjs` copia para `dist/` e gera `dist/config.js` a partir das variáveis `LAUNCHER_*` (ambiente ou `.env`).
- `src/config.js` não existe no repositório: ele só é gerado no build. Nunca editar `dist/`.
- Regras sem DOM ficam em `src/status.js`, para serem testadas com `node --test`; `src/app.js` só cuida da interface.
- A verificação do frontend usa `/health.json` (arquivo em `frontend/public/` com CORS liberado no nginx); a do backend usa `/api/health`, que exige a origem do lançador em `CORS__ALLOW_ORIGINS`.
- Identidade visual igual à da loja (cores, Cormorant Garamond e Manrope); textos em português do Brasil.
- Formatação com o Prettier do frontend: `npx prettier --config ../frontend/.prettierrc.json`.
