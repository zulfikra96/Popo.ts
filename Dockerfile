FROM node:14

WORKDIR /home/popo


COPY package.json .

RUN npm install -g pnpm; \ 
    pnpm setup; \
    export PNPM_HOME="/usr/local/share/pnpm" && export PATH="$PNPM_HOME:$PATH"; \
    pnpm bin -g; \
    pnpm add -g typescript@latest ; \
    pnpm add  -g ts-node; \
    pnpm add -g nodemon; \
    pnpm add @types/express; \
    pnpm add -g web-push; \
    pnpm add -g redis; 
    
COPY . .

CMD ["pnpm","install"]

EXPOSE 4000