FROM node:alpine as node-alpine

WORKDIR /usr/app

RUN mkdir -p /upload/audio

RUN mkdir -p /upload/video

COPY . .

RUN npm install

CMD ["npm", "run", "start"]