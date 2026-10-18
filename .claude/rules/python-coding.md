---
paths:
  - "**/*.py"
---

---

globs: ["*.py", "requirements.txt", "pyproject.toml"]
---

# Python — Regras de Código

## Formatação e Estilo

- Usa sempre o estilo de código **Black** e **Ruff** (imports organizados e ordenados).
- Máximo de **79 caracteres por linha** para código, comentários e docstrings (incluindo indentação).
- Valida com `poetry run black .` e `poetry run ruff check .` (a partir de `backend/`) após tarefas que envolvam código Python.
- Ficheiros Python fora de `backend/` (`.github/scripts/`, `.claude/hooks/`) usam a mesma configuração, passada com `--config backend/pyproject.toml`.
- O **Black** é a única autoridade sobre formatação, a 79 caracteres. O **Ruff** fica com os erros lógicos, as importações e a ordenação, e só recusa uma linha acima de 120 caracteres — a que o Black não consegue quebrar sozinho. A configuração é deliberadamente pouco agressiva para não travar o desenvolvimento.

## Docstrings

- Fornece docstrings (`"""`) para todas as funções, classes, módulos e métodos, seguindo as diretrizes oficiais da API Python, incluindo secções para Argumentos, Retornos e Exemplos, quando aplicável.
- Prefere docstrings de linha única quando adequado e considerado boa prática para a situação.

## Tipagem Estrita

- Todas as variáveis, funções, métodos, classes e módulos DEVEM ser estritamente tipados.
- Nunca uses `Any` ou deixares variáveis sem tipo. Onde o tipo é genuinamente aberto, usa `object`, `TypedDict`, `Protocol` ou uma união fechada.
- **Não existe verificador de tipos no projecto.** O `mypy` foi deliberadamente deixado de fora por travar mais do que ajuda. A tipagem estrita é regra de escrita e de revisão, não de ferramenta — o que a torna mais exigente, não menos.
- Conformidade com um `Protocol` que não tenha teste de comportamento próprio precisa de um teste que compare as assinaturas, porque nada a verifica estaticamente.

## Dicas Essenciais para Evitar Problemas

- Sempre escreva código antes de importação, pois existe um `hook` configurado (`.claude/hooks/organize_python_imports.py`) que, ao editar ou escrever um ficheiro Python em `backend/`, **remove importações** não usadas e organiza as importações restantes.

## Atenção na Edições e Escritas de Arquivos

- O sistema conta com HOOKS configurados para ruff que removem importações não utilizadas, portanto SEMPRE escreva código ANTES de importar qualquer coisa. Isso é importante para evitar loops e gasto desnecessário de token por tentar colocar importações sem código e elas sumirem.
- Nunca faças a importação numa edição isolada: ou o código que a consome já existe antes de a inserires, ou a importação entra na mesma edição/escrita que o código que a consome, para o hook do Ruff não a remover por estar momentaneamente sem uso.
