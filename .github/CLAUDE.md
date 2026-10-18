# GitHub Actions e release

- `workflows/ci.yml` roda em pull requests só para o lado alterado e, chamado pelo release, roda tudo.
- `workflows/release.yml` roda em push para `main` (versões estáveis, tag `latest`) e `develop` (pré-versões `beta`), sempre depois do CI completo.
- Se sai versão quem decide é o semantic-release, pelas mensagens de commit; não há outro filtro, e as duas imagens são sempre geradas juntas.
- A configuração do semantic-release fica em `.releaserc.json` na raiz; a ordem dos plugins importa (exec antes de git, git antes de github).
- As imagens são construídas no `prepareCmd` e publicadas no `publishCmd`, para que um build quebrado não crie tag nem commit de release.
- `scripts/semantic-release/update_release_versions.py` grava a versão no badge do README e nos manifestos; manifestos recebem a versão sem sufixo de pré-versão.
- Arquivo novo que passe a carregar a versão precisa ser incluído no script de versões e nos `assets` do plugin git do `.releaserc.json`.
- O commit de release leva `[skip ci]` para não disparar outro release.
- O registro é o GHCR do próprio repositório, autenticado com `GITHUB_TOKEN`; não há segredos adicionais.
- Scripts Python daqui seguem as regras do backend e são validados com Black e Ruff usando `backend/pyproject.toml` como configuração.
