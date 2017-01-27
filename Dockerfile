FROM node:latest
MAINTAINER Victor Hugo Marques
LABEL Name=rio-auth Version=1.0.0
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

EXPOSE 3010
ENTRYPOINT ["node", "./build/main.js"]
