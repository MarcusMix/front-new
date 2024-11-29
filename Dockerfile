# Define a imagem base como a versão 18 do Node.js com Alpine Linux. Essa imagem já contém o Node.js e o npm instalados, o que facilita a construção do seu projeto front-end.
# O 'AS build' nomeia esta etapa como "build" para uso posterior.
FROM node:18-alpine AS build

# Define o diretório de trabalho dentro do contêiner como /app. Todos os comandos subsequentes serão executados nesse diretório.
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se existir) do seu projeto local para o diretório /app dentro do contêiner.
COPY package*.json ./

# Executa o comando npm install para instalar as dependências do seu projeto.
RUN npm install

# Copia todo o conteúdo do seu projeto local para o diretório /app dentro do contêiner.
COPY . .

# Executa o script "build" definido no seu arquivo package.json. Esse script geralmente é responsável por gerar os arquivos estáticos da sua aplicação front-end.
RUN npm run build

# Define a imagem base como a versão estável do Nginx com Alpine Linux. Essa imagem é leve e otimizada para servir conteúdo web.
FROM nginx:alpine

# Copia o diretório dist, que contém os arquivos estáticos gerados na etapa anterior (build), para o diretório padrão do Nginx para servir arquivos estáticos.
COPY --from=build /app/dist /usr/share/nginx/html

# Copia o arquivo nginx.conf do seu projeto local para o diretório de configuração do Nginx dentro do contêiner.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 do contêiner. Isso permite que a aplicação seja acessada de fora do contêiner na porta padrão HTTP.
EXPOSE 80

# Define o comando que será executado quando o contêiner for iniciado. 
# Nesse caso, o comando inicia o Nginx em primeiro plano ("daemon off;") para que o contêiner continue em execução.
CMD ["nginx", "-g", "daemon off;"]