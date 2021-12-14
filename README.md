# NaLista App - Grupo 6 

## Repositório Back-end

API desenvolvida durante o hackathon interturmas da escola de formação técnica Trybe <br>
De 11/12 a 13/12 de 2021.

### Sobre a aplicação
NaLista App - Edição Minas Gerais

A aplicação consiste em um catálogo colaborativo de eventos.
O foco principal é que os usuários encontrem atividades e eventos próximos para explorar em cidades de um determinado estado.
É também esperado que os usuários efetuem um cadastro e contribuam com novas atrações a medida que surgirem.

API desenvolvida para gerenciar as requisições e respostas da aplicação NaLista App - front-end encontrada neste reposítório :
- https://github.com/CamilaDamasio/grupo6_frontend

### Informações técnicas

- Aplicação desenvolvida em Node.JS/ Express
- O gerenciamento de dados foi feito utilizando o banco de dados MongoDB em duas coleções: usuários e eventos.
- Algumas validações de rotas foram feitas utilizando a dependência JOI.
- O mecanismo de autenticação utilizando JWT.

### Rodar localmente

Certifique-se que possui o mongodb instalado, configurado e executando o serviço.
- Clone este repositório
- instale as dependencias (script: npm install)
- execute o arquivo inserEvents.mongodb para visualizar os dados (opcional)
- rode o projeto na porta 3001 (script: npm run dev)
