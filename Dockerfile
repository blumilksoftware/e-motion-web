FROM node:20-alpine

WORKDIR /usr/src/app/e-motion-web
RUN npm install -g @vue/cli
VOLUME /usr/src/app/e-motion-web/node_modules
COPY package*.json ./
RUN npm install
EXPOSE 8080

CMD ["npm", "run", "serve"]
