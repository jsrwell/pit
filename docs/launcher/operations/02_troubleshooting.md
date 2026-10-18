---
code: "LN-OPS-02"
name: "Diagnóstico do lançador"
updated: "2026/10/18"
---

# Diagnóstico do lançador

Problemas mais comuns e como identificá-los. As ferramentas de desenvolvedor do navegador (F12) mostram as verificações na aba **Rede** e os bloqueios na aba **Console**.

## A API fica sempre em "Iniciando"

**Sintoma:** na aba Rede, `GET /api/health` responde `200`, mas o navegador não mostra o corpo da resposta, e o Console registra um erro de `Access-Control-Allow-Origin`.

**Causa:** o backend respondeu, mas sem liberar a origem do lançador; o navegador descarta a resposta antes de entregá-la ao JavaScript.

**Verificação:**

```bash
curl -s -i -H "Origin: https://<lancador>" https://<backend>.onrender.com/api/health | grep -i access-control-allow-origin
```

Sem saída, a origem não está liberada. Confira em `CORS__ALLOW_ORIGINS` do backend:

| Erro comum                         | Exemplo errado                    | Correto                          |
| ---------------------------------- | --------------------------------- | -------------------------------- |
| Barra no final                     | `"https://pit-4j8.pages.dev/"`    | `"https://pit-4j8.pages.dev"`    |
| Aspas simples em volta do JSON     | `'["https://..."]'`               | `["https://..."]`                |
| Domínio de preview                 | `https://<hash>.<projeto>.pages.dev` | endereço de produção          |
| Variável com um sublinhado         | `CORS_ALLOW_ORIGINS`              | `CORS__ALLOW_ORIGINS`            |

Salve a variável, aguarde o reinício do serviço e repita a verificação.

## A loja fica sempre em "Iniciando"

- Abra `https://<frontend>.onrender.com/health.json`. Deve responder `{ "status": "ok" }`.
- Se responder `404`, a imagem do frontend é anterior ao arquivo `health.json`; publique uma versão atual.
- Se o contêiner não sobe, confira `API_UPSTREAM`: o nginx precisa resolver o endereço do backend ao iniciar.

## Demora muito

- O primeiro acesso após um período sem visitas pode levar alguns minutos no plano gratuito do Render; depois de 3 minutos o lançador mostra um aviso e continua verificando.
- O backend só responde depois de aplicar as migrações no Neon; se o banco estiver suspenso, ele acorda nessa etapa.
- Consulte os logs do serviço no Render para ver em que etapa a inicialização está.

## Redireciona para o endereço errado

O destino vem de `LAUNCHER_FRONTEND_URL`, gravado no build. Corrija a variável no Cloudflare Pages e refaça o deploy.

## O build falha no Cloudflare

| Mensagem                                             | Ação                                                 |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `LAUNCHER_... must be an absolute URL`               | Informe a URL completa, com `https://`               |
| `LAUNCHER_... must be a positive number`             | Use um número maior que zero                         |
| Erro de sintaxe ou módulo do Node                    | Defina `NODE_VERSION=22`                             |
| Saída `dist` não encontrada                          | Confira o diretório raiz `launcher` e a saída `dist` |
