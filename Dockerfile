FROM node:16

#cria variável de ambiente HOME que armazena o valor do diretório principal da nossa aplicação dentro do container
ENV HOME=/home/app

RUN apt-get update 

#usando variável de ambient para copiar arquivos locais para dentro da pasta workdir do container
COPY package.json yarn.lock $HOME/node_docker/
#definindo diretório princiapal da nossa aplicação 
WORKDIR $HOME/node_docker 

RUN npm install --silent --progress=false 

#Copia para o diretório /node_docker todos os arquivos na raiz do projeto em . 
COPY . $HOME/node_docker 

CMD ["yarn", "start"]