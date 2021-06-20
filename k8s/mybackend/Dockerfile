FROM node:alpine

# wszystko co instalujemy będzie lądować w tym katalogu. Bez tego w katalogu głowynym
WORKDIR /opt/app

COPY ./package.json ./
RUN yarn install
COPY ./ ./
CMD yarn dev