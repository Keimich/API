# Imagem base Node.js
FROM docker.io/node:lts

# Diretório de trabalho
WORKDIR /home/api

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todo o código fonte para o container
COPY . .

# Expor a porta 3000 para acesso externo
EXPOSE 3000

# Comando a ser executado ao iniciar o container
CMD ["npm", "start"]