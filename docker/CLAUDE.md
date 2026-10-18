# Docker

- `dev/` contém só o que o desenvolvimento local precisa em contêiner (o PostgreSQL); backend e frontend rodam fora do Docker em desenvolvimento.
- As credenciais do banco de `dev/` (`cupcakes`) são as mesmas dos padrões do backend, do CI e da imagem; mudar uma exige mudar todas.
- `release/` contém um Dockerfile por aplicação, sempre construído com a raiz do repositório como contexto.
- Cada Dockerfile tem um `Dockerfile.dockerignore` ao lado, em lista de permissão; arquivo novo copiado na imagem precisa ser liberado nele.
- Os padrões de ambiente das imagens assumem uma rede com os serviços `database` e `backend`; em outro ambiente as variáveis são sobrescritas, nunca o Dockerfile.
- A versão entra só pelo argumento de build `APP_VERSION`; nenhum Dockerfile lê versão de arquivo.
- A imagem do frontend gera a configuração do nginx a partir de `default.conf.template` na inicialização, substituindo apenas variáveis definidas no ambiente.
- O nginx resolve `API_UPSTREAM` ao iniciar: o host precisa existir nesse momento, ou o contêiner não sobe.
- Quem constrói e publica as imagens é `.github/scripts/semantic-release/release_images.sh`; o CI também as constrói, sem publicar, para validar.
