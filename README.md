#Instruções para uso da API

Rodar o comando '**npm install**' para instalar as dependências

Rodar o comando '**npm rum dev**' para rodar a aplicação em modo de desenvolvimento.

####Rotas configuradas na API todas com método **GET**

- Rota onde é possível ver a Documentação da API e testar suas funcionalidades

**_http://localhost:3000/api-docs_**[](http://localhost:3000/api-docs)

- Rota que retorna o último sorteio realizado

**_http://localhost:3000/megasena/resultados_**[](http://localhost:3000/megasena/resultados)

- Rota que retorna um sorteio específico através do número do concurso

**_http://localhost:3000/megasena/resultados/2555_**[](http://localhost:3000/megasena/resultados/2555) esse número pode ser trocado de acordo com o sorteio que quer visualizar

####Técnologias utilizadas

- Nodejs
- Typescript
- Express
- Puppeteer
- Swagger
