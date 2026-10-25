# Frontend

- Raiz do projeto React + TypeScript + Vite; `npm` é executado a partir daqui, nunca da raiz do repositório.
- Arquitetura e convenções completas: `docs/frontend/ARCHITECTURE.md`; regras de código: `.claude/rules/typescript-coding.md`.
- A SPA sempre chama `/api` relativo; em desenvolvimento o Vite encaminha para `localhost:8000` e na imagem o nginx encaminha para `API_UPSTREAM`.
- Variáveis `VITE_*` são fixadas no build; não servem para configurar a imagem em execução, que usa as variáveis do nginx.
- Toda chamada HTTP passa por `request` (API) ou `requestExternal` (serviços públicos, como o ViaCEP) em `src/shared/api/http-client.ts`, que transformam qualquer falha em `ApiError`.
- O texto de erro exibido ao usuário vem de `src/shared/api/error-messages.ts`, pelo `code` do backend; nunca mostrar `title` ou `detail` da API.
- `CS-NET-0001` é um código só do frontend, para falha de rede; não existe no backend.
- Features em `src/features/` têm o mesmo nome dos módulos do backend e não importam umas das outras.
- Textos de tela em português do Brasil; código, nomes de arquivos e descrições de teste em inglês.
- Componentes indicam carregamento com `role="status"` e erro com `role="alert"`; os testes localizam elementos por esses papéis.
- Testes ficam ao lado do arquivo e substituem as funções de `api/` com `vi.spyOn`, nunca chamam o backend real.
- `npm run build` executa o `tsc` antes do Vite: erro de tipo quebra o build e o CI.
- A imagem de release é definida em `docker/release/frontend/`, não aqui.
