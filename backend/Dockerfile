# Use Node.js Alpine base image
FROM node:20.16.0-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 8000

CMD ["nodemon", "server.js"]
