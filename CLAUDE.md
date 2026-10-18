# Cupcakes Gourmet — PIT II

- Projeto acadêmico (PIT II de Engenharia de Software): loja virtual de cupcakes com backend, frontend, banco, hospedagem, testes com 5 pessoas e laudo de qualidade.
- O que construir está nos cartões `docs/planning/cards/US01..US16`; o documento `docs/planning/original/SP01.md` é histórico e nunca é reescrito.
- `planning/` (raiz) é local e ignorado pelo Git: contém o enunciado da disciplina (PDF, DOCX) e a pesquisa `planning/RESEARCH.md` com o que cada situação-problema exige.
- Arquitetura: `docs/ARCHITECTURE.md` (sistema, CI, release), `docs/backend/ARCHITECTURE.md` e `docs/frontend/ARCHITECTURE.md`; ler antes de criar estrutura nova.
- O enunciado exige MVC: Model e Controller no backend, View no frontend; o mapeamento está documentado e deve continuar verdadeiro.
- Backend e frontend são projetos independentes (Poetry e npm), cada um com seu `CLAUDE.md`; comandos rodam a partir da pasta do projeto, não da raiz.
- O `package.json` da raiz serve só ao semantic-release; não adicionar dependências de aplicação nele.
- Nomes de módulo são os mesmos no backend (`modules/`) e no frontend (`features/`): system, catalog, accounts, cart, orders, promotions.
- Um cartão é implementado de ponta a ponta (migração, erro, rota, testes, tela) e o arquivo do cartão é atualizado no mesmo commit.
- Mudança de requisito em um cartão exige entrada em `history` no front matter do cartão, conforme `docs/planning/README.md`.
- O tipo do commit decide se sai versão e imagem: `feat`, `fix`, `perf` e breaking change publicam; os demais não. Âmbito é o código do cartão.
- Backend e frontend são sempre versionados e publicados juntos, com a mesma versão, mesmo que só um lado mude.
- Versões em `pyproject.toml` e `package.json` são escritas pelo release; nunca editar à mão.
- O VS Code deve ser aberto na raiz do repositório; `.vscode/` já configura as duas linguagens, tarefas e depuração.
- O desenvolvimento local usa só o banco em contêiner (`docker/dev/`); backend e frontend rodam nativamente.
- Ambiente principal é Windows com Git Bash: virtualenv em `backend/.venv/Scripts`, finais de linha LF forçados por `.gitattributes`.
