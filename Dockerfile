FROM node:14

WORKDIR /home/back-end


COPY package.json .

RUN npm install 

RUN npm install typescript ts-node  --save-dev

RUN npm install @types/express

RUN npm install nodemon -g

RUN npm install  pm2 -g

COPY . .

EXPOSE 3000