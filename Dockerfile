FROM node:alpine as node-alpine

WORKDIR /usr/app

COPY . .

RUN npm install

CMD ["npm", "run", "start"]