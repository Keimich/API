# API - Node.js + Express + JWT
Este é um projeto de uma API feita em Node.js + Express que utiliza um sistema de autentificação por JWT.

## 🚀 Começando
Antes de iniciar a API é preciso criar um arquivo .env seguindo o modelo [.env.example](https://github.com/Keimich/API/blob/main/.env.example) que esta no repositório.

Com o terminal aberto na raiz do projeto rode o comando de instalação de dependências:
```
npm install
```
Dependências instaladas, agora é hora de subir os contêineres que a API ira utilizar:
```
docker-compose up -d api
```
O comando a cima ira subir dois contêineres, um da API e um para a base de dados (MySql) onde ira ser salva as informações.</br>
Agora é preciso entrar no contêiner da API e rodar o seguinte comando:
```
npx prisma db push
```
Este comando vai ser responsável por criar as tabelas no banco de dados conforme o arquivo [schema.prisma](https://github.com/Keimich/API/blob/main/prisma/schema.prisma)

Feito os comandos a cima a API já deve funcionar!

## ⚙️ Testes
Para testar as funcionalidades da API basta realizar requisições para a mesma. No repositório tem uma [collection](https://github.com/Keimich/API/blob/main/api.postman_collection.json) que pode ser importada no [Postman](https://www.postman.com/), nela contem todas as rotas da API.

## 📋 TO-DO
 - Implementação do [Swagger](https://swagger.io/)
 - Fazer teste automatizados utilizando o [Jest](https://jestjs.io/pt-BR/)
