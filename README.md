# Instruções para uso da API

Rodar o comando '**npm install**' para instalar as dependências

Rodar o comando '**npm rum dev**' para rodar a aplicação em modo de desenvolvimento.

### Rotas configuradas na API todas com método **GET**

- Rota onde é possível ver a Documentação da API e testar suas funcionalidades

**_ http://localhost:3000/api-docs _**[](http://localhost:3000/api-docs)

![Tela Principal](https://github.com/prsonda/API-Resultado-Mega-Sena/blob/master/tela%20principal.PNG)
![Último Resultado](https://raw.githubusercontent.com/prsonda/API-Resultado-Mega-Sena/master/consulta.PNG)

- Rota que retorna o último sorteio realizado

**_ http://localhost:3000/megasena/resultados _**[](http://localhost:3000/megasena/resultados)

- Rota que retorna um sorteio específico através do número do concurso

**_ http://localhost:3000/megasena/resultados/2555 _**[](http://localhost:3000/megasena/resultados/2555) esse número pode ser trocado de acordo com o sorteio que quer visualizar. Caso não seja informado um número de concurso, será retornado o último concurso realizado.

### Técnologias utilizadas

- Nodejs
- Typescript
- Express
- Puppeteer
- Swagger
