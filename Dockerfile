FROM node:14

WORKDIR /home/qwork-users


COPY package.json .

RUN npm install 

RUN npm install typescript -g

RUN npm install ts-node  -g

RUN npm install @types/express

RUN npm install nodemon -g

RUN npm install web-push -g


COPY . .

RUN npm install

EXPOSE 8101