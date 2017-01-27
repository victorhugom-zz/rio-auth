FROM node:latest
MAINTAINER Victor Hugo Marques
LABEL Name=rio-auth Version=1.0.0
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["node", "./build/main.js"]
