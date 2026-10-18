---
code: "LN-00"
name: "Documentação do lançador"
updated: "2026/10/18"
---

# Documentação do lançador

Página estática de entrada da demonstração, publicada no Cloudflare Pages e sempre disponível. Ela acorda o frontend e o backend hospedados no plano gratuito do Render, acompanha a inicialização e leva o visitante à loja quando tudo está pronto.

## O que entrega

| Recurso                       | Comportamento                                                        |
| ----------------------------- | -------------------------------------------------------------------- |
| Início sob demanda            | Os serviços só são acordados quando o visitante clica em "Iniciar demonstração" |
| Verificação dupla             | Loja e API verificadas em paralelo a cada 10 segundos                |
| Situação por serviço          | Selos "Aguardando", "Iniciando" e "Disponível"                       |
| Progresso e contagem          | Barra de progresso estimada e tempo até a próxima verificação        |
| Aviso de demora               | Mensagem explicativa após 3 minutos, sem interromper as verificações |
| Redirecionamento              | Para a loja assim que os dois serviços respondem, com botão de reserva |
| Identidade visual             | Mesmas cores, tipografia e marca da loja                             |

## Índice

| Código     | Documento                                                              |
| ---------- | ---------------------------------------------------------------------- |
| LN-ARCH    | [Arquitetura do lançador](ARCHITECTURE.md)                             |
| LN-OPS-01  | [Publicação no Cloudflare Pages](operations/01_cloudflare_deployment.md) |
| LN-OPS-02  | [Diagnóstico](operations/02_troubleshooting.md)                        |
