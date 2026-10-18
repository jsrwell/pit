---
code: "BE-OPS-02"
name: "Publicação do backend no Render"
updated: "2026/10/18"
---

# Publicação do backend no Render

O backend roda no Render como serviço web a partir da imagem publicada no GHCR pelo release, com banco no Neon.

## Imagem

- Endereço: `ghcr.io/<dono>/<repositório>/backend`, com a tag da versão ou `latest`.
- Se o pacote no GHCR for privado, o Render precisa de uma credencial de registro com um token do GitHub com permissão `read:packages`.
- O contêiner escuta na porta `8000`; se o Render não a detectar, informe-a nas configurações do serviço ou defina `SERVER__PORT` com a porta esperada.

## Variáveis obrigatórias

| Variável              | Valor                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| `DATABASE__DSN`       | Connection string do Neon, com `sslmode=require`                      |
| `AUTH__SECRET_KEY`    | Segredo aleatório e longo                                             |
| `ADMIN__EMAIL`        | E-mail do administrador                                               |
| `ADMIN__PASSWORD`     | Senha do administrador                                                |
| `CORS__ALLOW_ORIGINS` | JSON com a origem do [lançador](../../launcher/README.md) e do frontend, sem barra final |

As demais variáveis estão em [Configuração do backend](01_configuration.md).

## Inicialização

A cada início do contêiner, nesta ordem:

1. `alembic upgrade head` aplica as migrações pendentes (desligável com `RUN_MIGRATIONS=false`).
2. `python src/seed.py` cria o administrador e o catálogo demonstrativo, se ainda não existirem (desligável com `RUN_SEED=false`).
3. O servidor começa a responder.

Como as migrações conectam ao Neon antes de o servidor subir, uma resposta de `/api/health` também indica que o banco está acordado.

## Verificações após o deploy

```bash
curl https://<backend>.onrender.com/api/health
curl -i -H "Origin: https://<lancador>" https://<backend>.onrender.com/api/health | grep -i access-control-allow-origin
```

A primeira deve responder `{"status":"ok","version":"<versão>"}`; a segunda deve devolver a origem do lançador no cabeçalho `access-control-allow-origin`.

## Hibernação

Instâncias gratuitas hibernam após um período sem tráfego e levam de um a alguns minutos para voltar. O acesso público é feito pelo lançador, que acorda os serviços e acompanha a inicialização antes de abrir a loja.
